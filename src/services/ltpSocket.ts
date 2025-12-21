let socket: WebSocket | null = null;
let isConnecting = false;

type LtpUpdate = {
  token: number;
  ltp: number;
};

let messageQueue: any[] = [];

export function connectLtpSocket(
  onMessage: (data: LtpUpdate) => void
) {
  if (socket || isConnecting) return;

  isConnecting = true;

  socket = new WebSocket("wss://prices.algotest.xyz/mock/updates");

  socket.onopen = () => {
    console.log("🔌 LTP socket connected");
    isConnecting = false;

    // Flush queued messages
    messageQueue.forEach((msg) =>
      socket?.send(JSON.stringify(msg))
    );
    messageQueue = [];
  };

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    const updates = Array.isArray(data) ? data : [data];

    updates.forEach((u) => {
      if (!u?.token || u.ltp == null) return;

      onMessage({ token: u.token, ltp: u.ltp });

      window.dispatchEvent(
        new CustomEvent("ltp-update", {
          detail: { token: u.token, ltp: u.ltp },
        })
      );
    });
  };

  socket.onerror = (err) => {
    console.error("❌ LTP socket error", err);
  };

  socket.onclose = () => {
    console.warn("🔌 LTP socket disconnected");
    socket = null;
    isConnecting = false;
  };
}
export function subscribeTokens(tokens: number[], expiry: string) {
  const message = {
    msg: {
      type: "subscribe",
      datatypes: ["ltp"],
      underlyings: [
        {
          underlying: "BANKNIFTY",
          cash: true,
          options: [expiry],
        },
      ],
      tokens,
    },
  };

  if (!socket || socket.readyState !== WebSocket.OPEN) {
    // Queue message until socket is ready
    messageQueue.push(message);
    return;
  }

  socket.send(JSON.stringify(message));
}
