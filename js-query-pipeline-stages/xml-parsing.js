// XML Parsing Query-side
//
// If you really need to call out to something, and its output is XML, 
// then put a Javascript stage after the REST Query stage and put this in it:

logger.info("******** START In the Javascript stage!");
// logger.info("********" + request.getFirstParam("queryRPC"));

factory = javax.xml.parsers.DocumentBuilderFactory.newInstance();
try {
    var xmlStr = request.getFirstParam("queryRPC");
  
    var builder = factory.newDocumentBuilder();
    var doc = builder.parse(new java.io.StringBufferInputStream(xmlStr));

    // Create XPathFactory object
    logger.info("********** Creating new XPathFactory...");
    var xpathFactory = javax.xml.xpath.XPathFactory.newInstance();

    // Create XPath object
    logger.info("********** Creating new XPath...");
    var xpath = xpathFactory.newXPath();
    logger.info("******** XPath: " + xpath);
    var expr = xpath.compile("/current/city/country/text()");
    logger.info("******** Expr: " + expr);
    var country = expr.evaluate(doc, javax.xml.xpath.XPathConstants.STRING);

    logger.info("******** Country: " + country);
  
    request.putSingleParam("q", country);
} catch (e) {
    logger.info(e.getMessage());
    e.printStackTrace();
}

logger.info("******** END In the Javascript stage!");
