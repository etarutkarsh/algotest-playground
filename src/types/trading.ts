      // types/position.ts
      export type OptionType = "CALL" | "PUT";
      export type TradeSide = "BUY" | "SELL";

      export interface Position {
        id: string;
        token: number;

        underlying: "BANKNIFTY";
        expiry: string;
        strike: number;

        optionType: OptionType;
        side: TradeSide;
     // tradeType: TradeType;

        lots: number;
        lotSize: number;

        entryPrice: number;
        ltp: number;
          price: number; 

        enabled: boolean;
        createdAt: number;
      }
