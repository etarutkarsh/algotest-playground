import { useStrategy } from "../../context/useStrategy";

export default function PayoffPanel() {
  const { state } = useStrategy();

  if (state.strategy.positions.length === 0) {
    return (
      <div className="border rounded p-4 text-sm text-gray-500">
        Add positions to see payoff
      </div>
    );
  }

  // price range
  const prices = Array.from({ length: 40 }, (_, i) => 43000 + i * 200);

  // payoff calculation
  const payoff = prices.map((price) => {
    let total = 0;

    state.strategy.positions.forEach((p) => {
      let intrinsic = 0;

      if (p.optionType === "CALL") intrinsic = Math.max(price - p.strike, 0);
      else intrinsic = Math.max(p.strike - price, 0);

      const pnl =
        p.side === "BUY" ? intrinsic - p.price : p.price - intrinsic;

      total += pnl * p.lots * 25;
    });

    return total;
  });

  const max = Math.max(...payoff);
  const min = Math.min(...payoff);

  // normalize payoff → SVG points
  const points = payoff.map((p, i) => {
    const x = 50 + (i / (payoff.length - 1)) * 500;
    const y = 150 - ((p - min) / (max - min || 1)) * 200 + 100;

    return `${x},${y}`;
  });

  return (
    <div className="h-full border rounded p-3 flex flex-col">
      <h3 className="font-semibold mb-2">Payoff</h3>

      <svg viewBox="0 0 600 300" className="w-full h-full">
        {/* X Axis */}
        <line x1="50" y1="150" x2="550" y2="150" stroke="#999" />

        {/* Y Axis */}
        <line x1="300" y1="20" x2="300" y2="280" stroke="#999" />

        {/* Payoff line */}
        <polyline
          points={points.join(" ")}
          fill="none"
          stroke="#2563eb"
          strokeWidth="3"
        />
      </svg>
    </div>
  );
}
