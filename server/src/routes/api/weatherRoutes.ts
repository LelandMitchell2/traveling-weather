import { Router, type Request, type Response } from 'express';
import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

const router = Router();



// TODO: POST Request with city name to retrieve weather data
router.post('/', (req: Request, res: Response) => {
  const { cityName } = req.body;
  console.log('cityName: ', cityName);
  // TODO: GET weather data from city name
  WeatherService.getWeatherForCity(cityName)
    .then((data) => {
      // console.log("trying to send data" data)
      // console.log(data);
      res.json(data);
    })
    .catch((error) => {
      res.status(500).json({ message: error.message });
    });
  // TODO: save city to search history
  HistoryService.addCity(cityName);
});

// TODO: GET search history
router.get('/history', async (_req: Request, res: Response) => {
  try {
    const cities = await HistoryService.getCities();
    console.log('Search history retrieved:', cities);
    res.json(cities);
  } catch (error) {
    console.error('Error retrieving search history:', error);
    res.status(500).json({ error: 'Failed to retrieve search history' });
  }
});

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await HistoryService.removeCity(id);
    console.log(`City with id ${id} removed from search history`);
    res.json({ message: 'City removed from search history' });
  } catch (error) {
    console.error('Error removing city from search history:', error);
    res
      .status(500)
      .json({ error: 'Failed to remove city from search history' });
  }
});

export default router;
