import React from "react";
import type { Position } from "../../types/trading";
import { useStrategy } from "../../context/useStrategy";
import Toggle from "../common/Toggle";

export  function PositionRow({ position }: { position: Position }) {
  const { dispatch } = useStrategy() as any;


  const isBuy = position.side === "BUY";

  return (
    <tr
      className={`border-b last:border-b-0 text-center transition ${
        position.enabled ? "hover:bg-gray-50" : "opacity-50 bg-gray-50"
      }`}
    >
      {/* B/S + Enable / Disable */}
      <td className="p-2 flex items-center justify-center gap-2">
        <Toggle
          checked={position.enabled}
          onChange={() =>
            dispatch({
              type: "TOGGLE_POSITION",
              payload: position.id,
            })
          }
        />

        <span
          className={`px-2 py-1 rounded text-xs font-semibold text-white ${
            isBuy ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {isBuy ? "B" : "S"}
        </span>
      </td>

      {/* Option Type */}
      <td className="p-2 font-medium">{position.optionType}</td>

      {/* Strike */}
      <td className="p-2">{position.strike}</td>

      {/* Lots */}
      <td className="p-2">{position.lots}</td>

      {/* Entry Price */}
      <td className="p-2">{position.price.toFixed(2)}</td>

      {/* LTP */}
      <td className="p-2 font-medium">{position.ltp.toFixed(2)}</td>

      {/* Delete */}
      <td className="p-2 text-right">
        <button
          onClick={() =>
            dispatch({
              type: "REMOVE_POSITION",
              payload: position.id,
            })
          }
          className="text-red-500 hover:text-red-700"
          title="Remove position"
        >
          ✕
        </button>
      </td>
    </tr>
  );
}

export default React.memo(PositionRow);
