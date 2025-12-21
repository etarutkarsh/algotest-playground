export interface LtpUpdate {
  token: number;
  ltp: number;
}

/**
 * AlgoTest sends an array of LTP updates
 */
export type WebSocketMessage = LtpUpdate[];
