//
// Given an input field and an output field
// take the string of params, split them by ampersand
// and then take the name/value pair and store the name
// in the output field.
//
function(doc) {
 var inputField = "params";
 var outputField = "paramList";
 var delimiter1 = "&";
 var delimiter2 = "=";
 
 var inputValue = doc.getFirstFieldValue(inputField);
 var paramList = inputValue.split(delimiter1);
 
 for (i = 0; i < paramList.length; i++) {
   logger.info("***** paramList[" + i + "]: " + paramList[i]);

   var nameValue = paramList[i].split(delimiter2);
   var name = nameValue[0];
   logger.info("***** name: " + name);
   
   doc.addField(outputField, name);
 }
 
 return doc;
}
