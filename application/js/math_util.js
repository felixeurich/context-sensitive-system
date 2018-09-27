function calculateMeanAndConvertToMillis(values) {
  if (values.length > 0) {
    var sum = values.reduce(function(a, b) {
      return a + b;
    });
    return Math.floor(sum * 1000 / values.length);
  }
  return 0;
}

function joinDimensions(dim1, meanDim1, dim2, meanDim2, dim3, meanDim3) {
  return Math.sqrt((dim1 - meanDim1)**2+(dim2 - meanDim2)**2+(dim3 - meanDim3)**2)
}
