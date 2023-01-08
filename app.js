//application dependancies, environment configuration

let appInsights = require('applicationinsights');
const express = require("express");
const fetch = require("node-fetch");
const app = express();

require("dotenv").config();

//appinsights setup

appInsights.setup(`${process.env.APPLICATIONINSIGHTS_CONNECTION_STRING}`).start();
var telemetry = appInsights.defaultClient;

//OpenWeather personal API key

const apiKey = `${process.env.API_KEY}`;

//express app, body parser, template view engine, static pages

app.use(express.static("public"));
app.use(express.urlencoded({extended: true}));
app.set("view engine", "ejs");

//default display on launch

app.get("/", function (req, res) {
  res.render("index", {weather: null, error: null});
});

//retreiving data from both apis upon post request using async function

app.post("/", async function (req, res) {

  let city = req.body.cityName;
  let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  let sign = (req.body.astroName).toLowerCase();
  let astroURL = `https://ohmanda.com/api/horoscope/${sign}/#`;

  //Error handling and json retreival

  const fetchReq1 = await fetch(url)
                      .then((res) => res.json())
                      .catch((error) => {
                        console.error(error.message)
                          });
  const fetchReq2 = await fetch(astroURL)
                      .then((res) => res.json())
                      .catch((error) => {
                        console.error(error.message)
                          });

//this makes all the APIs json data availble in the same function

  const allData = Promise.all([fetchReq1, fetchReq2]);

//parsing all the json together and rendering results plus more error handling

  allData.then((data) => {
      const weather = data[0];
      const temp  = (data[0].main.temp).toFixed();
      const place = data[0].name;
      const description = data[0].weather[0].description;
      const icon = data[0].weather[0].icon;
      const iconURL = `http://openweathermap.org/img/wn/${icon}@2x.png`;
      const fahrenheit = ((temp *9) /5 +32).toFixed();
      const reading = data[1].horoscope;
//Tracking the API health
        if (reading.length < 20) {
          telemetry.trackEvent({name:"LinkBroken"});
        };
             res.render("index",{
               weather: weather,
               place: place,
               temp: temp,
               fahrenheit: fahrenheit,
               icon: iconURL,
               description: description,
               reading: reading,
               error: null,
             });
       })
       .catch((error) => {
         console.error(error.message);
         res.render("index", {weather: null, error: 'Error, please try again'});
       });
});

//are we listening and what port?

let port = process.env.PORT;
if (port == null || port == "") {
  port = 5000;
}
app.listen(port, function(){
  console.log(`Server is running on port ${port}.`);
});