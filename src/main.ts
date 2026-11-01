import "./style.css";
import { getCityCoordinates, getWeather } from "./services/open-meteo";
import {
  getWeatherDescription,
  getWindDirection,
  getDayOfWeek,
  getWeatherTheme,
  isDay,
} from "./utils/mappings";
import type { ForecastResponse, GeocodingResult } from "./types/open-meteo";

const form = document.querySelector<HTMLFormElement>("#search-form");
const input = document.querySelector<HTMLInputElement>("#city-search");
const loading = document.querySelector<HTMLElement>("#loading");
const emptyState = document.querySelector<HTMLElement>("#empty-state");
const emptyStateTitle = document.querySelector<HTMLElement>("#empty-state-title");
const emptyStateHint = document.querySelector<HTMLElement>("#empty-state-hint");
const card = document.querySelector<HTMLElement>("#content");
const sidebarTemperature = document.querySelector<HTMLElement>("#sidebar-temperature");
const sidebarCityName = document.querySelector<HTMLElement>("#sidebar-city-name");
const sidebarCountryCode = document.querySelector<HTMLElement>("#sidebar-country-code");
const sidebarDay = document.querySelector<HTMLElement>("#sidebar-day");
const sidebarIsDay = document.querySelector<HTMLElement>("#sidebar-is-day");
const sidebarIsDayIcon = document.querySelector<HTMLElement>("#sidebar-is-day-icon");
const sidebarWeatherCode = document.querySelector<HTMLElement>("#sidebar-weather-code");
const weatherInfoHumidity = document.querySelector<HTMLElement>("#weather-info-humidity");
const weatherInfoApparentTemperature = document.querySelector<HTMLElement>("#weather-info-apparent-temperature");
const weatherInfoPrecipitationProbability = document.querySelector<HTMLElement>("#weather-info-precipitation-probability");
const weatherInfoWindSpeed = document.querySelector<HTMLElement>("#weather-info-wind-speed");
const weatherInfoWindDirection = document.querySelector<HTMLElement>("#weather-info-wind-direction");

let isLoading = false;

const showLoading = () => {
  loading?.classList.remove("hidden");
};

const hideLoading = () => {
  loading?.classList.add("hidden");
};

const showCard = () => {
  card?.classList.remove("hidden");
};

const hideCard = () => {
  card?.classList.add("hidden");
};

/** Remove o tema climático (volta ao fundo cinza escuro neutro). */
const clearWeatherTheme = () => {
  document.body.removeAttribute("data-weather");
  document.body.removeAttribute("data-daytime");
};

/** Aplica a paleta de cores que combina com a condição climática retornada. */
const applyWeatherTheme = (weatherCode: number, dayFlag: number) => {
  document.body.dataset.weather = getWeatherTheme(weatherCode);
  document.body.dataset.daytime = isDay(dayFlag) ? "day" : "night";
};

/** Mensagens do Empty State: estado inicial (orientação) e busca sem resultados. */
const EMPTY_STATE_MESSAGES = {
  initial: {
    title: "Busque uma cidade para começar.",
    hint: "Digite o nome da cidade e pressione Enter.",
  },
  notFound: {
    title: "Não encontramos dados para esta cidade.",
    hint: "Verifique o nome digitado ou tente outra cidade.",
  },
} as const;

type EmptyStateVariant = keyof typeof EMPTY_STATE_MESSAGES;

const showEmptyState = (variant: EmptyStateVariant = "initial") => {
  const message = EMPTY_STATE_MESSAGES[variant];
  if (emptyStateTitle) {
    emptyStateTitle.textContent = message.title;
  }
  if (emptyStateHint) {
    emptyStateHint.textContent = message.hint;
  }
  emptyState?.classList.remove("hidden");
};

/** Estado inicial: Empty State de orientação, card oculto e tema neutro. */
const resetView = () => {
  clearWeatherTheme();
  hideCard();
  showEmptyState("initial");
};

/** Busca sem resultados: Empty State de "cidade não encontrada". */
const showNotFoundState = () => {
  clearWeatherTheme();
  hideCard();
  showEmptyState("notFound");
};

// Estado inicial da aplicação (antes de qualquer busca).
resetView();

/** Exibe os dados do forecast na sidebar e na área principal (substitui os placeholders "--"). */
const renderWeather = (city: GeocodingResult, forecast: ForecastResponse) => {
  const current = forecast.current;

  // Sidebar: temperatura, cidade + código do país, dia atual, is_day e weather code.
  sidebarTemperature!.textContent = `${current.temperature_2m}°C`;
  sidebarCityName!.textContent = city.name;
  sidebarCountryCode!.textContent = city.country_code;
  sidebarDay!.textContent = getDayOfWeek(current.time);
  const day = isDay(current.is_day);
  sidebarIsDayIcon!.textContent = day ? "☀" : "☾";
  sidebarIsDay!.textContent = day ? "Dia" : "Noite";
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

  if (isLoading) return;

  const cityName = input?.value.trim() ?? "";

  // Campo vazio (ex.: após limpar a busca) → limpa o resultado e volta ao estado inicial.
  if (!cityName) {
    resetView();
    return;
  }

  isLoading = true;
  showLoading();

  try {
    const geocoding = await getCityCoordinates(cityName);
    if (!geocoding) {
      // Geocoding sem resultados → "cidade não encontrada".
      showNotFoundState();
      return;
    }

    const { latitude, longitude, timezone } = geocoding.results[0];
    const forecast = await getWeather(latitude, longitude, timezone);
    if (!forecast) {
      // Forecast sem dados → "cidade não encontrada".
      showNotFoundState();
      return;
    }

    // Sucesso → tema conforme o clima, oculta o Empty State, revela o card e injeta os dados.
    applyWeatherTheme(forecast.current.weather_code, forecast.current.is_day);
    emptyState?.classList.add("hidden");
    showCard();
    renderWeather(geocoding.results[0], forecast);
  } catch {
    // Falhas no fluxo convergem para o Empty State, sem erro técnico ao usuário.
    showNotFoundState();
  } finally {
    isLoading = false;
    hideLoading();
  }
});
