const timeEl = document.getElementById('time');
const dateEl = document.getElementById('date');
const currentWeatherItemsEl = document.getElementById('current-weather-items');
const timezone = document.getElementById('time-zone');
const countryEl = document.getElementById('country');
const weatherForecastEl = document.getElementById('weather-forecast');
const currentTempEl = document.getElementById('current-temp');

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const API_KEY = '9fc172097dbb462c30c3959a7c8368a9';

setInterval(() => {
    const time = new Date();
    const month = time.getMonth();
    const date = time.getDate();
    const day = time.getDay();
    const hour = time.getHours();
    const hoursIn12HrFormat = hour >= 13 ? hour % 12 : hour;
    const minutes = time.getMinutes();
    const ampm = hour >= 12 ? 'PM' : 'AM';

    timeEl.innerHTML = (hoursIn12HrFormat < 10 ? '0' + hoursIn12HrFormat : hoursIn12HrFormat) + ':' + (minutes < 10 ? '0' + minutes : minutes) + ' ' + `<span id="am-pm">${ampm}</span>`;

    dateEl.innerHTML = days[day] + ', ' + date + ' ' + months[month];
}, 1000);

getWeatherData();
function getWeatherData() {
    // navigator.geolocation.getCurrentPosition((success) => {
    //     let { latitude, longitude } = success.coords;
        // let latitude = 28.984644;  //   New York
        // let longitude = 77.705956; //  New York
        const city = document.getElementById('city-input').value;
    
        if (city === "") {
            alert("Please enter a city name");
            return;
        }

        // Use the current lat and lon to get forecast data from the API
        fetch(`http://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`)
            .then((res) => res.json())
            .then((data) => {
                if(data.cod === "404"){
                    alert("City not found");
                } else {
                console.log(data); // Check the response format
                showWeatherData(data);
                }
            })
            .catch((error) => console.error("Error fetching the weather data:", error));
}

function showWeatherData(data) {
    // Extract data from the first forecast in the list (3-hourly data)
    const firstHourData = data.list[0];
    const { main, wind, dt } = firstHourData;

    // Extract values
    const { humidity, pressure, temp } = main;
    const { speed } = wind;
    const sunrise = dt; // Example timestamp, use as needed
    const sunset = dt + 3600; // Example timestamp, use as needed

    // Update timezone and country info
    timezone.innerHTML = data.city.timezone;
    countryEl.innerHTML = `${data.city.name}, ${data.city.country}`;

    // Display current weather details
    currentWeatherItemsEl.innerHTML = `
        <div class="weather-item">
            <div>Humidity</div>
            <div>${humidity}%</div>
        </div>
        <div class="weather-item">
            <div>Pressure</div>
            <div>${pressure} hPa</div>
        </div>
        <div class="weather-item">
            <div>Wind Speed</div>
            <div>${speed} m/s</div>
        </div>
        <div class="weather-item">
            <div>Sunrise</div>
            <div>${window.moment(sunrise * 1000).format('HH:mm a')}</div>
        </div>
        <div class="weather-item">
            <div>Sunset</div>
            <div>${window.moment(sunset * 1000).format('HH:mm a')}</div>
        </div>
    `;

    // Forecast for the next few days
    let otherDayForecast = '';
    data.list.slice(0, 6).forEach((forecast, idx) => {
        if (idx === 0) {
            currentTempEl.innerHTML = `
                <img src="https://openweathermap.org/img/wn/${forecast.weather[0].icon}@4x.png" alt="weather icon" class="w-icon">
                <div class="other">
                    <div class="day">${window.moment(forecast.dt * 1000).format('ddd')}</div>
                    <div class="temp">Night - ${forecast.main.temp_min}&#176; C</div>
                    <div class="temp">Day - ${forecast.main.temp_max}&#176; C</div>
                </div>`;
        } else {
            otherDayForecast += `
                <div class="weather-forecast-item">
                    <div class="day">${window.moment(forecast.dt * 1000).format('ddd HH:mm')}</div>
                    <img src="https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png" alt="weather icon" class="w-icon">
                    <div class="temp">Temp - ${forecast.main.temp}&#176; C</div>
                </div>`;
        }
    });

    weatherForecastEl.innerHTML = otherDayForecast;
}
