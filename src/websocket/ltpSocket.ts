import type { LtpUpdate, WebSocketMessage } from "../types/wsPayload";

let socket: WebSocket | null = null;

/**
 * Typed callback for LTP updates
 */
type OnMessage = (update: LtpUpdate) => void;

export function connectLtpSocket(onMessage: OnMessage) {
  if (socket) return; // prevent multiple connections

  socket = new WebSocket("wss://prices.algotest.xyz/ws");

  socket.onopen = () => {
    console.log("🔌 LTP socket connected");
  };

  socket.onmessage = (event: MessageEvent<string>) => {
    let data: WebSocketMessage;

    try {
      data = JSON.parse(event.data);
    } catch (err) {
      console.error("❌ Invalid WS payload", err);
      return;
    }

    // AlgoTest sends ARRAY of updates
    data.forEach((update) => {
      if (
        typeof update.token === "number" &&
        typeof update.ltp === "number"
      ) {
        onMessage({
          token: update.token,
          ltp: Number(update.ltp.toFixed(2)),
        });
      }
    });
  };

  socket.onerror = (err) => {
    console.error("❌ LTP socket error", err);
  };

  socket.onclose = () => {
    console.log("🔌 LTP socket disconnected");
    socket = null;
  };
}

export function subscribeTokens(tokens: number[]) {
  if (!socket || socket.readyState !== WebSocket.OPEN) return;

  socket.send(
    JSON.stringify({
      action: "subscribe",
      tokens,
    })
  );
}

export function unsubscribeTokens(tokens: number[]) {
  if (!socket || socket.readyState !== WebSocket.OPEN) return;

  socket.send(
    JSON.stringify({
      action: "unsubscribe",
      tokens,
    })
  );
}

export function disconnectLtpSocket() {
  if (!socket) return;

  socket.close();
  socket = null;
}
