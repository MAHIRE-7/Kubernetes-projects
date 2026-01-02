const express = require('express');
const app = express();
const port = 3000;

app.use(express.static('.'));

const weatherData = {
  'new york': { temp: 22, condition: 'Sunny', humidity: 65 },
  'london': { temp: 15, condition: 'Cloudy', humidity: 80 },
  'tokyo': { temp: 28, condition: 'Rainy', humidity: 75 },
  'mumbai': { temp: 32, condition: 'Hot', humidity: 85 },
  'sydney': { temp: 18, condition: 'Windy', humidity: 60 }
};

app.get('/api/weather/:city', (req, res) => {
  const city = req.params.city.toLowerCase();
  const weather = weatherData[city];
  
  if (weather) {
    res.json({ city: req.params.city, ...weather });
  } else {
    res.status(404).json({ error: 'City not found' });
  }
});

app.get('/api/cities', (req, res) => {
  res.json(Object.keys(weatherData));
});

app.listen(port, () => {
  console.log(`Weather app listening at http://localhost:${port}`);
});