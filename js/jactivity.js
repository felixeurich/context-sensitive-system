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


		sensorClasses.forEach(function (sensorClass)
		{
			var sensor= new sensorClass(dataset);
			sensors.push(sensor)
		}
		)


		// get stylesheet for transformation
		var pmml2js = new Promise((resolve, reject) => {
			var onSuccess = function(xsl_file) {
				resolve( function(model){
					let generated_code = transform(model,xsl_file)
					return eval(generated_code.textContent);
				}
				)
			}
			$.ajax({
				type: "GET",
				url: (this.base + "js/pmml2js.xsl"),
				success: onSuccess
			})
		})

		// get PMML
		var pmml = new Promise((resolve,reject) => {

			var onSuccess = function(data) {
				pmml=$.parseXML(data)
				resolve(pmml)
			}
			var onError = function(jqXHR,textStatus,errorThrown ) {
				alert(textStatus)
				resolve(null)
			}

			$.ajax({
				type: "GET",
				url: (this.base + "models/classifier.pmml"),
				success: onSuccess,
				error: onError,
			})
		}
		)

		// once we have both we generate the classifier and register the callback
		Promise.all([pmml2js,pmml]).then( p =>
			{
				this.classifier = p[0](p[1]) //generate and store classifiier
				// then call by interval assuming someone fills the dataset
				window.setInterval(
					function(scope) {
						 // calculate features
						 let features = {}

						 for (var sensor in scope.sensors) {
						  var sf=sensors[sensor].features()
						  for (var feature in sf)
						  {
						    features[feature]=sf[feature]
						  }
						 }
						 console.log("Collected features: ", features);
						 scope.callback(scope.classifier.evaluate(features))

						for (var sensor in scope.sensors) {
							sensors[sensor].flush()
						}
					 }
					 , interval,this)
			}
		)
	}
}
