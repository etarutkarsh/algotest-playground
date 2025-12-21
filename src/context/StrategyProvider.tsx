import React, { useReducer } from "react";
import { StrategyContext } from "./StrategyContext";
import type { StrategyState } from "../types/strategy";
import type { StrategyAction } from "../types/websocket";
import { StrategyEffects } from "./StrategyEffects";

const initialState: StrategyState = {
  strategy: {
    id: "default",
    name: "Demo Strategy",
    positions: [],
  },
};

function strategyReducer(
  state: StrategyState,
  action: StrategyAction
): StrategyState {
  if (!state.strategy) return state;

  switch (action.type) {
    case "ADD_POSITION":
      return {
        ...state,
        strategy: {
          ...state.strategy,
          positions: [...state.strategy.positions, action.payload],
        },
      };

    case "REMOVE_POSITION":
      return {
        ...state,
        strategy: {
          ...state.strategy,
          positions: state.strategy.positions.filter(
            (p) => p.id !== action.payload
          ),
        },
      };

    case "TOGGLE_POSITION":
      return {
        ...state,
        strategy: {
          ...state.strategy,
          positions: state.strategy.positions.map((p) =>
            p.id === action.payload
              ? { ...p, enabled: !p.enabled }
              : p
          ),
        },
      };

    case "UPDATE_POSITION":
      return {
        ...state,
        strategy: {
          ...state.strategy,
          positions: state.strategy.positions.map((p) =>
            p.id === action.payload.id
              ? { ...p, ...action.payload }
              : p
          ),
        },
      };

    case "UPDATE_LTP":
      return {
        ...state,
        strategy: {
          ...state.strategy,
          positions: state.strategy.positions.map((p) =>
            p.token === action.payload.token
              ? { ...p, ltp: action.payload.ltp }
              : p
          ),
        },
      };
      case "LOAD_STRATEGY":
  return action.payload;

case "RESET_STRATEGY":
  return initialState;


    default:
      return state;
  }
}

export function StrategyProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, dispatch] = useReducer(strategyReducer, initialState);

  return (
    <StrategyContext.Provider value={{ state, dispatch }}>
      <StrategyEffects />
      {children}
    </StrategyContext.Provider>
  );
}
