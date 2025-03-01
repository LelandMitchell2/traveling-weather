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
    public date: string,
    // public country: string,
    public icon: string,
    public iconDescription: string,
    public tempF: number,
    public windSpeed: number,
    public humidity: number
    
  ) {
    this.city = city;
    this.date = date;
    // this.country = country;
    this.icon = icon;
    this.iconDescription = iconDescription;
    this.tempF = tempF;
    this.windSpeed = windSpeed;
    this.humidity = humidity;
  }
}
// TODO: Complete the WeatherService class
class WeatherService {
  // TODO: Define the baseURL, API key, and city name properties
  private baseURL = 'http://api.openweathermap.org';
  private apiKey = process.env.API_KEY;
  private cityName: string = '';


  

  // TODO: Create fetchLocationData method
  private async fetchLocationData(query: string) {
    const response = await fetch(query);
    if (response.status !== 200) {
      throw new Error('Location data not found');
    }
    return response; // Ensure the response is returned
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
    return `${this.baseURL}/geo/1.0/direct?q=${this.cityName}&limit=1&appid=${this.apiKey}`;
  }
  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    return `${this.baseURL}/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&units=imperial&appid=${this.apiKey}`;
  }
  // TODO: Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData() {
    const query = this.buildGeocodeQuery();
    // console.log(query);
    const response = await this.fetchLocationData(query);
    const locationData = await response.json();
    if (!locationData || locationData.length === 0) {
      throw new Error('Location data not found');
    }
    this.cityName = locationData[0].name || this.cityName; // Ensure city is set correctly
    // this.country = locationData[0].country || this.country; // Ensure country is set correctly
    return this.destructureLocationData(locationData[0]);
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
    const currentWeather = response.list[0];
    // console.log(response);
    return new Weather(
      this.cityName,
      currentWeather.dt_txt,
      currentWeather.weather[0].icon,
      currentWeather.weather[0].description,
      currentWeather.main.temp,
      currentWeather.wind.speed,
      currentWeather.main.humidity
    );
  }
  // TODO: Complete buildForecastArray method
  private buildForecastArray(weatherData: any[]) {
    const forecastArray = [];
    for (let i = 1; i < weatherData.length && forecastArray.length < 5; i++) {
      const forecast = weatherData[i];
      const weather = new Weather(
        this.cityName,
        forecast.dt_txt,
        forecast.weather[0].icon,
        forecast.weather[0].description,
        forecast.main.temp,
        forecast.wind.speed,
        forecast.main.humidity
      );
      forecastArray.push(weather);
      //   {
      //   date: forecast.dt_txt,
      //   description: forecast.weather[0].description,
      //   temperature: parseInt(forecast.main.temp),
      //   icon: forecast.weather[0].icon,
      // }
    }
    return forecastArray;
  }
  // TODO: Complete getWeatherForCity method
  async getWeatherForCity(city: string) {
    // console.log("the city is: ", city);
    this.cityName = city;
    const coordinates = await this.fetchAndDestructureLocationData();
    // const locationData = await this.fetchAndDestructureLocationData();
    // this.country = locationData.country || '';
    const weatherData = await this.fetchWeatherData(coordinates);
    const currentWeather = this.parseCurrentWeather(weatherData);
    const forecastArray = this.buildForecastArray(weatherData.list);
    // console.log(currentWeather);
    return { currentWeather, forecastArray };
  }
}


export default new WeatherService();
