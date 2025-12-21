import { useState } from "react";
import { useStrategy } from "../../context/useStrategy";
import {
  saveStrategy,
  loadStrategies,
  deleteStrategy,
} from "../../utils/strategyStorage";

export default function StrategyManager() {
  const { state, dispatch } = useStrategy();
  
  const [name, setName] = useState(state.strategy.name);

  const strategies = loadStrategies();

  return (
    <div className="flex gap-2 items-center mb-3">
      <input
        className="border px-2 py-1 text-sm"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Strategy name"
      />

      <button
        className="px-3 py-1 bg-black text-white text-sm"
        onClick={() => {
          saveStrategy({
            ...state,
            strategy: { ...state.strategy, name },
          });
        }}
      >
        Save
      </button>

      <select
        className="border px-2 py-1 text-sm"
        onChange={(e) => {
          const s = strategies.find(
            (st) => st.strategy.id === e.target.value
          );
          if (s) dispatch({ type: "LOAD_STRATEGY", payload: s });
        }}
      >
        <option>Load strategy</option>
        {strategies.map((s) => (
          <option key={s.strategy.id} value={s.strategy.id}>
            {s.strategy.name}
          </option>
        ))}
      </select>

      <button
        className="px-2 py-1 text-red-600 text-sm"
        onClick={() => deleteStrategy(state.strategy.id)}
      >
        Delete
      </button>
    </div>
  );
}
