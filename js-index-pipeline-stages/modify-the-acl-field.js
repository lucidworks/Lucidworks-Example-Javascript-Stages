// Modify the ACL field in a Document

//
// Turns out that the string in an acls_ss field is an array of strings where the array
// is the first value of a multi-valued field. A list within a list, so to speak.
// The real trick is to remember that even though it is an array of string the Javascript doesn't
// believe you so you have to use toString() to convince it to behave.
//
function(doc) {
  if (doc.getId() !== null) {
    var fieldname = "acls_ss";
    var findThis = "TEST1";
    var replaceWithThis = "TEST3";

    var acls = doc.getFieldValues(fieldname);
    doc.removeFields(fieldname);

    for (i = 0; i < acls.length; i++) {
      acls[i] = acls[i].toString()replace(findThis, replaceWithThis);
      doc.addField(fieldname, acls[i]);
       }
  } // else don't do anything
  
  return doc;
}
