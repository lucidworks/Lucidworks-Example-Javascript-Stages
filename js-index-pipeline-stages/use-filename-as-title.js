// As it turns out, not all documents have a title. As a stopgap 
// I used the filename (sans extension) as the title. If the title 
// has underscores this turns the underscores into spaces.

function(doc) {
  if (doc.getId() !== null) {
    var titleField = 'title';
    var filenameField = 'resourceName';
    if (!doc.hasField(titleField) && doc.hasField(filenameField)) {
      var filename = doc.getFirstFieldValue(filenameField);
      
      // remove trailing params
      var idx = filename.indexOf('?');
      if (idx > -1) {
        idx--;
        filename = filename.substring(0, idx);
      } // else there are no trailing params
      
      var pattern = /.*\/(.*)\..*$/;
      var newTitle = pattern.exec(filename)[1];
      newTitle = newTitle.replace(/_/, ' '); 
      
      doc.setField(titleField, newTitle);
    } // else this has a title
  }
  
  return doc;
}
