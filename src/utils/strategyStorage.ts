import type { StrategyState } from "../types/strategy";

const STORAGE_KEY = "algotest_strategies";

export function loadStrategies(): StrategyState[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveStrategy(strategy: StrategyState) {
  const strategies = loadStrategies();

  const index = strategies.findIndex(
    (s) => s.strategy.id === strategy.strategy.id
  );

  if (index >= 0) {
    strategies[index] = strategy;
  } else {
    strategies.push(strategy);
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(strategies));
}

export function deleteStrategy(id: string) {
  const strategies = loadStrategies().filter(
    (s) => s.strategy.id !== id
  );

  localStorage.setItem(STORAGE_KEY, JSON.stringify(strategies));
}
