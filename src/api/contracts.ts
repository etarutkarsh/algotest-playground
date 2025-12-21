export const fetchContracts = async () => {
  const res = await fetch(
    "https://prices.algotest.xyz/contracts?underlying=BANKNIFTY"
  );
  if (!res.ok) throw new Error("Failed to fetch contracts");
  return res.json();
};
