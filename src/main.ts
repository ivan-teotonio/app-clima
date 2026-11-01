import "./style.css";

const form = document.querySelector<HTMLFormElement>("#search-form");
const input = document.querySelector<HTMLInputElement>("#city-search");

form?.addEventListener("submit", (event) => {
  event.preventDefault();
});

input?.addEventListener("input", () => {
  // A lógica de estado da busca será integrada nas próximas tasks
  // (Task 6 — loading, Task 7 — empty state, Task 8 — exibição de dados).
});
