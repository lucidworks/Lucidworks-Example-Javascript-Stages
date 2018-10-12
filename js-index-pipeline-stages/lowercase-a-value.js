function(doc) {
  if (doc.getId() !== null) {
    var fieldname = 'param.query_s';
    var value = doc.getFirstFieldValue(fieldname);
    value = value.toLowerCase();
    
    doc.setField(fieldname,value);
  }
  
  return doc;
}
