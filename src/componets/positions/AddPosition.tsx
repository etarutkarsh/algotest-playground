import { useStrategy } from "../../context/useStrategy";
import type{ Position } from "../../types/trading";

export default function AddPosition() {
  const { dispatch } = useStrategy();

  const addPosition = () => {
    const position: Position = {
      id:crypto.randomUUID(),
      token: Math.floor(Math.random() * 100000),
      optionType: "CALL",
      side: "BUY",
      strike: 45000,
      expiry: "2024-09-26",
      lots: 1,
      price: 100,
      ltp: 100,
      enabled: true,
      underlying: "BANKNIFTY",
      lotSize: 35,
      entryPrice: 0,
      createdAt: Date.now()
    };

    dispatch({ type: "ADD_POSITION", payload: position });
  };

  return <button onClick={addPosition}>Add Position</button>;
}
