import type { Position } from "../types/trading";

export function calculatePositionPnL(p: Position) {
  const diff = p.side === "BUY" ? p.ltp - p.price : p.price - p.ltp;

  return diff * p.lots * 25; // BANKNIFTY lot size = 25
}

export function calculateTotalPnL(positions: Position[]) {
  return positions.reduce((sum, p) => sum + calculatePositionPnL(p), 0);
}
