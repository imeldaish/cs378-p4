import './App.css';
import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [forecast, setForecast] = useState(null);
  const [city, setCity] = useState('Austin');

  const [cityList, setCityList] = useState([
    { name: 'Austin', latitude: 30.2672, longitude: -97.7431 },
    { name: 'Dallas', latitude: 32.7767, longitude: -96.7970 },
    { name: 'Houston', latitude: 29.7604, longitude: -95.3698 }
  ]);
  const [newCity, setNewCity] = useState(''); // state for the new city input

  // function to fetch the weather data for the given city
  const fetchWeather = (latitude, longitude) => {
    // Open-Meteo API URL
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m&temperature_unit=fahrenheit`;

    // fetch weather data from Open-Meteo
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setForecast(data); // Store the weather data
      })
      .catch((error) => console.error("Error fetching weather data:", error));
  };

  // fetch the weather for Austin when the app loads
  useEffect(() => {
    fetchWeather(cityList.find((c) => c.name === city).latitude, cityList.find((c) => c.name === city).longitude);
  }, [cityList, city]);

  // function to handle adding a new city
  const handleAddCity = () => {
    // call the geocoding API to get the city coordinates
    fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${newCity}&count=1&language=en&format=json`)
      .then((response) => response.json())
      .then((data) => {
        if (data.results.length > 0) {
          const { name, latitude, longitude } = data.results[0];
          const newCityObj = { name, latitude, longitude };
          setCityList((prevCityList) => [...prevCityList, newCityObj]);
          setNewCity(''); // reset the input field after adding the city
        } else {
          console.error('City not found!');
        }
      })
      .catch((error) => console.error('Error fetching city coordinates:', error));
  };


  return (
    <div className="App">
      <header className="App-header">
        
        {/* row for the city buttons */}
        <div className="container mt-5">
          <div className="row mb-6">
            {cityList.map((cityObj, index) => (
              <div className="col-4 mt-3" key={index}>
                <button
                  className="btn btn-secondary btn-lg rounded-pill"
                  onClick={() => setCity(cityObj.name)}
                >
                  {cityObj.name}
                </button>
              </div>
            ))}
          </div>

          {/* input box and plus button */}
          <div className="row mt-4 mb-4">
            <div className="col-auto d-flex">
              <input
                type="text"
                className="form-control"
                placeholder="Enter city"
                value={newCity}
                onChange={(e) => setNewCity(e.target.value)}
              />
              <button className="btn btn-success" onClick={handleAddCity}>
                +
              </button>
            </div>
          </div>

          {/* show forecast */}
          {forecast && (
          <div>
            <div className="row justify-content-center">
              <div className="col-12">
                <div className="d-flex justify-content-between">
                  <div><strong>Time</strong></div>
                  <div><strong>Temperature</strong></div>
                </div>
                {forecast.hourly.time.slice(0, 10).map((time, index) => {
                    // create a Date object from the time string
                    const date = new Date(time);

                    // format the date to 12-hour time with AM/PM
                    const formattedTime = date.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true,  // use 12-hour time format with AM/PM
                    });

                    return (
                      <div className="d-flex justify-content-between" key={index}>
                        <div>{formattedTime}</div>
                        <div>{forecast.hourly.temperature_2m[index]}°F</div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        )}
        </div>
      </header>
    </div>
  );
}

export default App;