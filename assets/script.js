/* GIVEN a weather dashboard with form inputs
WHEN I search for a city
THEN I am presented with current and future conditions for that city and that city is added to the search history
WHEN I view current weather conditions for that city
THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index
WHEN I view future weather conditions for that city
THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, and the humidity
WHEN I click on a city in the search history
THEN I am again presented with current and future conditions for that city
*/

let APIKey = "31d362c3396b74ca1d3b07eb462756e2";
let searchedCities = $("#previous-city-search");
let cityName = $(".city");
let temperature = $("#temperature");
let humidity = $("#humidity");
let windSpeed = $("#wind-speed");
let uvIndex = $("#uv-index");
let msgDiv = $("#msg");

let fiveDayForecast = $(".forecast-text");

let city = null;

//sets the date with the help of Moment.js
let today = moment();
let date = today.format("MM/DD/YYYY");

//empty array we push cities into
let previousCities = [];

//main function-- used to begin all other functions on the page
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

//displays an error message when a city name does not exist
function displayMessage(type, message) {
  msgDiv.text(message);
  msgDiv.attr("class", type);
}

//stores city names in local storage
function storeCities() {
  localStorage.setItem("city", JSON.stringify(previousCities));
}

//renders the weather information we need
function renderCityWeather(response) {
  msgDiv.empty();
  fiveDayForecast.empty();
  cityName.html("<h3>" + city + " (" + date + ")" + "</h3>");

  let tempF = (response.current.temp - 273.15) * 1.8 + 32;
  temperature.text("Temperature (F): " + tempF.toFixed(2) + " degrees");

  //sets the color of the uv index
  if (response.current.uvi < 3) {
    uvIndex.attr("class", "uv-favorable");
  } else if (response.current.uvi >= 3 && response.current.uvi <= 6) {
    uvIndex.attr("class", "uv-moderate");
  } else {
    uvIndex.attr("class", "uv-severe");
  }

  humidity.text("Humidity: " + response.current.humidity + "%");
  windSpeed.text("Wind Speed: " + response.current.wind_speed);
  uvIndex.text("UV Index: " + response.current.uvi);

  //loop to add in 5-day forecast info
  for (let i = 0; i < 5; i++) {
    let forecastDiv = $("<div class='forecast'>");

    let dailyTemp = (response.daily[i].temp.day - 273.15) * 1.8 + 32;
    let dailyHumidity = response.daily[i].humidity;

    let pDate = $("<p>").text(today.add(1, "days"));
    let pTemp = $("<p>").text("Temp: " + dailyTemp.toFixed(1) + " degrees");
    let pHumidity = $("<p>").text("Humidity: " + dailyHumidity + "%");
    forecastDiv.append(pDate);
    forecastDiv.append(pTemp);
    forecastDiv.append(pHumidity);
    fiveDayForecast.append(forecastDiv);
  }
}

//adds city names underneath search bar
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

//when you click the city name under the search bar, it will re-do the search for that city
$(document).on("click", ".previous-city", function (event) {
  event.preventDefault();
  console.log("previous city search");
  fetchResultsForCity(city);
  //renderCityWeather();
});

//main function finding the information from the API
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
