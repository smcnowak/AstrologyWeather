const express = require("express");
const request = require("request");
const app = express();

require("dotenv").config();

const apiKey = `${process.env.API_KEY}`;

app.use(express.static("Public"));
app.use(express.urlencoded({extended: true}));
app.set("view engine", "ejs");


app.get("/", function (req, res) {
  res.render("index", {weather: null, error: null});
});


app.post("/", function(req, res){

let city = req.body.cityName;
let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
let sign = req.body.astroName;
let astroURL = `https://ohmanda.com/api/horoscope/${sign}/#`;
let astroReading = "";

  request(astroURL, function(err, response, body){
    if (err) {
        res.render("index", {weather: null, error: 'Error, please try again'});
      } else {
        let astro = JSON.parse(body);
        let astroReading = `${astro.horoscope}`;
        console.log (astroReading);
      }
    });

  request(url, function(err, response, body){
    if (err) {
        res.render("index", {weather: null, error: 'Error, please try again'});
    } else {
        let weather = JSON.parse(body);
        if (weather.main == undefined){
          res.render("index", {weather: null, error: 'Error, please try again'});
        } else {
          let place = `${weather.name}, ${weather.sys.country}`,
            weatherTemp =`${weather.main.temp}`,
            weatherIcon = `http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`,
            weatherDescription = `${weather.weather[0].description}`,
            main = `${weather.weather[0].main}`,
            weatherFahrenheit;
            weatherFahrenheit = (weatherTemp * 9) / 5 + 32;

            function roundToTwo(num) {
              return +(Math.round(num + "e+2") + "e-2");
            }
            weatherFahrenheit = roundToTwo(weatherFahrenheit);

            res.render("index",{
              weather: weather,
              place: place,
              temp: weatherTemp,
              fahrenheit: weatherFahrenheit,
              icon: weatherIcon,
              description: weatherDescription,
              main: main,
              reading: astroReading,
              error: null,
            });
          }
      }
    });
});


//   const sign = req.body.astroName;
//   const astroURL = "https://ohmanda.com/api/horoscope/" + sign +"/#";

app.listen(3000, function(){
  console.log("Server is running on port 3000.");
});
