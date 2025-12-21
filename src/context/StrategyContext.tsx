import React, { createContext } from "react";
import type { StrategyState } from "../types/strategy";
import type { StrategyAction } from "../types/websocket";

export interface StrategyContextType {
  state: StrategyState;
  dispatch: React.Dispatch<StrategyAction>;
}

export const StrategyContext =
  createContext<StrategyContextType | null>(null);
