import { Router, type Request, type Response } from 'express';
import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';
import historyService from '../../service/historyService.js';
const router = Router();



// TODO: POST Request with city name to retrieve weather data
router.post('/', (req: Request, res: Response) => {
  // TODO: GET weather data from city name
  WeatherService.getWeatherForCity(req.body.cityName)
    .then((data) => {
      console.log("trying to send data")
      console.log(data);
      res.json(data);
    })
    .catch((error) => {
      res.status(500).json({ message: error.message });
    });
  // TODO: save city to search history
  HistoryService.addCity(req.body.cityName);
});

// TODO: GET search history
router.get('/history', async (_req: Request, res: Response) => {
  historyService.getCities()
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      res.status(500).json({ message: error.message });
    });
});

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req: Request, res: Response) => {
  HistoryService.removeCity(req.params.id)
    .then(() => {
      res.json({ message: 'City removed from search history' });
    })
    .catch((error) => {
      res.status(500).json({ message: error.message });
    });
});

export default router;
