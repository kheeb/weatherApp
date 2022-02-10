// https://api.openweathermap.org/data/2.5/weather?q=Philadelphia&units=imperial&appid=713c348493c88760b9f54828487c650d

// GIVEN a weather dashboard with form inputs
// WHEN I search for a city
// THEN I am presented with current and future conditions for that city and that city is added to the search history
// WHEN I view current weather conditions for that city
// THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index
// WHEN I view the UV index
// THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe
// WHEN I view future weather conditions for that city
// THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, the wind speed, and the humidity
// WHEN I click on a city in the search history
// THEN I am again presented with current and future conditions for that city

var APIKey = "&units=imperial&appid=713c348493c88760b9f54828487c650d";





function getWeather(cityName) {
var queryURL = "https://api.openweathermap.org/data/2.5/weather?q="+cityName+"&units=imperial&appid=713c348493c88760b9f54828487c650d"
fetch(queryURL)
.then(response =>{
    return response.json()
}) 
.then(weatherData =>{
    console.log(weatherData)
    $("#weatherNow").empty()
    console.log("temp " + weatherData.main.temp.toFixed(1))
    var weatherNow = document.querySelector('#weatherNow')
    var weatherContainer = document.createElement(
      "div"
    )
    weatherContainer.classList.add('col', 's12', 'm2', 'l2')
    weatherContainer.innerHTML=
    `<div class="card pink accent-1">
    <div class="card-panel indigo card-content white-text">
        <span class="card-title">
            <h6>
                ${cityName}'s Current Conditions
            </h6>
            <p>${weatherData.main.temp.toFixed(1)}°F</p>
            <p>wind: ${weatherData.wind.speed.toFixed(1)} MPH</p>
            <p>humidity: ${weatherData.main.humidity}%</p>
            <p>UV index: 
            
        </span>
    </div>
    </div>`
    weatherNow.appendChild(weatherContainer)
})
}

// 5 day forecast function

// search API for user's city entered in search bar
function getForecast(cityName) {
  var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q="+cityName+"&units=imperial&appid=713c348493c88760b9f54828487c650d"
  fetch(queryURL)
  .then(response =>{
      return response.json()
  }) 
  .then(weatherData =>{
      // console.log(weatherData.list)
      var forecastArray = weatherData.list;
      for (let index = 0; index < forecastArray.length; index++) {
        const element = forecastArray[index];
        
        // algorithm for seperating date into readable order from API
        if (element.dt_txt.endsWith('12:00:00')){
          var year = element.dt_txt.split(' ')[0].split('-')[0];
          var month = element.dt_txt.split(' ')[0].split('-')[1];
          var day = element.dt_txt.split(' ')[0].split('-')[2];
          var date = (`${month}/${day}/${year}`)
          var forecastTemp = (element.main.temp.toFixed(1));
          var forecastWindspeed = (element.wind.speed.toFixed(1));
          var forecastHumidity = (element.main.humidity);
        
          // add weather info to cards for 5 day forecast
          var weatherNow = document.querySelector('#weatherNow')
          var weatherContainer = document.createElement("div")
          weatherContainer.classList.add('col', 's12', 'm2', 'l2')
          weatherContainer.innerHTML=
          `<div class="card blue">
             <div class="card-content white-text">
              <span class="card-title">
                  <h6>
                    ${date}
                  </h6>
                  <p>${forecastTemp}°F</p>
                  <p>${forecastWindspeed} MPH</p>
                  <p>${forecastHumidity}% humidity</p>
              </span>
            </div>
          </div>`
        weatherNow.appendChild(weatherContainer)
      }};
  });
};


// <!-- initalizes plugin for side navigation -->
$(document).ready(function(){
  $('.sidenav').sidenav();
});


// after search submits via hitting enter, functions for current weather and forecast are called for the searched city
$('#searchBar').on('submit', function(event){
  var cityName = $('#search').val()
  event.preventDefault();
  getWeather(cityName);
  getForecast(cityName);
});

// after search submits via clicking button, functions for current weather and forecast are called for the searched city
$('#searchBtn').on('click', function(event){
  var cityName = $('#search').val()
  event.preventDefault();
  getWeather(cityName);
  getForecast(cityName);
});

$('#searchBtn').addEventListener('click', function(event) {
  var searchedCity = document.querySelector('#search').val;

  localStorage.setItem('previous search', searchedCity);
  
});
