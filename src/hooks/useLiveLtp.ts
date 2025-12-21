import { useEffect, useRef } from "react";
import { useStrategy } from "../context/useStrategy";
import type { LtpUpdate } from "../types/websocket";
import {
  connectLtpSocket,
  subscribeTokens,
} from "../services/ltpSocket";

export function useLiveLtp() {
  const { state, dispatch } = useStrategy();
  const subscribedTokensRef = useRef<Set<number>>(new Set());

  // 1️⃣ CONNECT SOCKET ONCE
  useEffect(() => {
    connectLtpSocket((update: LtpUpdate) => {
      dispatch({
        type: "UPDATE_LTP",
        payload: update,
      });
    });
  }, [dispatch]);

  // 2️⃣ SUBSCRIBE WHEN TOKENS CHANGE
  useEffect(() => {
    if (!state.strategy) return;
    if (!state.strategy.positions.length) return;

    const expiry = state.strategy.positions[0].expiry;

    const tokens = state.strategy.positions
      .map((p) => p.token)
      .filter(Boolean);

    const newTokens = tokens.filter(
      (t) => !subscribedTokensRef.current.has(t)
    );

    if (!newTokens.length) return;

    newTokens.forEach((t) =>
      subscribedTokensRef.current.add(t)
    );

    subscribeTokens(newTokens, expiry);
  }, [state.strategy.positions]);
}
