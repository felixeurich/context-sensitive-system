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
      var alpha = o.map(x => x.alpha)
      var beta = o.map(x => x.beta)
      var gamma = o.map(x => x.gamma)

      if (!this.isArrayValid(alpha) || !this.isArrayValid(beta) || !this.isArrayValid(gamma)) {
        return f;
      }

			f["beta"] = mean(beta);
			f["alpha"] = mean(alpha);
      var d3 = o.map(x => Math.sqrt((x.alpha*1000 - mean(alpha)) ** 2 + (x.beta*1000 - mean(beta)) ** 2 + (x.gamma*1000 - mean(gamma)) ** 2))
      f["mean"] = math.mean(d3);
      f["max"] = math.max(d3);
      f["sd"] = math.std(d3);
    }

    return f;
  }

  flush() {
    this.dataset.orientation = [];
  }

  isArrayValid(arrayResults) {
    for (var i = 0, l = arrayResults.length; i < l; i++) {
      if (typeof(arrayResults[i]) == 'undefined') {
        return false;
      };
    };
		return true;
  }

}
