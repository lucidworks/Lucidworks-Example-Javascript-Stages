function(doc) {
  if (doc.getId() !== null) {
    var inputField = "adverse_reactions";
    var outputFieldPrefix = "SO";
    var delim = ":";
    
    var list = doc.getFieldValues(inputField);
    var length = list.size();
    var suffix = 0;

    // Take one string, get the values after the colon
    // split the values after the colon, trim away leading and trailing spaces
    // add the new field to the doc
    for(i = 0; i < length; i++) {
      ++suffix;
      var strings = list.get(i).split(delim);

      var values = strings[1].trim().split(",");
      
      var outputField = outputFieldPrefix + suffix;
      doc.setField(outputField, values[0]);
      for (j = 1; j < values.length; j++) {
        doc.addField(outputField, values[j].trim());
      }
    }
  }
  
  return doc;
}
