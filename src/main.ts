import "./style.css";
import { getCityCoordinates, getWeather } from "./services/open-meteo";

const form = document.querySelector<HTMLFormElement>("#search-form");
const input = document.querySelector<HTMLInputElement>("#city-search");
const loading = document.querySelector<HTMLElement>("#loading");
const emptyState = document.querySelector<HTMLElement>("#empty-state");

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

// Task 7: exibe o Empty State no carregamento inicial (antes de qualquer busca).
showEmptyState();

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
    }
  } finally {
    isLoading = false;
    hideLoading();
  }
});

input?.addEventListener("input", () => {
  // A lógica de estado da busca será integrada nas próximas tasks
  // (Task 8 — exibição de dados).
});
