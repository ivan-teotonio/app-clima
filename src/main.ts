import "./style.css";
import { getCityCoordinates, getWeather } from "./services/open-meteo";
import { getWeatherDescription, getWindDirection, isDay, getDayOfWeek } from "./utils/mappings";
import type { ForecastResponse, GeocodingResult } from "./types/open-meteo";

const form = document.querySelector<HTMLFormElement>("#search-form");
const input = document.querySelector<HTMLInputElement>("#city-search");
const loading = document.querySelector<HTMLElement>("#loading");
const emptyState = document.querySelector<HTMLElement>("#empty-state");
const sidebarTemperature = document.querySelector<HTMLElement>("#sidebar-temperature");
const sidebarCityName = document.querySelector<HTMLElement>("#sidebar-city-name");
const sidebarCountryCode = document.querySelector<HTMLElement>("#sidebar-country-code");
const sidebarDay = document.querySelector<HTMLElement>("#sidebar-day");
const sidebarIsDay = document.querySelector<HTMLElement>("#sidebar-is-day");
const sidebarWeatherCode = document.querySelector<HTMLElement>("#sidebar-weather-code");
const weatherInfoHumidity = document.querySelector<HTMLElement>("#weather-info-humidity");
const weatherInfoApparentTemperature = document.querySelector<HTMLElement>("#weather-info-apparent-temperature");
const weatherInfoPrecipitationProbability = document.querySelector<HTMLElement>("#weather-info-precipitation-probability");
const weatherInfoWindSpeed = document.querySelector<HTMLElement>("#weather-info-wind-speed");
const weatherInfoWindDirection = document.querySelector<HTMLElement>("#weather-info-wind-direction");

let isLoading = false;

const showLoading = () => {
  loading?.removeAttribute("hidden");
};

const hideLoading = () => {
  loading?.setAttribute("hidden", "");
};

const showEmptyState = () => {
  emptyState?.removeAttribute("hidden");
};

const hideEmptyState = () => {
  emptyState?.setAttribute("hidden", "");
};

// Task 7: exibe o Empty State no carregamento inicial (antes de qualquer busca).
showEmptyState();

/** Exibe os dados do forecast na sidebar e na área principal. */
const renderWeather = (city: GeocodingResult, forecast: ForecastResponse) => {
  const current = forecast.current;

  // Sidebar: temperatura, cidade + código do país, dia atual, is_day e weather code.
  sidebarTemperature!.textContent = `${current.temperature_2m}°C`;
  sidebarCityName!.textContent = city.name;
  sidebarCountryCode!.textContent = city.country_code;
  sidebarDay!.textContent = getDayOfWeek(current.time);
  sidebarIsDay!.textContent = isDay(current.is_day) ? "Dia" : "Noite";
  sidebarWeatherCode!.textContent = getWeatherDescription(current.weather_code);

  // Área principal: umidade, temperatura aparente, probabilidade de precipitação e vento.
  weatherInfoHumidity!.textContent = `${current.relative_humidity_2m}%`;
  weatherInfoApparentTemperature!.textContent = `${current.apparent_temperature}°C`;
  weatherInfoPrecipitationProbability!.textContent = `${current.precipitation_probability}%`;
  weatherInfoWindSpeed!.textContent = `${current.wind_speed_10m} km/h`;
  weatherInfoWindDirection!.textContent = getWindDirection(current.wind_direction_10m);
};

form?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const cityName = input?.value.trim() ?? "";
  if (!cityName || isLoading) return;

  isLoading = true;
  showLoading();

  try {
    const geocoding = await getCityCoordinates(cityName);
    if (!geocoding) {
      showEmptyState();
      return;
    }

    const { latitude, longitude, timezone } = geocoding.results[0];
    const forecast = await getWeather(latitude, longitude, timezone);
    if (!forecast) {
      showEmptyState();
      return;
    }

    hideEmptyState();
    renderWeather(geocoding.results[0], forecast);
  } finally {
    isLoading = false;
    hideLoading();
  }
});

input?.addEventListener("input", () => {
  // A lógica de estado da busca será integrada nas próximas tasks
  // (Task 9 — tratamento de erros).
});
