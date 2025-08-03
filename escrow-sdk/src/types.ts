export enum Chains {
  POL = 0,
  DOT = 1,
}

export interface Order {
  maker: string;              // Ethereum address
  receiver: string;           // Ethereum address
  sourceToken: string;        // token address
  destinationToken: string;   // token address
  sourceTokenAmount: string;  // big number string
  destinationTokenAmount: string; // big number string
  sourceChain: Chains;
  destinationChain: Chains;
  allowPartialFill: boolean;
  hashlock: string;           // bytes32 hex string
  timelock: number;           // unix timestamp
}

export interface OrderComplement {
  orderId: string;           // bytes32 hex string
  taker: string;             // Ethereum address
  receiver: string;          // Ethereum address
  destinationToken: string;  // token address
  fillAmount: string;        // big number string
  timelock: number;          // unix timestamp
  hashlock: string;          // bytes32 hex string
  destinationChain: Chains;
}
