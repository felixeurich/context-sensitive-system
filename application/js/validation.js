function isArrayValid(arrayResults) {
  for (var i = 0, l = arrayResults.length; i < l; i++) {
    if (typeof(arrayResults[i]) == 'undefined') {
      return false;
    };
  };
  return true;
}
