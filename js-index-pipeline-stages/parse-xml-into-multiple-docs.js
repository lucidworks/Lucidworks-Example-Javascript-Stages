// Parsing an XML Document into Multiple Docs
// (So I wrote this as the OOB XML Transformer stage did not do the trick
// and when I tried the LWL XML Parser stage it did not appear to work either.
// In fact, the LWL XML Parser can do this just fine. Just use the same XPaths 
// used in the below code)

// There was a rather interesting use case that neither XML parser stage could handle: 
// create child docs, but only include the elements specific to a given child. 
// What was happening was:
// - 2 children with different names (item_nnnn)
// - both had identical fields defined in each child
// - we could not use normal XPath as the child names were different even as the element names for each child were the same
// - using XPath pulled the element values from both children and stuffed them into one child 
//   leaving the other sad and bereft of values
// 
// This Javascript handles the above scenario by iterating over each child individually before applying the XPath.
// 
// Interesting to note: 
//   this code is returning an array of pipeline documents which it creates one at a time and stores into the array.

function(doc) {
  logger.info("******** START In the Javascript stage!");
 
 var newDocs = [];
  if (doc.getId() !== null) {
    logger.info("******** doc.getId() !== null");
    var id = doc.getId();
    var xmlField = "body";
    factory = javax.xml.parsers.DocumentBuilderFactory.newInstance();
    try {
      var xmlStr = doc.getFirstFieldValue(xmlField);
      // logger.info("******** xmlStr: " + xmlStr);
  
      var builder = factory.newDocumentBuilder();
      logger.info("******** builder: " + builder);
      var dom = builder.parse(new java.io.StringBufferInputStream(xmlStr));
      logger.info("******** dom: " + dom);

      // Create XPathFactory object
      logger.info("********** Creating new XPathFactory...");
      var xpathFactory = javax.xml.xpath.XPathFactory.newInstance();

      // Create XPath object
      logger.info("********** Creating new XPath...");
      var xpath = xpathFactory.newXPath();
      logger.info("******** XPath: " + xpath);
      
      // the number of nodes is the number of documents to output
      var nodes = xpath.evaluate("/data_pim/items/*", dom, javax.xml.xpath.XPathConstants.NODESET);
      logger.info("******** nodes.getLength(): " + nodes.getLength());
      for (i = 0; i < nodes.getLength(); i++) {
        var newDoc = new com.lucidworks.apollo.common.pipeline.PipelineDocument(id + '-' + i);
        
        node = nodes.item(i);
        logger.info("******** node.getName(): " + node);

        // extract fields and their values here
        var gsaStarRating = xpath.evaluate("./nutrition/health_star_rating/@amount-per-serving", node);
        logger.info("******** gsaStarRating: " + gsaStarRating);
        newDoc.addField("gsaStarRating", gsaStarRating);

        // copy over any fields from the parent doc here...
        newDoc.addField("_lw_data_source_s", doc.getFirstFieldValue("_lw_data_source_s"));
        
        newDocs.push(newDoc);
      }
  
    } catch (e) {
      e.printStackTrace();
    }
  }
  
  logger.info("******** END In the Javascript stage!");
  
  return newDocs;
}
