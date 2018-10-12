function(doc) {
  if (doc.getId() !== null) {
    var inputField = "id";
    var outputField = "file_extension_with_no_dot";
    
    var id = doc.getId();
    var regex = /.*\.([\w]*)$/;
    var extension = regex.exec(id)[1];
    
    doc.setField(outputField, extension);
  }
  
  return doc;
}
