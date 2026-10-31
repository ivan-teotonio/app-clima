/**
 * Utilitários de mapeamento e flags meteorológicas.
 *
 * Referência: docs/prd.md — seções 5.5 (Mapeamentos e regras de negócio) e 6.4 (Weather codes).
 */

const WEATHER_CODES: Record<number, string> = {
  0: "Céu claro",
  1: "Predominantemente claro",
  2: "Parcialmente nublado",
  3: "Encoberto",
  45: "Neblina",
  48: "Neblina com deposição",
  51: "Garoa: Leve",
  53: "Garoa: Moderada",
  55: "Garoa: Densa",
  56: "Garoa congelante: Leve",
  57: "Garoa congelante: Densa",
  61: "Chuva: Leve",
  63: "Chuva: Moderada",
  65: "Chuva: Forte",
  66: "Chuva congelante: Leve",
  67: "Chuva congelante: Forte",
  71: "Neve: Leve",
  73: "Neve: Moderada",
  75: "Neve: Forte",
  77: "Grãos de neve",
  80: "Chuva em ráfagas: Leve",
  81: "Chuva em ráfagas: Moderada",
  82: "Chuva em ráfagas: Violenta",
  85: "Chuva e neve em ráfagas: Leve",
  86: "Chuva e neve em ráfagas: Forte",
  95: "Tempestade com granizo",
  99: "Tempestade com granizo",
};

/** Converte um weather code (WMO) em sua descrição em português. */
export function getWeatherDescription(code: number): string {
  return WEATHER_CODES[code] ?? "Condições desconhecidas";
}

const WIND_DIRECTIONS = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];

/** Converte a direção do vento em graus para a direção cardinal. */
export function getWindDirection(degrees: number): string {
  const normalized = ((Math.round(degrees) % 360) + 360) % 360;
  const index = Math.round(normalized / 45) % 8;
  return WIND_DIRECTIONS[index];
}

/** Indica se é dia (1) ou noite (0) com base no campo `is_day` da API. */
export function isDay(isDay: number): boolean {
  return isDay === 1;
}

/** Retorna o dia da semana em português a partir do campo `time` (ISO 8601) do forecast. */
export function getDayOfWeek(time: string): string {
  const date = new Date(time);
  if (Number.isNaN(date.getTime())) {
    return "";
  }
  return new Intl.DateTimeFormat("pt-BR", { weekday: "long" }).format(date);
}
