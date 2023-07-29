
// API Key for OpenWeatherMap API
const apiKey = "9e84d6830a71ef226c9f876d4a60ce6e";

// Function to fetch current weather data
const getCurrentWeather = (cityName) => {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${apiKey}`;
    return fetch(apiUrl)
        .then((response) => response.json())
        .catch((error) => console.error("Error fetching current weather:", error));
};

// Function to fetch 5-day forecast data
const get5DayForecast = (cityName) => {
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=metric&appid=${apiKey}`;
    return fetch(apiUrl)
        .then((response) => response.json())
        .catch((error) => console.error("Error fetching 5-day forecast:", error));
};

// Function to display current weather data on the page
const displayCurrentWeather = (weatherData) => {
    const currentDate = dayjs().format("dddd, MMMMM D YYYY h:mm A");

    const city = weatherData.name;
    const date = currentDate;
    const temperature = weatherData.main.temp;
    const humidity = weatherData.main.humidity;
    const windSpeed = weatherData.wind.speed;
    const icon = weatherData.weather[0].icon;

    // Update DOM elements
    document.getElementById("current-city").textContent = city;
    document.getElementById("current-date").textContent = date;
    document.getElementById("temperature").textContent = `${temperature} °C`;
    document.getElementById("humidity").textContent = `${humidity}%`;
    document.getElementById("wind-speed").textContent = `${windSpeed} MPH`;
    document.getElementById("current-icon").setAttribute("src", `http://openweathermap.org/img/w/${icon}.png`);
};

// Function to display 5-day forecast data on the page
const display5DayForecast = (forecastData) => {
    const forecastElements = document.querySelectorAll(".forecast");

    // Loop through each forecast element and update the data
    forecastElements.forEach((forecastElement, index) => {
        const date = forecastData.list[index].dt_txt.split(" ")[0];
        console.log(date)
        const temperature = forecastData.list[index].main.temp;
        const humidity = forecastData.list[index].main.humidity;
        const icon = forecastData.list[index].weather[0].icon;
        const windSpeed = forecastData.list[index].wind.speed;              

        // Update DOM elements
        forecastElement.querySelector(".forecast-date"+index).textContent = date;
        forecastElement.querySelector(".forecast-temp"+index).textContent = `${temperature} °C`;
        forecastElement.querySelector(".forecast-humidity"+index).textContent = `${humidity}%`;
        forecastElement.querySelector(".forecast-icon"+index).setAttribute("src", `http://openweathermap.org/img/w/${icon}.png`);
        forecastElement.querySelector(".forecast-windspeed"+index).textContent = `${windSpeed} MPH`;
    });
};

// Function to add a city to the search history list
const addCityToHistory = (cityName) => {
    const searchHistoryList = document.getElementById("search-history-list");
    const listItem = document.createElement("li");
    listItem.textContent = cityName;
    searchHistoryList.appendChild(listItem);
};

// Event listener for the search form submission
var searchButton = document.getElementById("search-button") 
searchButton.addEventListener("click", (event) => {
    event.preventDefault();
    const city = document.getElementById("search-city").value.trim();
    console.log(city)
    if (city !== "") {
        getCurrentWeather(city)
            .then((weatherData) => {
                if (weatherData.cod === "404") {
                    alert("City not found. Please enter a valid city name.");
                } else {
                    displayCurrentWeather(weatherData);
                    addCityToHistory(city);
                }
            })
            // Add city to recent searches
            .catch((error) => console.error("Error fetching current weather:", error));

        get5DayForecast(city)
            .then((forecastData) => {
                if (forecastData.cod === "404") {
                    alert("City not found. Please enter a valid city name.");
                } else {
                    display5DayForecast(forecastData);
                }
            })
            .catch((error) => console.error("Error fetching 5-day forecast:", error));
    }
});

// Event listener for the search history list items
document.getElementById("clear-history").addEventListener("click", (event) => {
    const city = event.target.textContent;
    getCurrentWeather(city)
        .then((weatherData) => displayCurrentWeather(weatherData))
        .catch((error) => console.error("Error fetching current weather:", error));

    get5DayForecast(city)
        .then((forecastData) => display5DayForecast(forecastData))
        .catch((error) => console.error("Error fetching 5-day forecast:", error));
});
























