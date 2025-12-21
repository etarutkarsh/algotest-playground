import { useEffect, useMemo, useRef, useState } from "react";
import { useStrategy } from "../../context/useStrategy";
import { calculateTotalPnL } from "../../utils/payoff";

const SELL_MARGIN_PER_LOT = 250000;

export default function StatsPanel() {
  const { state } = useStrategy();
  if (!state.strategy) return;

  const positions = state.strategy.positions.filter(
    (p) => p.enabled
  );

  /* -----------------------
     Unrealised PnL
  ------------------------ */
  const pnl = calculateTotalPnL(positions);

  /* -----------------------
     Margin Required
  ------------------------ */
  const margin = useMemo(() => {
    return positions.reduce((total, p) => {
      if (p.side === "SELL") {
        return total + p.lots * SELL_MARGIN_PER_LOT;
      }
      return total;
    }, 0);
  }, [positions]);

  /* -----------------------
     Profit Percentage
  ------------------------ */
  const profitPercentage =
    margin === 0 ? 0 : (pnl / margin) * 100;

  /* -----------------------
     Day Max Profit / Loss
  ------------------------ */
  const maxProfitRef = useRef<number>(-Infinity);
  const maxLossRef = useRef<number>(Infinity);

  const [maxProfit, setMaxProfit] = useState(0);
  const [maxProfitTime, setMaxProfitTime] = useState<number | null>(null);

  const [maxLoss, setMaxLoss] = useState(0);
  const [maxLossTime, setMaxLossTime] = useState<number | null>(null);

  useEffect(() => {
    const now = Date.now();

    if (pnl > maxProfitRef.current) {
      maxProfitRef.current = pnl;
      setMaxProfit(pnl);
      setMaxProfitTime(now);
    }

    if (pnl < maxLossRef.current) {
      maxLossRef.current = pnl;
      setMaxLoss(pnl);
      setMaxLossTime(now);
    }
  }, [pnl]);

  return (
    <div className="grid grid-cols-4 gap-4 text-sm">
      <Stat
        label="PnL"
        value={`₹${pnl.toFixed(0)}`}
        color={pnl >= 0 ? "text-green-600" : "text-red-600"}
      />

      <Stat
        label="Margin"
        value={`₹${margin.toLocaleString()}`}
      />

      <Stat
        label="Profit %"
        value={`${profitPercentage.toFixed(2)}%`}
      />

      <Stat
        label="Day Max P/L"
        value={`${formatSigned(maxProfit)} / ${formatSigned(maxLoss)}`}
        subValue={`${formatTime(maxProfitTime)} | ${formatTime(maxLossTime)}`}
      />
    </div>
  );
}

/* -----------------------
   Reusable Stat Component
------------------------ */
function Stat({
  label,
  value,
  subValue,
  color,
}: {
  label: string;
  value: string;
  subValue?: string;
  color?: string;
}) {
  return (
    <div>
      <p className="text-gray-500 text-xs">{label}</p>
      <p className={`font-semibold ${color ?? ""}`}>{value}</p>
      {subValue && (
        <p className="text-xs text-gray-400">{subValue}</p>
      )}
    </div>
  );
}

/* -----------------------
   Helpers
------------------------ */
function formatTime(ts: number | null) {
  if (!ts) return "--";
  return new Date(ts).toLocaleTimeString();
}

function formatSigned(value: number) {
  return value >= 0
    ? `₹${value.toFixed(0)}`
    : `-₹${Math.abs(value).toFixed(0)}`;
}
