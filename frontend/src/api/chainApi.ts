// src/utils/chains.ts
import chainTokenMap from "@/data/chains.json";

export type Chain = keyof typeof chainTokenMap;

export const chains: Chain[] = Object.keys(chainTokenMap) as Chain[];

export const getTokensByChain = (chain: Chain): string[] => {
  return chainTokenMap[chain] || [];
};

