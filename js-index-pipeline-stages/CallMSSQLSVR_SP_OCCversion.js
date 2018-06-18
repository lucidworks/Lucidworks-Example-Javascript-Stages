/* 
This stage sets a document field called pii_b to indicate whether a document has PII according to the result set from a stored procedure.

The jarfile for MS SQL Server (along with all 3rd party jars) goes in <fusion home>/apps/libs
Entries for those jarfiles get added to <fusion home>/4.0.1/apps/jetty/connectors-classic/webapps/connectors-extra-classpath.txt (INDEXING SIDE)
and <fusion home>/4.0.1/apps/jetty/api/webapps/api-extra-classpath.txt (QUERY SIDE)

NOTE:  for connections to SQL Server that support Integrated Auth, the connection string should be something like this instead:
jdbc:sqlserver://servername;databaseName=dbname;integratedSecurity=true

Also, it is not necessary to pass the user and password in that case.
*/

var getConnection = function() {

    var Properties = java.util.Properties;
    var Driver = com.microsoft.sqlserver.jdbc.SQLServerDriver;
    var driver = new Driver();
    var properties = new Properties();
    var conn = null;

    try {
        conn = driver.connect("", properties);
        return conn;
    }

    catch (ex) {
        logger.error("ZZZZZ Unable to get connection to SQL Server: " + ex);
    }

    finally {}
}

function (doc) {
  
  function runStoredProc(conA, proc, acode, aid) {
        var resultSet = java.sql.ResultSet;
        var stmt = java.sql.CallableStatement;
        try {
          stmt = conA.prepareCall("{call " + proc + "(?,?)}");
           
          stmt.setString("documentcode", acode);
          stmt.setLong("documentid", aid);
          resultSet = stmt.executeQuery();

          logger.info("\n>>>>> Results:");

           while (resultSet.next()) {
                
                // PII check vars
                var piiVal = "";
                var piiDocVal = "true";


                // this data source uses key/value pairs to name and assign value to metadata
                // we are particularly interested in a key of "Flagged_As_PII"
                var bname = resultSet.getString("name");
                bname = bname.replace(/ /g, '_');
                var bcontent = resultSet.getString("content")
                logger.info("\n\t>>>>> Setting " + bname + " as name and " + bcontent + " as content");
                doc.setField(bname, bcontent);

                // check for Flagged_As_PII based on value returned from stored proc
                // a preceeding Field Mapping stage will set this to false, so only set to true below if needed
                logger.info("\n\t>>>>> Current key/value pair: ->" + bname + "<- / ->" + bcontent + "<-");
                if (bname === "Flagged_As_PII") {
                    
                    // only set pii_b if the document has a Flagged_As_PII key in the DB
                    if (bcontent === 'Y') {
                     doc.setField("pii_b", piiDocVal);
                    }
                    
                    logger.info("\n\t>>>>> Setting pii_b as " + piiDocVal + " for document " + doc.getId());
                }  // end if
            } // end while

        } catch (ex) {
            logger.error("\n>>>>> Error calling stored proc: " + ex);
        } finally {
            if (resultSet) {
                try {
                    resultSet.close();
                    logger.info("\n>>>>> ResultSet closed");
                } catch (e) {
                    logger.error("\n>>>>> Error closing RS: " + e);
                }
            }
            if (stmt) {
                try {
                    stmt.close();
                    logger.info("\n>>>>> CallableStatement closed");
                } catch (e) {
                    logger.error("\n>>>>> Error closing CS: " + e);
                }

            }
            if (conA) {
                try {
                    conA.close();
                    logger.info("\n>>>>> Connection closed");
                } catch (e) {
                    logger.error("\n>>>>> Error closing connection: " + e);
                }
            }
        }
    }

  var connection = getConnection();
  if ( connection != null ) {
    logger.info("\nZZZZZ SQL Server connection " + connection);

    // get properties from the document that will inform the stored proc
    var acode = doc.getFirstFieldValue('acode_s')
    var aid = doc.getFirstFieldValue('aid_s')
    runStoredProc(connection, "dbo.pr_asr_document_meta", acode, aid);   
  }

  return doc;
}