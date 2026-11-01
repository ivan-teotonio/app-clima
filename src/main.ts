import "./style.css";
import { createSearchBar } from "./components/SearchBar";

const app = document.getElementById("app");

if (app) {
  const header = document.createElement("section");
  header.className = "app-header";

  const searchBar = createSearchBar({
    value: "",
    onChange: () => undefined,
    onSubmit: () => undefined,
  });

  header.appendChild(searchBar);
  app.appendChild(header);
}
