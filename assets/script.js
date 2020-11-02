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
let city = null;

function queryCityWeather() {
  city = $("#city-search").val();
  fetchResultsForCity(city);
}

function renderCityWeather(results) {
  console.log(results);
}

function addToSearchHistory(city) {}

/*async function fetchResultsForCity(city) {
  var findCityResponse = await fetch(cityQueryUrl(city))
    .then(response => response.json());

  if (findCityResponse.cod != 200) {
    console.log(findCityResponse);
    return displaySearchError(city, findCityResponse.message)
  }

  var response = await fetch(weatherQueryUrl(findCityResponse.coord))
    .then(response => response.json());

  if (response.cod != undefined) {
    console.log(response);
    return displaySearchError(city, response.message)
  } else {
    renderCityWeather(response);
  }

  return { error: "Cannot find city called " + city, result: []};
}*/

function fetchResultsForCity(city) {
  let queryURL =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&appid=" +
    APIKey;
  $.ajax({
    url: queryURL,
    method: "GET",
  })
    .fail(function () {
      //displaySearchError(city, response.cod);
      console.log("Oops! We do not have data on that city name.");
    })
    .done(function (response) {
      let queryURL =
        "https://api.openweathermap.org/data/2.5/onecall?exclude=hourly,minutely&lat=" +
        response.coord.lat +
        "&lon=" +
        response.coord.lon +
        "&appid=" +
        APIKey;
      $.ajax({
        url: queryURL,
        method: "GET",
      })
        .fail(function () {
          console.log("Oops! We do not have data on that city name.");
        })
        .done(function (response) {
          renderCityWeather(response);
        });
    });
}

function cityQueryUrl(city) {
  return (
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&appid=" +
    APIKey
  );
}

function weatherQueryUrl(coord) {
  return (
    "https://api.openweathermap.org/data/2.5/onecall?exclude=hourly,minutely&lat=" +
    coord.lat +
    "&lon=" +
    coord.lon +
    "&appid=" +
    APIKey
  );
}
