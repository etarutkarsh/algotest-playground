import type { Position } from "./trading";
import type { StrategyState } from "./strategy";

/* =========================
   WebSocket Data Types
========================= */

export interface LtpUpdate {
  token: number;
  ltp: number;
  close?: number;
  timestamp?: number;
}

export type WebSocketMessage = LtpUpdate[];

/* =========================
   Strategy Reducer Actions
========================= */

export type StrategyAction =
  | {
      type: "ADD_POSITION";
      payload: Position;
    }
  | {
      type: "REMOVE_POSITION";
      payload: string;
    }
  | {
      type: "TOGGLE_POSITION";
      payload: string;
    }
  | {
      type: "UPDATE_POSITION";
      payload: Position;
    }
  | {
      type: "UPDATE_LTP";
      payload: LtpUpdate;
    }
  | {
      type: "LOAD_STRATEGY";
      payload: StrategyState;
    }
  | {
      type: "RESET_STRATEGY";
    };
