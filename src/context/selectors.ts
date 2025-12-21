import type { Position } from "../types/trading";

export function calculatePnL(positions: Position[]) {
  return positions.reduce((total, p) => {
    if (!p.enabled) return total;

    const diff = p.side === "BUY" ? p.ltp - p.price : p.price - p.ltp;

    return total + diff * p.lots;
  }, 0);
}

export function calculateMargin(positions: Position[]) {
  return (
    positions.filter((p) => p.side === "SELL" && p.enabled).length * 250000
  );
}

export function enabledPositions(positions: Position[]) {
  return positions.filter((p) => p.enabled);
}
