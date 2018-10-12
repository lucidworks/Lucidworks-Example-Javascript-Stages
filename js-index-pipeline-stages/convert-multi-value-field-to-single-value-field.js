// Multi-valued Field into a Single Value field
// So input like:
//
// name    ["joe","beth","mary"]
//
// and you want output like:
//
// name_s "joe, beth, mary"

function(doc){
  if (doc.getId() !== null){
    var inputfield = "name";
    var outputfield = "name_s";
    var fieldseparater = ",";
    
    var fieldValues = doc.getFieldValues(inputfield);
    var length = fieldValues.size();
    var outputvalue = "";
    if (length > 0) {
      outputvalue = fieldValues.get(0);
    }
    for(i = 1; i < length; i++) {
      outputvalue = outputvalue + fieldseparater + fieldValues.get(i);
    }
    
    if (outputvalue !== null) {
      doc.setField(outputfield, outputvalue);
    }
  }
  
  return doc;
}
