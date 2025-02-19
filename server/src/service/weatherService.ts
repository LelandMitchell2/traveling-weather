import dotenv from 'dotenv';
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
}
// TODO: Define a class for the Weather object
class Weather {
  constructor(
    public city: string,
    public country: string,
    public description: string,
    public temperature: number,
    public feelsLike: number,
    public humidity: number,
    public windSpeed: number,
    public icon: string
  ) {
    this.city = city;
    this.country = country;
    this.description = description;
    this.temperature = temperature;
    this.feelsLike = feelsLike;
    this.humidity = humidity;
    this.windSpeed = windSpeed;
    this.icon = icon;
  }
}
// TODO: Complete the WeatherService class
class WeatherService {
  // TODO: Define the baseURL, API key, and city name properties
  private baseURL: string = 'https://api.weather.com';
  private apiKey: string = process.env.WEATHER_API_KEY || '';
  private city: string = '';
  private country: string = '';

  // TODO: Create fetchLocationData method
  private async fetchLocationData(query: string) {
    const response = await fetch(query);
    if (response.status !== 200) {
      throw new Error('Location data not found');
    }
  }
  // TODO: Create destructureLocationData method
  private destructureLocationData(locationData: Coordinates): Coordinates {
    return {
      lat: locationData.lat,
      lon: locationData.lon,
    };
  }
  // TODO: Create buildGeocodeQuery method
  private buildGeocodeQuery(): string {
    return `${this.baseURL}/geocode/v1/json?q=${this.city}&key=${process.env.GEOCODE_API_KEY}`;
  }
  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    return `${this.baseURL}/weather/1.0/report.json?product=current&latitude=${coordinates.lat}&longitude=${coordinates.lon}`;
  }
  // TODO: Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData() {
    const query = this.buildGeocodeQuery();
    const locationData = await this.fetchLocationData(query);
    return this.destructureLocationData(locationData);
  }
  // TODO: Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates) {
    const query = this.buildWeatherQuery(coordinates);
    const response = await fetch(query);
    if (response.status !== 200) {
      throw new Error('Weather data not found');
    }
    return await response.json();
  }
  // TODO: Build parseCurrentWeather method
  private parseCurrentWeather(response: any) {
    const currentWeather = response.data.current_condition[0];
    return new Weather(
      this.city,
      this.country,
      currentWeather.weatherDesc[0].value,
      parseInt(currentWeather.temp_F),
      parseInt(currentWeather.FeelsLikeF),
      parseInt(currentWeather.humidity),
      parseInt(currentWeather.windspeedMiles),
      currentWeather.weatherIconUrl[0].value
    );
  }
  // TODO: Complete buildForecastArray method
  private buildForecastArray(weatherData: any[]) {
    const forecastArray = [];
    for (let i = 1; i < weatherData.length; i++) {
      const forecast = weatherData[i];
      forecastArray.push({
        date: forecast.date,
        description: forecast.weatherDesc[0].value,
        temperature: parseInt(forecast.tempMaxF),
        icon: forecast.weatherIconUrl[0].value,
      });
    }
    return forecastArray;
  }
  // TODO: Complete getWeatherForCity method
  async getWeatherForCity(city: string) {
    this.city = city;
    const coordinates = await this.fetchAndDestructureLocationData();
    const weatherData = await this.fetchWeatherData(coordinates);
    const currentWeather = this.parseCurrentWeather(weatherData);
    const forecastArray = this.buildForecastArray(weatherData.data.weather);
    return { currentWeather, forecastArray };
  }
}


export default new WeatherService();
