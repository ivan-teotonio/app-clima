/**
 * Componente SearchBar — campo único de busca da cidade.
 *
 * Renderiza o campo de busca com label associado e placeholder descritivo,
 * acessível por teclado (Enter submete via <form>) e controlado pelo
 * componente pai através das props (value / onChange / onSubmit).
 *
 * Referência: docs/prd.md — RF-01 (seção 3.1).
 */

export interface SearchBarOptions {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
}

const INPUT_ID = "city-search";

/** Cria o campo de busca único (label associado + placeholder). */
export function createSearchBar({
  value,
  onChange,
  onSubmit,
}: SearchBarOptions): HTMLFormElement {
  const form = document.createElement("form");
  form.className = "search-bar";

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    onSubmit();
  });

  const label = document.createElement("label");
  label.className = "sr-only";
  label.htmlFor = INPUT_ID;
  label.textContent = "Cidade";

  const input = document.createElement("input");
  input.className = "search-bar__input";
  input.id = INPUT_ID;
  input.name = "city";
  input.type = "text";
  input.value = value;
  input.placeholder = "Ex.: São Paulo";
  input.autocomplete = "off";

  input.addEventListener("input", () => {
    onChange(input.value);
  });

  form.appendChild(label);
  form.appendChild(input);

  return form;
}
