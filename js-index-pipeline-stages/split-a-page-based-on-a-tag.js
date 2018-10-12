// So if you had an HTML page that had multiple sections demarcated by the use of a tag 
// (say <h3>) and you wanted a new page for each chunk you could do the following:

function(doc) {
  var id = doc.getId();
  if (id !== null) {
    var contentField = 'body';
    
    // remove the head
    var body = doc.getFirstFieldValue(contentField);
    
    var idx = body.indexOf('<h3>');
    content = body.substring(idx);
    
    // Get enough of a chunk to create a new document
    contentArray = content.split('<h3>');
    var newDocs = [];
    for (i = 1; i < contentArray.length; i++ ) {
      // create another doc
      var newDoc = new com.lucidworks.apollo.common.pipeline.PipelineDocument(id + '#' + i);
      newDoc.setField(contentField, '<h3>' + contentArray[i]);
      
      // copy over any fields from the parent doc here...
      newDoc.addField("_lw_data_source_s", doc.getFirstFieldValue("_lw_data_source_s"));
        
      newDocs.push(newDoc);
    }
    
    return newDocs;
  }
  
  return doc;
}
