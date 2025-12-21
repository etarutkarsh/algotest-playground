import type { Position } from "./trading";

export interface Strategy {
  id: string;
  name: string;
  positions: Position[];
}

export interface StrategyState {
  strategy: Strategy;
}
