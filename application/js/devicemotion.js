class devicemotion {
  constructor(dataset) {
    this.dataset = dataset
    window.addEventListener('devicemotion', (...args) => this.devicemotionListener(...args))
  }

  devicemotionListener(event) {
    // check if(this.dataset.acceleration) {return this.dataset.acceleration;} else {return [];}
    (this.dataset.acceleration = this.dataset.acceleration || []).push(event);
  }

  features() {
    var f = {}
    if ((this.dataset.acceleration = this.dataset.acceleration || []).length > 0) {
      var a = this.dataset.acceleration
      var acc_x = a.map(v => v.acceleration.x * 1000)
      var acc_y = a.map(v => v.acceleration.y * 1000)
      var acc_z = a.map(v => v.acceleration.z * 1000)

      if (!isArrayValid(acc_x) || !isArrayValid(acc_y) || !isArrayValid(acc_z)) {
        return f;
      }

      var meanX = math.mean(acc_x);
      var meanY = math.mean(acc_y);
      var meanZ = math.mean(acc_z);

      var joinedValues = a.map(v => joinDimensions(v.acceleration.x * 1000, meanX, v.acceleration.y * 1000, meanY, v.acceleration.z * 1000, meanZ));

      f["acc_mean"] = math.mean(joinedValues);
      f["acc_max"] = math.max(joinedValues);
      f["acc_sd"] = math.std(joinedValues);
      f["acc_x"] = meanX;
      f["acc_y"] = meanY;
      f["acc_z"] = meanZ;
    }
    return f;
  }

  flush() {
    this.dataset.acceleration = [];
  }
}
