import React from "react";
import App from "./components/App";
import { createRoot } from "react-dom/client";

const render = (Component: typeof App) => {
  createRoot(document.getElementById("container") as HTMLElement).render(
    <React.StrictMode>
      <Component />
    </React.StrictMode>
  );
};

/* Render application after Office initializes */
Office.onReady(() => {
  render(App);
});
