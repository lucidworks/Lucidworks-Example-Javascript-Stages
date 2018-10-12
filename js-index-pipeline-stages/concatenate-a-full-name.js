function(doc) {
  if (doc.getId() !== null) {
    var firstnameField = "firstname";
    var middlenameField = "middlename";
    var lastnameField = "lastname";

    var fullnameField = "fullname";
    var mostlyfullnameField = "firstlast";

    var firstname = doc.getFirstFieldValue(firstnameField);
    var middlename = doc.getFirstFieldValue(middlenameField);
    var lastname = doc.getFirstFieldValue(lastnameField);

    var fullname = firstname + " " + middlename + " " + lastname;
    var mostlyfullname = firstname + " " + lastname;

    doc.setField(fullnameField, fullname);
    doc.setField(mostlyfullnameField, mostlyfullname);
  }

  return doc;
}
