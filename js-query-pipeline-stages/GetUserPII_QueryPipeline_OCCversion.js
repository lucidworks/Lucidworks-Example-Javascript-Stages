/*
This JS stage will make a connection to SQL Server and run a prefab query to determine if the current Fusion user has permission to see
documents with Personally Identifiable Information.  It uses an fq parameter to Solr to filter documents that contain a string value of "true" for a
field called "pii_b".  This field is set in a custom JS stage on the indexing side.

The jarfile for MS SQL Server (along with all 3rd party jars) goes in <fusion home>/apps/libs
Entries for those jarfiles get added to <fusion home>/4.0.1/apps/jetty/connectors-classic/webapps/connectors-extra-classpath.txt (INDEXING SIDE)
and <fusion home>/4.0.1/apps/jetty/api/webapps/api-extra-classpath.txt (QUERY SIDE)

NOTE:  for connections to SQL Server that support Integrated Auth, the connection string should be something like this instead:
jdbc:sqlserver://servername;databaseName=dbname;integratedSecurity=true

Also, it is not necessary to pass the user and password in that case.
*/

var getConnection = function() {
 
    // try to use a valid existing connection first but does not yet offer pooling
    // TODO:  implement connection pooling
    
    var Properties = Java.type("java.util.Properties");
    var Driver = Java.type("com.microsoft.sqlserver.jdbc.SQLServerDriver");
    var driver = new Driver();
    var properties = new Properties();
    var conn = null;
    try {
        //properties.setProperty("user", "sv");
        //properties.setProperty("password", "MS$QLS3rver");
        conn = driver.connect("jdbc:sqlserver://asSISRPTd;databaseName=evrpdevl;integratedSecurity=true", properties);
        return conn;
    }
    catch (ex) {
        logger.error("ZZZZZ Unable to get connection to SQL Server: " + ex);
    }
    finally {}

}  // end getConnection

/* ***
Main function
*** */
function (request, response, ctx, collection, solrServer, solrServerFactory) {
    function getPIIUser(conA, query) {
        var resultSet = java.sql.ResultSet;
        try {
            var stmt = conA.prepareStatement(query);
            resultSet = stmt.executeQuery();
            // not all users have entries in this table.  Check for this so PII data is not revealed accidentally
            // use the fq parameter to filter items accordingly 
            if ( ! resultSet.isBeforeFirst())
            {
                request.addParam("fq", "pii_b:false");
                logger.info("\n\t>>>>> No rows returned for this user, pii_b set to false");
            }
            while (resultSet.next()) {
                var userGroup = resultSet.getString("spgd_group_nm");
                if (userGroup != 'EV Search + PII') {
                    request.addParam("fq", "pii_b:false");
                    logger.info("\n\t>>>>> This user does not have access to documents with PII, filtering results using fq=pii_b:false");
                }
                else {
                    logger.info("\n\t>>>>> This user has a sgpd_group_nm of 'EV Search + PII' so no results will be filtered");
                }
            }  // end while
        }
        catch (e) {
            logger.error("\n>>>>> Error calling prepared statement: " + e);
        }
        finally {
            if (resultSet) {
                try {
                    resultSet.close();
                    logger.info("\n>>>>> Prepared Statement ResultSet closed");
                } catch (e) {
                    logger.error("\n>>>>> Error closing RS: " + e);
                }
            }
            if (stmt) {
                try {
                    stmt.close();
                    logger.info("\n>>>>> Prepared Statement  closed");
                } catch (e) {
                    logger.error("\n>>>>> Error closing Prepared Statement: " + e);
                }
            }
       
            logger.info("\n\t>>>>> After pii check, current value is " + request.getParam("fq"));

        }  // end finally
    } // end function

    var connection = getConnection();
    if ( connection != null ) {
        logger.info("\nZZZZZ SQL Server connection " + connection);

        // run prepared statement to get user's permission level
        
        // get the current logged-in user
        var curLoggedInUser = ctx.authorizationContext.toHeaders().get('fusion-user-name')[0];

        /*
            alternatives to get user name, didn't work for the customer's POC env
            var curLoggedInUser = request.getParam('userName');
            var headers = request.headers;
            request.addParam('username', headers.getFirst('fusion-user-name'));
        */
        logger.info("\nZZZZZ Found user " + curLoggedInUser);

        var query = "select  top 1 spgd_group_nm from t_ussg_user_spgd_group join t_spgd_security_group_def on ussg_spgd_id=spgd_id where ussg_user_id=(select top 1 user_id from t_user where user_ntwk_acct_nm='" + curLoggedInUser + "' and user_actv_in='Y')  and spgd_app_scad_id=(select scad_id from t_scad_app_def where scad_app_nm='Examiner View') and (spgd_group_nm='EV Search' or spgd_group_nm='EV Search + PII') order by spgd_id desc";

        getPIIUser(connection, query);

        if (connection) {
            try {
                connection.close();
                logger.info("\n>>>>> Connection closed");
            } catch (e) {
                logger.error("\n>>>>> Error closing connection: " + e);
            }
        }
    }  // end if
    return;
} // end main