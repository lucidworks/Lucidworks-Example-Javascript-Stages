// This is code I used to read two inbound docs and merge them together.

// Assumptions: the two related documents come in one after the other
// so I just have to save a doc long enough for the next doc to come in.

var tempDoc = null;

function(doc) {
  if (doc.getId() !== null) {
    // this is paranoid
    if (tempDoc !== null && (tempDoc.getFirstFieldValue("dbDocID") != doc.getFirstFieldValue("dbDocID"))) {
      logger.info("***** Setting tempDoc to null (" + tempDoc.getFirstFieldValue("dbDocID") + " vs " + doc.getFirstFieldValue("dbDocID") + ") *****");
      tempDoc = null;
    }
    
    if (tempDoc === null) {
      // we have a new pair of doc coming in
      // save the first one and wait for the second
      logger.info("******** No tempDoc. Saving " + doc.getFirstFieldValue("dbDocID") + " : " + doc.getFirstFieldValue("_lw_parser_content_type_s"));
      tempDoc = doc;
      
      // When the next doc comes in, we merge,
      // and then we return the new doc
      logger.info("******** Returning null...");
      return null;
    } else {
      // tempDoc != null so it has a doc
      logger.info("******** A tempDoc found (" + tempDoc.getFirstFieldValue("dbDocID") + ") : " + tempDoc.getFirstFieldValue("_lw_parser_content_type_s"));
      logger.info("******** Current doc (" + doc.getFirstFieldValue("dbDocID") + ") : " + doc.getFirstFieldValue("_lw_parser_content_type_s"));
      
      if (doc.getFirstFieldValue("_lw_parser_content_type_s").equals("application/pdf")) {
        logger.info("***** Incoming doc is a PDF. Calling addMetadataToPDF()");
        doc = addMetadataToPDF(doc,tempDoc);
      } else {
        // it equals a JSON
        logger.info("***** Incoming doc is a JSON. Calling takeMetadataFromJSON()");
        doc = takeMetadataFromJSON(doc,tempDoc);
      }
      
      //reset the global variable
      tempDoc = null;
      
      // this should be a fully merged doc
      logger.info("******** Returning a merged doc for: " + doc.getFirstFieldValue("dbDocID"));
      
      return doc;
    }
  }
}

function addMetadataToPDF(doc, tempDoc) {
  doc.addField("docType", tempDoc.getFirstFieldValue("docType"));
  doc.addField("publishDate", tempDoc.getFirstFieldValue("publishDate"));
  doc.addField("title", tempDoc.getFirstFieldValue("title"));
  doc.addField("filename", tempDoc.getFirstFieldValue("filename"));
  doc.addField("Abstract", tempDoc.getFirstFieldValue("Abstract"));
  doc.addField("fcReportType", tempDoc.getFirstFieldValue("fcReportType"));
  
  // multivalued fields
  doc.addField("regionFilters", tempDoc.getFieldValues("regionFilters"));
  doc.addField("marketSectorFilters", tempDoc.getFieldValues("marketSectorFilters"));
  
  return doc;
}

function takeMetadataFromJSON(doc, tempDoc) {
  tempDoc.addField("docType", doc.getFirstFieldValue("docType"));
  tempDoc.addField("publishDate", doc.getFirstFieldValue("publishDate"));
  tempDoc.addField("title", doc.getFirstFieldValue("title"));
  tempDoc.addField("filename", doc.getFirstFieldValue("filename"));
  tempDoc.addField("Abstract", doc.getFirstFieldValue("Abstract"));
  tempDoc.addField("fcReportType", doc.getFirstFieldValue("fcReportType"));
  
  // multivalued fields
  tempDoc.addField("regionFilters", doc.getFieldValues("regionFilters"));
  tempDoc.addField("marketSectorFilters", doc.getFieldValues("marketSectorFilters"));
  
  return tempDoc;
}
