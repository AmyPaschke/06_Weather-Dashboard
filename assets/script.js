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
let searchedCities = $("#previous-city-search");
let cityName = $(".city");
let temperature = $("#temperature");
let humidity = $("#humidity");
let windSpeed = $("#wind-speed");
let uvIndex = $("#uv-index");
let msgDiv = $("#msg");
let city = null;

//empty array we push cities into
let previousCities = [];

$("#button").on("click", function (event) {
  event.preventDefault();

  city = $("#city-search").val();

  // Return from function early if submitted city is blank
  if (city === "") {
    return;
  }

  previousCities.push(city);

  fetchResultsForCity(city);
  storeCities(city);
  addToSearchHistory(city);
});

function displayMessage(type, message) {
  msgDiv.text(message);
  msgDiv.attr("class", type);
}

function storeCities() {
  localStorage.setItem("city", JSON.stringify(previousCities));
}

function renderCityWeather(response) {
  msgDiv.empty();
  console.log(response);
  cityName.html("<h3>" + city + "</h3>");
  temperature.text("Temperature: " + response.current.temp);
  humidity.text("Humidity: " + response.current.humidity);
  windSpeed.text("Wind Speed: " + response.current.wind_speed);
  uvIndex.text("UV Index: " + response.current.uvi);
}

function addToSearchHistory() {
  searchedCities.empty();
  for (let i = 0; i < previousCities.length; i++) {
    let cityNames = previousCities[i];

    let liElement = $("<li>");
    liElement.text(cityNames);
    liElement.attr("class", "previous-city");

    searchedCities.append(liElement);
  }
}

$(".previous-city").on("click", function (event) {
  event.preventDefault();
  alert("you clicked me");
});

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
      msgDiv.removeAttr("hidden");
      //displaySearchError(city, response.cod);
      displayMessage("error", "Oops, we don't have information on this city!");
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
          msgDiv.removeAttr("hidden");
          displayMessage(
            "error",
            "Oops, we don't have information on this city!"
          );
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
