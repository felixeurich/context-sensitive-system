function transform(xml, xsl) {
  // IE specific code
  if (window.ActiveXObject) {
    ex = xml.transformNode(xsl);
    return ex;
  }
  // code for Chrome, Firefox, Opera, etc.
  else if (documentImplementationAvailable()) {
    xsltProcessor = new XSLTProcessor();
    xsltProcessor.importStylesheet(xsl);
    resultDocument = xsltProcessor.transformToFragment(xml, document);
    return resultDocument;
  }
}

function documentImplementationAvailable(){
  return document.implementation && document.implementation.createDocument;
}
