import { useEffect, useState, useRef, useMemo } from "react";
import { fetchOptionChain } from "../../api/optionChain";
import { useStrategy } from "../../context/useStrategy";
import ExpiryBar from "./ExpiryBar";
import type { OptionStrike } from "../../types/optionChain";
import type { TradeSide, OptionType } from "../../types/trading";

const EXPIRY_MAP: Record<string, string> = {
  "16 DEC": "2025-12-16",
  "23 DEC": "2025-12-23",
  "30 DEC": "2025-12-30",
  "06 JAN": "2026-01-27",
};

type OptionRow = OptionStrike & {
  expiry: string;
};

export default function OptionChain() {
  const [rows, setRows] = useState<OptionRow[]>([]);
  const rowsRef = useRef<OptionRow[]>([]);
  const [expiry, setExpiry] = useState("30 DEC");

  const [showOrderCard, setShowOrderCard] = useState(false);
  const [orderData, setOrderData] = useState<{
    row: OptionRow;
    optionType: OptionType;
    side: TradeSide;
  } | null>(null);

  const [lots, setLots] = useState(1);
  const [price, setPrice] = useState("");

  const { dispatch } = useStrategy();

  /* ---------------- Fetch Option Chain ---------------- */
  useEffect(() => {
    async function load() {
      const apiExpiry = EXPIRY_MAP[expiry];
      if (!apiExpiry) {
        setRows([]);
        return;
      }

      const result = await fetchOptionChain(apiExpiry);
      const formatted = result.rows.map((r) => ({
        ...r,
        expiry,
      }));

      setRows(formatted);
      rowsRef.current = formatted;
    }

    load();
  }, [expiry]);

  /* ---------------- Live LTP Updates ---------------- */
  useEffect(() => {
    const handler = (e: CustomEvent<{ token: number; ltp: number }>) => {
      const { token, ltp } = e.detail;

      const updated = rowsRef.current.map((row) => {
        if (row.call.token === token) {
          return { ...row, call: { ...row.call, ltp } };
        }
        if (row.put.token === token) {
          return { ...row, put: { ...row.put, ltp } };
        }
        return row;
      });

      rowsRef.current = updated;
      setRows(updated);
    };

    window.addEventListener("ltp-update", handler as EventListener);
    return () =>
      window.removeEventListener("ltp-update", handler as EventListener);
  }, []);

  /* ---------------- Order Handling ---------------- */
  const openOrderCard = (
    row: OptionRow,
    optionType: OptionType,
    side: TradeSide
  ) => {
    setOrderData({ row, optionType, side });
    setLots(1);
    setPrice("");
    setShowOrderCard(true);
  };

  const confirmOrder = () => {
    if (!orderData) return;

    const { row, optionType, side } = orderData;
    const sideData = optionType === "CALL" ? row.call : row.put;
    const entry = price ? Number(price) : sideData.ltp;

    dispatch({
      type: "ADD_POSITION",
      payload: {
        id: crypto.randomUUID(),
        token: sideData.token,

        underlying: "BANKNIFTY",
        expiry: row.expiry,
        strike: row.strike,

        optionType,
        side,

        lots,
        lotSize: 35,

        entryPrice: entry,
        price: entry,
        ltp: sideData.ltp,

        enabled: true,
        createdAt: Date.now(),
      },
    });

    setShowOrderCard(false);
  };

  /* ---------------- Render Rows ---------------- */
  const renderedRows = useMemo(
    () =>
      rows.map((row) => (
        <tr key={row.strike} className="border-t">
          <td className="relative group px-3 py-2">
            <span className="font-mono">{row.call.ltp}</span>
            <HoverButtons
              onBuy={() => openOrderCard(row, "CALL", "BUY")}
              onSell={() => openOrderCard(row, "CALL", "SELL")}
            />
          </td>

          <td className="p-2 text-center font-semibold bg-gray-50">
            {row.strike}
          </td>

          <td className="relative group px-3 py-2 text-right">
            <span className="font-mono">{row.put.ltp}</span>
            <HoverButtons
              onBuy={() => openOrderCard(row, "PUT", "BUY")}
              onSell={() => openOrderCard(row, "PUT", "SELL")}
            />
          </td>
        </tr>
      )),
    [rows]
  );

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="p-3 border-b">
        <h3 className="font-semibold mb-2">Option Chain (BANKNIFTY)</h3>
        <ExpiryBar
          expiries={Object.keys(EXPIRY_MAP)}
          active={expiry}
          onChange={setExpiry}
        />
      </div>

      <div className="flex-1 overflow-y-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 sticky top-0">
            <tr>
              <th className="p-2 text-left">CALL</th>
              <th className="p-2 text-center">Strike</th>
              <th className="p-2 text-right">PUT</th>
            </tr>
          </thead>
          <tbody>{renderedRows}</tbody>
        </table>
      </div>

      {showOrderCard && orderData && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-[340px] p-4 relative">
            <button
              className="absolute top-2 right-2"
              onClick={() => setShowOrderCard(false)}
            >
              ✕
            </button>

            <div className="flex items-center gap-3 mb-3">
              <span
                className={`px-3 py-1 rounded text-white ${
                  orderData.side === "BUY"
                    ? "bg-green-600"
                    : "bg-red-600"
                }`}
              >
                {orderData.side}
              </span>

              <select
                value={lots}
                onChange={(e) => setLots(Number(e.target.value))}
                className="border px-2 py-1"
              >
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
              </select>
            </div>

            <input
              className="w-full border px-3 py-2 mb-4"
              placeholder="Enter Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />

            <button
              className="w-full bg-blue-600 text-white py-2 rounded"
              onClick={confirmOrder}
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------- UI Helper ---------------- */
function HoverButtons({
  onBuy,
  onSell,
}: {
  onBuy: () => void;
  onSell: () => void;
}) {
  return (
    <div className="absolute inset-y-0 right-1 flex items-center gap-1 opacity-0 group-hover:opacity-100">
      <button className="bg-green-500 text-white px-2 text-xs" onClick={onBuy}>
        B
      </button>
      <button className="bg-red-500 text-white px-2 text-xs" onClick={onSell}>
        S
      </button>
    </div>
  );
}
