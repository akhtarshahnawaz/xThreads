import { ethers , keccak256, AbiCoder} from "ethers";
import { Order } from "./types";
import { arrayify } from "ethers/lib/utils.js";

export function hashOrder(order: Order): string {
  const abiCoder = new AbiCoder();
  const encoded = abiCoder.encode(
    [ // typesArray
      "address",  // maker
      "address",  // receiver
      "address",  // sourceToken
      "address",  // destinationToken
      "uint256",  // sourceTokenAmount
      "uint256",  // destinationTokenAmount
      "uint8",    // sourceChain
      "uint8",    // destinationChain
      "bool",     // allowPartialFill
      "bytes32",  // hashlock
      "uint256"   // timelock
    ],
    [ // valuesArray
      order.maker,
      order.receiver,
      order.sourceToken,
      order.destinationToken,
      BigInt(order.sourceTokenAmount),
      BigInt(order.destinationTokenAmount),
      order.sourceChain,
      order.destinationChain,
      order.allowPartialFill,
      order.hashlock,
      order.timelock,
    ]
  );
  return keccak256(encoded);
}

export async function signOrder(orderHash: string, signer: ethers.Signer): Promise<string> {
  return await signer.signMessage(arrayify(orderHash));
}
