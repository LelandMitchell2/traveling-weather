import * as fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);






// TODO: Define a City class with name and id properties
class City {
  constructor(public name: string, public id: string) {
    this.name = name;
    this.id = id;
  }
}

// TODO: Complete the HistoryService class
class HistoryService {
  private filePath = path.join(__dirname, 'db/db.json');
  private async ensureFileExists() {
    try {
      await fs.promises.access(this.filePath);
    } catch (error) {
      await fs.promises.mkdir(path.dirname(this.filePath), { recursive: true });
      await fs.promises.writeFile(this.filePath, '[]');
    }
  }
  constructor() {
    this.ensureFileExists();
  }
  // TODO: Define a read method that reads from the searchHistory.json file
  private async read(): Promise<City[]> {
    const data = await fs.promises.readFile('db/db.json', 'utf-8');
    console.log('debug 1: ', data);
    return JSON.parse(data);
  }
// TODO: Define a write method that writes the updated cities array to the searchHistory.json file
  // private async write(cities: City[]) {}
  private async write(cities: City[]){
    console.log('debug 2: ', cities);
    await fs.promises.writeFile('db/db.json', JSON.stringify(cities, null, 2));
  }
  // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  // async getCities() {}
  async getCities(): Promise<City[]> {
    console.log('debug 3: ');
    return await this.read();
  }
  // TODO Define an addCity method that adds a city to the searchHistory.json file
  // async addCity(city: string) {}
  async addCity(city: string): Promise<void> {
    let cities = await this.read();
    const existingCityIndex = cities.findIndex(c => c.name === city);
    if (existingCityIndex !== -1) {
      cities[existingCityIndex] = new City(city, Date.now().toString());
    } else {
      const newCity = new City(city, Date.now().toString());
      cities.push(newCity);
    }
    await this.write(cities);
  }
    // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
    // async removeCity(id: string) {}
    async removeCity(id: string): Promise<void> {
      let cities = await this.read();
      cities = cities.filter(city => city.id !== id);
      await this.write(cities);
    }
  }


export default new HistoryService();
