# Positions Playground Service (positions-playground)

The Positions Playground Service is responsible for providing a real time trading playground
for BANKNIFTY options. It allows users to create, update, enable/disable, and delete positions
and strategies, while displaying live PnL and statistics using real time market data via
WebSocket connections.

[Notes](#Notes)

[Designs](#Designs)

[Usage](#Usage)

[Release Notes](#ReleaseNotes)

[Benchmarks Or Perf Test Results](#Benches)

[Trouble Shooting](#TroubleShooting)

[FAQ](#FAQ)

## <a name="Notes"></a>Notes

-Built using React.js with TypeScript (mandatory)

-Uses Vite for fast development builds

-Real-time market updates are handled using WebSockets

-REST APIs are used for initial contracts and option-chain data

-Styling implemented using Tailwind CSS

-Static assumptions:

  -Underlying: BANKNIFTY

  -Lot Size: 35 (as mentioned in PDF)

  -Margin per lot (SELL): ₹2.5 Lakhs (as mentioned in PDF)

  -Buy positions are assumed to require no margin

-VPN is required to access Algotest WebSocket APIs

## <a name="Designs"></a>Design(s)

-Reference UI: https://algotest.in/feature/strategy-builder
(Option Chain → Hover on strikes → Buy/Sell)

-Component-Driven Architecture
  -Option Chain (expiry & strikes)
  -Positions Playground (CRUD positions)
  -Strategy Manager (save/load/update strategies)
  -Live Stats Panel (PnL, margin, performance)

-Architecture Overview

The application is structured into clear functional layers to ensure predictable real-time behavior and performance.

-Data & Market Layer
  -REST APIs load:
    -Valid contracts (/contracts)
    -Option chain with strikes and expiries
-A token → contract lookup map is created once and reused for all live updates

-Real-Time Layer
  -A single WebSocket connection streams live LTP updates
  -Incoming updates contain token, ltp/price, and timestamp
  -Token-based resolution ensures O(1) mapping to positions
  -Only affected positions are updated

-State & UI Layer

  -Positions act as the single source of truth
  -A strategy is a collection of positions
  -Stats (PnL, margin, profit %) are derived, not stored
  -Disabled positions are excluded from all calculations
State management is handled using React hooks (useState, useEffect, useMemo, useRef).
Redux is intentionally avoided for simplicity but can be introduced if scaling is required.

-Real-Time Data Flow (WebSocket)
  -Fetch contracts API and build a token-to-contract lookup map
  -Connect to WebSocket:
    wss://prices.algotest.xyz/mock/updates
  -Send subscription payload for BANKNIFTY + selected expiry
  -Receive updates containing:
    -token
    -ltp / price
    -timestamp
  -Resolve token → contract → position
  -Update only the matching position’s LTP
  -Recompute stats using memoized selectors
  This design prevents full table re-renders during high-frequency market ticks.

-PnL & Margin Logic

  -Quantity

    quantity = lots × lotSize


  -Unrealised PnL

    -BUY position
      (LTP - Entry Price) × Quantity

  -SELL position
    -(Entry Price - LTP) × Quantity

  -Margin Calculation
   -BUY → 0
  -SELL → lots × ₹2.5L

-Day Maximum Profit / Loss
  -Updated on every PnL recalculation
  -Timestamp stored when a new high or low is reached

-Profit Percentage
  -(pnl / margin) × 100

-Strategy Management (CRUD)
  -A strategy is defined as a collection of positions in the playground
  -Users can:
    -Create and save a strategy
    -Load a saved strategy
    -Update or delete a strategy
  -Loading a strategy replaces the current playground state
  -Strategy persistence is decoupled from live WebSocket updates

-Component Tree (Actual Repo Structure)
App.tsx
 ├── api
 │    ├── contracts.ts
 │    └── optionChain.ts
 ├── components
 │    ├── OptionChain
 │    │    ├── ExpiryBar.tsx
 │    │    └── OptionChain.tsx
 │    ├── common
 │    │    └── Toggle.tsx
 │    ├── positions
 │    │    ├── AddPosition.tsx
 │    │    ├── PositionRow.tsx
 │    │    └── PositionsTable.tsx
 │    ├── stats
 │    │    ├── PayoffPanel.tsx
 │    │    └── StatsPanel.tsx
 │    ├── strategy
 │    │    ├── StrategyActions.tsx
 │    │    └── StrategyTabs.tsx
 ├── context
 │    ├── StrategyContext.tsx
 │    ├── StrategyEffects.tsx
 │    ├── StrategyProvider.tsx
 │    ├── selectors.ts
 │    └── useStrategy.ts
 ├── hooks
 │    ├── useLiveLtp.ts
 │    ├── useLtpSimulator.ts
 │    └── useStats.ts
 ├── services
 │    └── ltpSocket.ts
 ├── utils
 │    ├── payoff.ts
 │    ├── strategyStorage.ts
 │    └── transformOptionChain.ts
 ├── types
 │    ├── optionChain.ts
 │    ├── strategy.ts
 │    ├── trading.ts
 │    ├── websocket.ts
 │    └── wsPayload.ts
 └── main.tsx

## <a name="Usage"></a>Usage

### start application locally

Prerequisites:
- Node.js>=18
- VPN access for Algotest APIs(required for Algotest WebSocket)
- npm / yarn

Commands-> 
npm install
npm run dev

Open:
http://localhost:5173


<a name="ReleaseNotes"></a>Release Notes

-Initial release implementing real-time positions playground with live    stats  and strategy CRUD

<a name="Benches"></a>Benchmarks Or Perf Test Results

-Single WebSocket connection shared across the app
-Token-based lookup for O(1) updates
-Memoized PnL and stats calculations
-No duplicated derived state
-WebSocket cleanup on unmount to avoid memory leaks

<a name="TroubleShooting"></a>Trouble Shooting

-WebSocket not connecting:
-Ensure VPN is enabled
-No live price updates:
-Verify expiry subscription payload
-Check token mapping from contracts API