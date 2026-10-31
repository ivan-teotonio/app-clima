/**
 * Service layer do Open-Meteo.
 *
 * Encapsula as requisições de geocoding e forecast da API Open-Meteo,
 * para que os componentes nunca façam requisições diretas à API.
 *
 * Referência: docs/prd.md — seções 5.2, 5.3, 5.4 e 5.5.
 */

import type { ForecastResponse, GeocodingResponse } from "../types/open-meteo";

const GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search";
const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";

/** Busca a cidade e retorna os dados de geocoding (ou null se não encontrada/falhou). */
export async function getCityCoordinates(cityName: string): Promise<GeocodingResponse | null> {
  const params = new URLSearchParams({
    name: cityName,
    count: "1",
    language: "pt",
    format: "json",
  });

  const response = await fetch(`${GEOCODING_URL}?${params.toString()}`);
  if (!response.ok) {
    return null;
  }

  const data = (await response.json()) as GeocodingResponse;

  if (!data.results || data.results.length === 0) {
    return null;
  }

  return data;
}

/** Busca as condições climáticas da localização informada (ou null se não retornadas). */
export async function getWeather(
  latitude: number,
  longitude: number,
  timezone: string,
): Promise<ForecastResponse | null> {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    current:
      "precipitation_probability,temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,wind_speed_10m,wind_direction_10m,weather_code",
    timezone,
  });

  const response = await fetch(`${FORECAST_URL}?${params.toString()}`);
  if (!response.ok) {
    return null;
  }

  const data = (await response.json()) as ForecastResponse;

  if (!data.current) {
    return null;
  }

  return data;
}
