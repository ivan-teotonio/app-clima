/**
 * Tipos dos contratos da API Open-Meteo utilizados pelo aplicativo Clima.
 *
 * Referência: docs/prd.md — seções 5.3 (Geocoding) e 5.4 (Forecast).
 */

export type GeocodingResult = {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  elevation: number;
  feature_code: string;
  country_code: string;
  admin1_id: number;
  admin2_id: number;
  timezone: string;
  population: number;
  country: string;
  admin1: string;
  admin2: string;
};

export type GeocodingResponse = {
  results: GeocodingResult[];
  generationtime_ms: number;
};

export type CurrentUnits = {
  time: string;
  interval: string;
  precipitation_probability: string;
  temperature_2m: string;
  relative_humidity_2m: string;
  apparent_temperature: string;
  is_day: string;
  wind_speed_10m: string;
  wind_direction_10m: string;
  precipitation: string;
  weather_code: string;
};

export type CurrentWeather = {
  time: string;
  interval: number;
  temperature_2m: number;
  relative_humidity_2m: number;
  apparent_temperature: number;
  is_day: number;
  wind_speed_10m: number;
  wind_direction_10m: number;
  precipitation: number;
  weather_code: number;
  precipitation_probability: number;
};

export type ForecastResponse = {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  current_units: CurrentUnits;
  current: CurrentWeather;
};
