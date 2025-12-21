import type { OptionStrike } from "../types/optionChain";

export function transformOptionChain(
  optionsForExpiry: any
): OptionStrike[] {
  if (!optionsForExpiry || !Array.isArray(optionsForExpiry.strike)) {
    return [];
  }

  const {
    strike,
    call_close,
    put_close,
    call_token,
    put_token,
  } = optionsForExpiry;

  return strike.map((strikePrice: number, index: number) => ({
    strike: strikePrice,

    call: {
      ltp: call_close?.[index] ?? 0,
      token: call_token?.[index] ?? 0,
    },

    put: {
      ltp: put_close?.[index] ?? 0,
      token: put_token?.[index] ?? 0,
    },
  }));
}
