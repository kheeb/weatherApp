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
    <div class="card-content white-text">
        <span class="card-title">
            <h6>
                Today's Weather
            </h6>
            <p>temp: ${weatherData.main.temp.toFixed(1)}C</p>
            <p>wind: ${weatherData.wind.speed.toFixed(1)} MPH</p>
            <p>humidity: ${weatherData.main.humidity}%</p>
            <p>UV index: 
            
        </span>
    </div>
    </div>`
    weatherNow.appendChild(weatherContainer)
})
}

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
        
        if (element.dt_txt.endsWith('12:00:00')){
          var year = element.dt_txt.split(' ')[0].split('-')[0];
          var month = element.dt_txt.split(' ')[0].split('-')[1];
          var day = element.dt_txt.split(' ')[0].split('-')[2];
          var date = (`${month}/${day}/${year}`)
          var forecastTemp = (element.main.temp.toFixed(1));
          var forecastWindspeed = (element.wind.speed.toFixed(1));
          var forecastHumidity = (element.main.humidity);

          var weatherNow = document.querySelector('#weatherNow')
          var weatherContainer = document.createElement(
          "div"
          )
          weatherContainer.classList.add('col', 's12', 'm2', 'l2')
          weatherContainer.innerHTML=
          `<div class="card pink accent-1">
             <div class="card-content white-text">
              <span class="card-title">
                  <h6>
                    ${date}
                  </h6>
                  <p> ${forecastTemp}</p>
                  <p> ${forecastWindspeed}</p>
                  <p> ${forecastHumidity}</p>
          
            
              </span>
    </div>
    </div>`
    weatherNow.appendChild(weatherContainer)

        }
  }
  })
}

// initialize parralax
document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.parallax');
    // var instances = M.Parallax.init(elems, options);
  });

  // Or with jQuery

  $(document).ready(function(){
    $('.parallax').parallax();
  });


// <!-- initalizes plugin for side navigation -->
$(document).ready(function(){
  $('.sidenav').sidenav();
});

$('#searchBar').on('submit', function(event){
  var cityName = $('#search').val()
  event.preventDefault();
  getWeather(cityName);
  getForecast(cityName);

 
});