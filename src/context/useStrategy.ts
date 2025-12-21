import { useContext } from "react";
import { StrategyContext } from "./StrategyContext";

export function useStrategy() {
  const context = useContext(StrategyContext);

  if (!context) {
    throw new Error("useStrategy must be used within StrategyProvider");
  }

  return context;
}
