// This is not necessarily accurate, but you can always 
// change the regex from space to something else:

function(doc) {
   if (doc.getId() !== null) {
     var fieldname = 'body';
     var content = doc.getFirstFieldValue(fieldname);
     content = content.replace(/  /, ' ');
     var count = content.split(' ').length;
     doc.addField('word_count', count);
   }

   return doc;
}
