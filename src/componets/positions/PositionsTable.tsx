// @ts-nocheck
import { useStrategy } from "../../context/useStrategy";

export default function PositionsTable() {
  const { state, dispatch } = useStrategy() as any;

  if (state.strategy.positions.length === 0) {
    return (
      <div className="text-sm text-gray-500 mt-4">
        No positions added
      </div>
    );
  }

  return (
    <table className="w-full text-sm border mt-4">
      <thead className="bg-gray-100">
        <tr>
          <th>B/S</th>
          <th>Expiry</th>
          <th>Strike</th>
          <th>Type</th>
          <th>Unit</th>
          <th>Price</th>
          <th></th>
        </tr>
      </thead>

      <tbody>
        {state.strategy.positions.map((p: any) => (
          <tr
            key={p.id}
           className={`text-center border-t transition ${
  p.enabled ? "" : "opacity-40"
}`}
          >
            {/* Toggle + B/S */}
            <td className="flex gap-3 justify-center items-center p-2">
              {/* Toggle */}
              <button
                onClick={() =>
                  dispatch({
                    type: "TOGGLE_POSITION",
                    payload: p.id,
                  })
                }
                className={`w-8 h-4 flex items-center rounded-full p-[2px] transition ${
                  p.enabled ? "bg-blue-500" : "bg-gray-300"
                }`}
              >
                <span
                  className={`bg-white w-3 h-3 rounded-full shadow transform transition ${
                    p.enabled
                      ? "translate-x-4"
                      : "translate-x-0"
                  }`}
                />
              </button>

              {/* Buy / Sell */}
              <span
                className={`px-2 py-1 text-xs font-bold text-white rounded ${
                  p.side === "BUY"
                    ? "bg-green-600"
                    : "bg-red-600"
                }`}
              >
                {p.side === "BUY" ? "B" : "S"}
              </span>
            </td>

            {/* Expiry */}
            <td className="p-2">
              <select
                value={p.expiry}
                onChange={(e) =>
                  dispatch({
                    type: "UPDATE_POSITION",
                    payload: {
                      id: p.id,
                      expiry: e.target.value,
                    },
                  })
                }
                className="border rounded px-2 py-1 bg-white"
              >
                <option>14 Oct 25</option>
                <option>21 Oct 25</option>
                <option>28 Oct 25</option>
              </select>
            </td>

            {/* Strike */}
            <td className="p-2">
              <div className="flex items-center gap-2 border rounded px-2 py-1 bg-white justify-center">
                <button
                  onClick={() =>
                    dispatch({
                      type: "UPDATE_POSITION",
                      payload: {
                        id: p.id,
                        strike: p.strike - 50,
                      },
                    })
                  }
                >
                  −
                </button>

                <span className="min-w-[60px] text-center">
                  {p.strike}
                </span>

                <button
                  onClick={() =>
                    dispatch({
                      type: "UPDATE_POSITION",
                      payload: {
                        id: p.id,
                        strike: p.strike + 50,
                      },
                    })
                  }
                >
                  +
                </button>
              </div>
            </td>

            {/* Type */}
            <td className="p-2">
              <div className="border rounded px-2 py-1 bg-white font-medium">
                {p.optionType}
              </div>
            </td>

            {/* Unit */}
            <td className="p-2">
              <div className="flex items-center gap-2">
                <select
                  value={p.lots}
                  onChange={(e) =>
                    dispatch({
                      type: "UPDATE_POSITION",
                      payload: {
                        id: p.id,
                        lots: Number(e.target.value),
                      },
                    })
                  }
                  className="border rounded px-2 py-1 bg-white"
                >
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                </select>
                <span className="text-xs text-gray-500">
                  Lot
                </span>
              </div>
            </td>

            {/* Price */}
            <td className="p-2">
              <input
                type="number"
                value={p.price}
                readOnly
                className="border rounded px-2 py-1 w-20 bg-white"
              />
            </td>

            {/* Delete */}
            <td className="p-2">
              <button
                onClick={() =>
                  dispatch({
                    type: "REMOVE_POSITION",
                    payload: p.id,
                  })
                }
                className="text-gray-500 hover:text-red-600"
                title="Delete"
              >
                🗑️
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
