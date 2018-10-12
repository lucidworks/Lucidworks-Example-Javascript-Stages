// Download A File
// So you can effectively execute Java code in a JS stage so 
// if you want to just load up raw Java code to open up a connection 
// and download a file (or multiple files as the case may be) you are 
// certainly free to do that (I may add code to do that eventually).

// However, the LWL File Loader Index Stage uses a supporting class called FileLoader that you can also use like this:

function(doc) {
  if (doc.getId() !== null) {
    var fileURL = ["https://www.cnn.com/"];
    var outputFieldName = "fileLoaderValue";
    
    var fileLoader = new com.lucidworks.apollo.pipeline.index.stages.FileLoader();
    var rawBytes = fileLoader.loadFile(fileURL[0]);
    if (rawBytes != null) {
      var value = javax.xml.bind.DatatypeConverter.printBase64Binary(rawBytes);
      // logger.info( "****** FileLoader value: " + value);
      doc.setField(outputFieldName, value);
    }
  }
  
  return doc;
}
