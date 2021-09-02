import express from "express";
import constants from "./constants.js";
import Redis from "ioredis";
import axios from "axios";
import "dotenv/config";
const app = express();
const redis = new Redis(constants.redis);

const keyCheck = () => {
  if (!process.env.WEATHER_API_KEY) {
    console.error(`No Weather API key detected`);
    quit();
  }
};

const quit = () => {
  redis.quit();
  process.exit();
};

const cityEndpoint = (city) => `${constants.endpoint(city)}${constants.key}`;

const getWeather = async (city) => {
  keyCheck();
  let cacheEntry = await redis.get(`weather:${city}`);

  if (cacheEntry) {
    cacheEntry = JSON.parse(cacheEntry);
    return { ...cacheEntry, source: "coming from redis cache" };
  }

  const apiResponse = await axios.get(cityEndpoint(city));
  redis.set(`weather:${city}`, JSON.stringify(apiResponse.data), "EX", 900);
  return { ...apiResponse.data, source: "coming from API" };
};



app.use(express.json());

app.route("/").get((req, res) => {
  res.status(200).send(weather);
});

app.route("/city").post(async (req, res) => {
  const city = req.body.city;

  const t0 = new Date().getTime();
  const weather = await getWeather(city);
  const t1 = new Date().getTime();
  weather.responseTime = `${t1 - t0}ms`;
  res.status(200).send(weather);
});

app.listen(9000, () => {
  console.log("server is running on port 9000");
});
