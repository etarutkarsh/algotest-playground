import { useEffect, useMemo, useRef, useState } from "react";
import { useStrategy } from "../context/useStrategy";
//import type { Position } from "../types/trading";

const SELL_MARGIN_PER_LOT = 250000;

export function useStats() {
  const { state } = useStrategy();
if (!state.strategy) return;
  const positions = state.strategy.positions.filter(
    (p) => p.enabled
  );

  /* ---------------------------
     Unrealised PnL Calculation
  ---------------------------- */
  const unrealisedPnl = useMemo(() => {
    return positions.reduce((total, p) => {
      const qty = p.lots * p.lotSize;

      const pnl =
        p.side === "BUY"
          ? (p.ltp - p.entryPrice) * qty
          : (p.entryPrice - p.ltp) * qty;

      return total + pnl;
    }, 0);
  }, [positions]);

  /* ---------------------------
     Margin Calculation
  ---------------------------- */
  const marginRequired = useMemo(() => {
    return positions.reduce((total, p) => {
      if (p.side === "SELL") {
        return total + p.lots * SELL_MARGIN_PER_LOT;
      }
      return total;
    }, 0);
  }, [positions]);

  /* ---------------------------
     Max Profit / Loss Tracking
  ---------------------------- */
  const maxProfitRef = useRef<number>(-Infinity);
  const maxLossRef = useRef<number>(Infinity);

  const [maxProfit, setMaxProfit] = useState<number>(0);
  const [maxProfitTime, setMaxProfitTime] = useState<number | null>(null);

  const [maxLoss, setMaxLoss] = useState<number>(0);
  const [maxLossTime, setMaxLossTime] = useState<number | null>(null);

  useEffect(() => {
    const now = Date.now();

    if (unrealisedPnl > maxProfitRef.current) {
      maxProfitRef.current = unrealisedPnl;
      setMaxProfit(unrealisedPnl);
      setMaxProfitTime(now);
    }

    if (unrealisedPnl < maxLossRef.current) {
      maxLossRef.current = unrealisedPnl;
      setMaxLoss(unrealisedPnl);
      setMaxLossTime(now);
    }
  }, [unrealisedPnl]);

  /* ---------------------------
     Profit Percentage
  ---------------------------- */
  const profitPercentage = useMemo(() => {
    if (marginRequired === 0) return 0;
    return (unrealisedPnl / marginRequired) * 100;
  }, [unrealisedPnl, marginRequired]);

  return {
    unrealisedPnl,
    marginRequired,
    profitPercentage,
    maxProfit,
    maxProfitTime,
    maxLoss,
    maxLossTime,
  };
}
