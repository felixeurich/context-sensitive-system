class jActivity {
  constructor(base, sensorClasses, callback, label, interval) {
    this.callback = callback
    this.label = label
    this.interval = interval
    this.base = base
    var dataset = {}
    this.dataset = dataset;

    var sensors = []
    this.sensors = sensors;

    //create new sensor instance and push to sensors array
    sensorClasses.forEach(function(sensorClass) {
      var sensor = new sensorClass(dataset);
      sensors.push(sensor)
    })

    var pmml2js = new Promise((resolve, reject) => {
      var onSuccess = function(xsl_file) {
        //set pmml2js
        resolve(
          function(model) {
            let generated_code = transform(model, xsl_file)
            return eval(generated_code.textContent);
          }
        )
      }

      $.ajax({
        type: "GET",
        url: (this.base + "resources/pmml2js.xsl"),
        success: onSuccess
      })
    })

    var pmml = new Promise((resolve, reject) => {
      //called if ajaxRequest succeed
      var onSuccess = function(data) {
        pmml = $.parseXML(data)
        resolve(pmml)
      }
      //called if classifier cannot be retrieved
      var onError = function(jqXHR, textStatus, errorThrown) {
        alert(textStatus)
        resolve(null)
      }

      //ajax request to get classifier as pmml
      $.ajax({
        type: "GET",
        url: (this.base + "models/classifier.pmml"),
        success: onSuccess,
        error: onError,
      })
    })

    //called if alle promises are resolved
    // once we have both we generate the classifier and register the callback
    Promise.all([pmml2js, pmml]).then(p => {
      //generate and store classifiier
      //CASE (action, predicate)
      //---action = (CASE(S) || CLASS)
      //---predicate = ( observation.alpha < X || true || false)
      this.classifier = p[0](p[1])
      // then call by interval assuming someone fills the dataset
      window.setInterval(
        function(scope) {
          let features = {}

          for (var sensor in scope.sensors) {
            var sf = sensors[sensor].features()
            for (var feature in sf) {
              features[feature] = sf[feature]
            }
          }
          console.log("Collected features: ", features);
          scope.callback(scope.classifier.evaluate(features))

          for (var sensor in scope.sensors) {
            sensors[sensor].flush()
          }
        }, interval, this)
    })
  }
}
