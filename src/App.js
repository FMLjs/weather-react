import React, { useEffect, useState } from 'react';
import './App.css';

const api = {
  key: 'f26ce63abe589a6d49a4119d40a28d6f',
  base: 'https://api.openweathermap.org/data/2.5/',
}

function App() {
  const [input, setInput] = useState('');
  const [weather, setWeather] = useState({});
  const [className, setClassName] = useState('warm');

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(getPosition);

    } else { // Not supported
      alert("Oops! This browser does not support HTML Geolocation.");
    }
  }, [])

  const getPosition = (position) => {
    const coords = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    }
    console.log(coords)
    fetch(`${api.base}weather?lat=${coords.latitude}&lon=${coords.longitude}&appid=${api.key}&units=metric`)
      .then(response => response.json())
      .then(result => setWeather(result))
      .catch(err => console.log(err));
  }
  const search = e => {
    if (e.key === 'Enter') {
      fetch(`${api.base}weather?q=${input}&units=metric&appid=${api.key}`)
        .then(response => response.json())
        .then(result => {
          setWeather(result);
          console.log(result)
          setInput('');
        })
        .catch(err => console.log(err));
    }
  }

  useEffect(() => {
    if (typeof weather.main != 'undefined') {
      if (weather.sys.sunset - weather.dt < 0
        || (weather.sys.sunset - weather.dt > 0
          && weather.sys.sunrise - weather.dt > 0)) {
        setClassName('night');
      } else if (weather.main.temp > 16) {
        setClassName('warm');
      } else {
        setClassName('');
      }

    } else {
      setClassName('');
    }
  }, [weather])


  return (
    <div className={"app " + className}>
      <div className={'app_body ' + className}>
        <main>
          <div className="app_searchBox">
            <input type='text' className='app_searchBar'
              placeholder='Search...'
              onChange={e => setInput(e.target.value)}
              value={input}
              onKeyPress={search} />
          </div>
          {(typeof weather.main != 'undefined') ? (
            <div>
              <div className="app_locationBox">
                <div className="app_locationBoxLocation">
                  {weather.name}, {weather.sys.country}
                </div>
                <div className="app_locationBoxDate">
                  {new Date().toDateString()}
                </div>
              </div>
              <div className="app_weatherBox">
                <div className="app_weatherBoxTemp">{Math.round(weather.main.temp)}°C</div>
                <div className="app_weatherBoxWeather">{weather.weather[0].main}</div>
              </div>
            </div>
          ) : (
              <div className="app_error">
                Oops, not found!
              </div>
            )}

        </main>
      </div>
    </div>

  );
}

export default App;
