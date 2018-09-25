class devicemotion {
  constructor(dataset) {
    this.dataset = dataset
    window.addEventListener('devicemotion', (...args) => this.devicemotionListener(...args))
  }

  devicemotionListener(event) {
    (this.dataset.acceleration = this.dataset.acceleration || []).push(event);
  }

  features() {
    var f = {}
    if ((this.dataset.acceleration = this.dataset.acceleration || []).length > 0) {
      var o = this.dataset.acceleration
      var acc_x = o.map(v => v.acceleration.x)
      var acc_y = o.map(v => v.acceleration.y)
      var acc_z = o.map(v => v.acceleration.z)

      if (!this.isArrayValid(acc_x) || !this.isArrayValid(acc_y) || !this.isArrayValid(acc_z)) {
        return f;
      }

      var d3 = o.map(x => Math.sqrt((1000*x.acceleration.x - mean(acc_x)) ** 2 + (1000*x.acceleration.y - mean(acc_y)) ** 2 + (1000*x.acceleration.z - mean(acc_z)) ** 2))
      f["acc_mean"] = math.mean(d3);
      f["acc_max"] = math.max(d3);
      f["acc_sd"] = math.std(d3);
    }
    return f;
  }

  flush() {
    this.dataset.acceleration = [];
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
