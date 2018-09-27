# context-sensitive-system

This project was developed during my computer science studies.
It demonstrates how context can be learned, classified and later considered in the application.
For this purpose sensor data of a smartphone are read out via javascript and stored in a time series database (influxdb).
These data are then used in R to train a prediction model.
The model is then imported in javascript as a classifier and used for the recognition of the context.

## Getting started

### Install a time series data base
```
docker run -p 8086:8086  -v influxdb:/var/lib/influxdb   influxdb
```
After the installation a database "productive" must be created.

### Install R
To create the prediction model you need to install R [RStudio](https://www.rstudio.com/products/rstudio/download/).


### Start application
* Start a webserver like [XAMPP](https://www.apachefriends.org/de/index.html)
* Put the **application** folder into the **htdocs** of your XAMPP installation
* Replace the ```host: "192.168.0.192"``` (index.html) with the host of your influxdb
* Open the website in your browser
* Collect data by selecting the label (your activity you want to measure) and click record
* Do this for each activity a few times for about 30 seconds
* Open the script in the R folder with RStudios and run it
* The script creates the pmml file in your home directory
* Copy that file into the **models** folder of the application
* Open the website and test if your activity is detected correctly :)
