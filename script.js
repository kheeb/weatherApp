// WHEN I view current weather conditions for that city
// THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index
// WHEN I view the UV index
// THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe
// WHEN I view future weather conditions for that city
// THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, the wind speed, and the humidity
// WHEN I click on a city in the search history
// THEN I am again presented with current and future conditions for that city

var APIKey = "&units=imperial&appid=713c348493c88760b9f54828487c650d";

// function to get searched city's current weather via API and populate information in card on page

function getWeather(cityName) {
var queryURL = "https://api.openweathermap.org/data/2.5/weather?q="+cityName+"&units=imperial&appid=713c348493c88760b9f54828487c650d"
fetch(queryURL)
.then(response =>{
    return response.json()
}) 
.then(weatherData =>{
    $("#weatherNow").empty()

    var weatherNow = document.querySelector('#weatherNow')
    var weatherContainer = document.createElement("div")

    weatherContainer.classList.add('col', 's12', 'm12', 'l12')
    weatherContainer.innerHTML=
    `<div class="card">
    <div class="card-panel purple lighten-2 card-content white-text">
        <span class="card-title">
            <h6>
                ${cityName}'s Current Conditions
            </h6>
            <p>temperature:${weatherData.main.temp.toFixed(1)}°F</p>
            <p>wind: ${weatherData.wind.speed.toFixed(1)} MPH</p>
            <p>humidity: ${weatherData.main.humidity}%</p>
            <p>UV Index: ${weatherData.uvi}</p>
            
            
        </span>
    </div>
    </div>`
    weatherNow.appendChild(weatherContainer)
})
}


// 5 day forecast function to return searched city's info in row of cards

// search API for user's city entered in search bar
function getForecast(cityName) {
  var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q="+cityName+"&units=imperial&appid=713c348493c88760b9f54828487c650d"
  fetch(queryURL)
  .then(response =>{
      return response.json()
  }) 
  .then(weatherData =>{
      $('#weatherLater').empty()

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
          var forecastIcon = (element.weather.icon);
          console.log(element.weather.icon)

          // add weather info to cards for 5 day forecast
          var weatherLater = document.querySelector('#weatherLater')
          var weatherContainer = document.createElement("div")
          weatherContainer.classList.add('col', 'm5ths', 's6',)
          weatherContainer.innerHTML=
          `<div class="card">
             <div class="card-content white-text">
              <span class="card-title">
                  <h6>
                    ${date}
                  </h6>
                  <p>temperature: ${forecastTemp}°F</p>
                  <p>${forecastIcon}</p>
                  <p>wind: ${forecastWindspeed} MPH</p>
                  <p>humidity: ${forecastHumidity}%</p>
              </span>
            </div>
          </div>`
        weatherLater.appendChild(weatherContainer)
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


// create variables to target locations on page to connect to local storage
var searchInput = document.querySelector('#search');
var searchBtn = document.querySelector('#searchBtn');
var searchedList = document.querySelector('#searchedList');
var searchBar = document.querySelector('#searchBar')

var previousSearches = []

// function renders items in a searched list as <li> elements
function renderPreviousSearch() {
  // clear searchedList element
  searchedList.innerHTML = '';

  //  render new li for each search input
  for(var i = 0; i < previousSearches.length; i++) {
    var searched = previousSearches[i];

    var li = document.createElement('li');
    li.textContent = searched;
    li.setAttribute('data-index', i);

    // button to clear city from list
    var clearBtn = document.createElement('button');
    clearBtn.textContent = 'Clear';

    li.appendChild(clearBtn);
    searchedList.appendChild(li);

    // add click event to searchedList element
    clearBtn.addEventListener('click', function(event) {
    var element = event.target;

    // checks if element is a button
    if (element.matches('button') === true) {
    // get its data-index value and remove the searched element from the list
    var index = element.parentElement.getAttribute('data-index');
    previousSearches.splice(index, 1)

    // store updated previousSearches in localStorage, re-render list
    storeSearches();
    renderPreviousSearch();
    }
    });
  }
}


//  this function is being called and will run after the page loads
function init() {
  // get storedSearches from localStorage
  var storedSearches = JSON.parse(localStorage.getItem('previousSearches'))

  //  if searches were retrieved from localStorage, update the previousSearches array
  if (storedSearches !== null) {
    previousSearches = storedSearches;
  }
  //  helper function that will render searches to the DOM
  renderPreviousSearch();
}

function storeSearches() {
  // stringify and set key in localStorage to previousSearches array
  localStorage.setItem('previousSearches', JSON.stringify(previousSearches));
}

//  add submit event to form
searchBar.addEventListener('submit', function(event) {
  event.preventDefault();

  var searchText = searchInput.value.trim();

  // return from function early if submitted searchText is blank
  if (searchText === '') {
    return;
  }
  
  // add new searchText to previousSearches array, clear the input
  previousSearches.push(searchText);
  searchText.value = ''

  // store updated searches in localStorage, re-render the list
  storeSearches();
  renderPreviousSearch();
});

// add click event to searchedList element
searchedList.addEventListener('submit', function(event) {
  var element = event.target;

  // checks if element is a button
  if (element.matches('button') === true) {
    // get its data-index value and remove the searched element from the list
    var index = element.parentElement.getAttribute('data-index');
    previousSearches.splice(index, 1)

    // store updated previousSearches in localStorage, re-render list
    storeSearches();
    renderPreviousSearch();
  }
});

// calls init to retrieve data and render it to the page on load
init()


