
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { StrategyProvider } from "./context/StrategyProvider";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <StrategyProvider>
      <App />
    </StrategyProvider>
  </StrictMode>
);
