// very aggressive tag remover. removes non-HTML tags as well
function(doc) {
  if (doc.getId() !== null) {
    var inputField = "content";  // change this
    var outputField = "content";  // change this
    var inputValue = doc.getFirstFieldValue(inputField);

    var regex = "\\<.*?\\>";
    inputValue = inputValue.replaceAll(regex, "");
    doc.setField(outputField, inputValue);
  }

  return doc;
}
