/* GIVEN a weather dashboard with form inputs
WHEN I search for a city
THEN I am presented with current and future conditions for that city and that city is added to the search history
WHEN I view current weather conditions for that city
THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index
WHEN I view the UV index
THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe
WHEN I view future weather conditions for that city
THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, and the humidity
WHEN I click on a city in the search history
THEN I am again presented with current and future conditions for that city
WHEN I open the weather dashboard
THEN I am presented with the last searched city forecast */

let APIKey = "31d362c3396b74ca1d3b07eb462756e2";
let button = $("#button");
let city = null;

button.on("click", function(event) {
    event.preventDefault();
  city = $("#city-search").val()
  fetchResultsForCity(city);
  addToSearchHistory(city);
  return city;
})

function renderCityWeather(results) {
  console.log(results);
}

let previousSearchArray = [];
//this function adds the previously searched city name to local storage and then adds it under the search bar
function addToSearchHistory(city) {
    let previousCityName = localStorage.setItem("city-name", city);
    previousCityName.city.push(previousSearchArray);

    for (let m = 0; m < previousSearchArray.length; m++) {
        let pElement = $("<p>");
        pElement.addClass("previous-city-names");
        pElement.text(previousSearchArray[i]);
        $("#previous-city-search").prepend(pElement);
        //let cityNamesLocalStorage = localStorage.getItem("city-name");
        
        
        
    }    
}

//this function will get the results from the user's search criteria
async function fetchResultsForCity(city) {
  let findCityResponse = await fetch(cityQueryUrl(city))
    .then(response => response.json());

  if (findCityResponse.cod != 200) {
    return displaySearchError(city, findCityResponse.message)
  }

  let response = await fetch(weatherQueryUrl(findCityResponse.coord))
    .then(response => response.json());

  if (response.cod != 200) {
    return displaySearchError(city, response.message)
  } else {
    renderCityWeather(response);
  }

  return { error: "Cannot find city called " + city, result: []};
}

//this functions gives us the URL for the city information
function cityQueryUrl(city) {
  return "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;
}

//this function gives us the URL for the weather information we need
function weatherQueryUrl(coord) {
  return "https://api.openweathermap.org/data/2.5/onecall?exclude=hourly,minutely&lat=" + coord.lat + "&lon=" + coord.lon + "&appid=" + APIKey;
}

function displaySearchError(city, error) {
    console.log(error + " \"" + city + "\"");
}

