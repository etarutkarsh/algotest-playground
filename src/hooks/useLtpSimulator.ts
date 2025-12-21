import { connectLtpSocket, subscribeTokens } from "../websocket/ltpSocket";
import { useStrategy } from "../context/useStrategy";
import { useEffect } from "react";

export function useLtpSimulator() {
  const { state, dispatch } = useStrategy();

  useEffect(() => {
    if (!state.strategy) return;

    connectLtpSocket((update) => {
      dispatch({
        type: "UPDATE_LTP",
        payload: update,
      });
    });

    const tokens = state.strategy.positions.map((p) => p.token);
    subscribeTokens(tokens);
  }, [state.strategy?.id, dispatch]);
}
