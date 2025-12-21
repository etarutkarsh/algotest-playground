export type OptionSide = {
  token: number;
  ltp: number;
};

export type OptionStrike = {
  strike: number;
  call: OptionSide;
  put: OptionSide;
};

export type OptionChainResult = {
  expiry: string;
  rows: OptionStrike[];
};
