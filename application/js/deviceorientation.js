class deviceorientation {
  constructor(dataset) {
    this.dataset = dataset
    window.addEventListener('deviceorientation', (...args) => this.deviceorientationListener(...args))
  }

  deviceorientationListener(event) {
    (this.dataset.orientation = this.dataset.orientation || []).push(event);
  }

  features() {
    var f = {}
    if ((this.dataset.orientation = this.dataset.orientation || []).length > 0) {
      var o = this.dataset.orientation
      var alpha = o.map(x => x.alpha * 1000)
      var beta = o.map(x => x.beta * 1000)
      var gamma = o.map(x => x.gamma * 1000)

      if (!isArrayValid(alpha) || !isArrayValid(beta) || !isArrayValid(gamma)) {
        return f;
      }

			var meanBeta = math.mean(beta);
			var meanAlpha = math.mean(alpha);
			var meanGamma = math.mean(gamma);

			var joinedValues = o.map(x => joinDimensions(x.alpha*1000, meanAlpha, x.beta*1000, meanBeta, x.gamma*1000, meanGamma))

      f["mean"] = math.mean(joinedValues);
      f["max"] = math.max(joinedValues);
      f["sd"] = math.std(joinedValues);
			f["beta"] = meanBeta;
			f["alpha"] = meanAlpha;
			f["gamma"] = meanGamma;
    }
    return f;
  }

  flush() {
    this.dataset.orientation = [];
  }
}
