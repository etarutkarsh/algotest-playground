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

- Built using React.js  with TypeScript
- Real-time market updates are handled using *WebSockets*.
- Static assumptions:
  - Underlying: BANKNIFTY
  - Lot Size: 35 ( as mentioned in PDF ) 
  - Margin per lot (Sell): ₹2.5 Lakhs ( as mentioned in PDF ) 
- VPN is required to access Algotest WebSocket APIs.

## <a name="Designs"></a>Design(s)

- Reference UI: https://algotest.in/feature/strategy-builder  
  (Option Chain → Hover on strikes → Buy/Sell)
- Component-driven architecture:
  - Option Chain
  - Positions Table
  - Strategy Playground
  - Live Stats Panel
- State management handled via React hooks (useState, useEffect)  
  (Redux optional if scaling is required)

## <a name="Usage"></a>Usage

### start application locally

Prerequisites:
- Node.js 
- VPN access for Algotest APIs
- npm / yarn

Commands-> 
npm install
npm run dev