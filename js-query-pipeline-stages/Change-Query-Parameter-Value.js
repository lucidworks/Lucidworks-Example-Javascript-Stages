var fieldname = "username";

var fieldvalue = request.getFirstParam(fieldname);
logger.debug("**** " + fieldname + ": " + fieldvalue + "******");

if (fieldvalue !== null) {
  fieldvalue = fieldvalue + "@METNET.NET";
  logger.debug("**** New value: " + fieldvalue + "******");

  request.removeParam(fieldname);
  request.addParam(fieldname, fieldvalue);

  logger.debug("**** " + fieldname + ": " 
             + request.getFirstParam(fieldname) + "******");
}
