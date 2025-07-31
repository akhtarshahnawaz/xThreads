import { Chain } from "./chainApi";

export const fetchQuote = (
  fromChain: Chain,
  fromToken: string,
  fromAmount: string,
  toChain: Chain,
  toToken: string
): string => {
  // Placeholder logic — replace with your real API call or logic
  const amountNum = parseFloat(fromAmount);
  if (isNaN(amountNum) || amountNum <= 0) return "";
  // e.g. pretend the quote is 90% of input amount
  return (amountNum * 0.9).toFixed(6);
};
