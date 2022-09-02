const express = require("express");
const https = require("https");
const fetch = require("node-fetch");

const app = express();
app.use(express.urlencoded({extended: true}));
app.use(express.static("Public"));

app.get("/", function(req, res){
  res.sendFile(__dirname + "/index.html")
});

const imgIcon = document.getElementById("weatherIcon")
const temperature = document.querySelector(".temperatureDegree")
const conditions = document.queryselector(".weatherDescription")


app.post("/", function(req,res){
  const query = req.body.cityName;
  const apiKey = "08192e4b4109f1ee6dd293f4f4721cf5";
  const unit = "metric";
  const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + apiKey + "&units=" + unit;
  const sign = req.body.astroName;
  const astroURL = "https://ohmanda.com/api/horoscope/" + sign +"/#";


fetch(url)
  .then(response =>{
    return response.json();
  })
  .then(data=>{
    const { temp } = data.main;
    const { description, icon } = data.weather[0];

    const imageURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png"

    temperature.textContent = temp;
    conditions.textContent = description;
    imgIcon.src = imageURL;

  });

});


// https.get(astroURL, function(response){
//   response.on("data", function(data){
//     const astroData = JSON.parse(data)
//     const yourReading = astroData.horoscope
//     res.write("<p>" + yourReading + "</p>");
//     res.send();
//   })
// })
//
// https.get(url, function(response){
//
//   response.on("data", function(data){
//     const weatherData = JSON.parse(data)
//     const temp = weatherData.main.temp
//     const description = weatherData.weather[0].description
//     const icon = weatherData.weather[0].icon
//     const imageURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png"
//     })
//   })

// res.write("<p>The weather is curently " + description + "</p>");
// res.write("<h1>The temperature in " + query + " is " + temp + " degrees Celsius.</h1>");
// res.write("<img src=" + imageURL + ">");
// res.send();


app.listen(process.env.PORT || 3000, function(){
  console.log("Server is running on port 3000.");
});
