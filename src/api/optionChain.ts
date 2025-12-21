import { transformOptionChain } from "../utils/transformOptionChain";
import type { OptionChainResult } from "../types/optionChain";

export async function fetchOptionChain(
  expiry: string
): Promise<OptionChainResult> {
  const res = await fetch(
    "https://prices.algotest.xyz/option-chain-with-ltp?underlying=BANKNIFTY"
  );

  if (!res.ok) {
    throw new Error("Failed to fetch option chain");
  }

  const data = await res.json();

  const optionsForExpiry = data.options?.[expiry];

  return {
    expiry,
    rows: transformOptionChain(optionsForExpiry),
  };
}
