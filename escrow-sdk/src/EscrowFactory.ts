import { ethers , Provider, JsonRpcProvider,Contract, Signer} from "ethers";
import { Order, OrderComplement } from "./types";
import { hashOrder, signOrder } from "./utils";
import { arrayify } from "ethers/lib/utils.js";

const escrowFactoryABI = [
  // Minimal ABI snippets; replace with your full ABI
  "function deploySourceEscrow(tuple(address maker, address receiver, address sourceToken, address destinationToken, uint256 sourceTokenAmount, uint256 destinationTokenAmount, uint8 sourceChain, uint8 destinationChain, bool allowPartialFill, bytes32 hashlock, uint256 timelock) order, bytes signature) payable returns (bool)",
  "function deployDestinationEscrow(tuple(bytes32 orderId, address taker, address receiver, address destinationToken, uint256 fillAmount, uint256 timelock, bytes32 hashlock, uint8 destinationChain) orderComplement) payable returns (bool)",
  "function withdrawSource(bytes32 orderId, bytes secret, uint256 escrowIndex) returns (bool)",
  "function withdrawDestination(bytes32 orderId, bytes secret, uint256 escrowIndex) returns (bool)",
];

export class EscrowFactorySDK {
  provider: Provider;           // Use the general Provider interface
  signer: Signer;
  contract: Contract;

  constructor(contractAddress: string, signer: Signer) {
    if (!signer.provider) {
      throw new Error("Signer must be connected to a provider");
    }
    this.provider = signer.provider;  // No forced cast, keep it as Provider
    this.signer = signer;
    this.contract = new Contract(contractAddress, escrowFactoryABI, signer);
  }


  async createOrder(order: Order): Promise<{ orderHash: string; signature: string }> {
    const orderHash = hashOrder(order);
    const signature = await signOrder(orderHash, this.signer);
    return { orderHash, signature };
  }

  async deploySourceEscrow(order: Order, signature: string, value?: ethers.BigNumberish) {
    const tx = await this.contract.deploySourceEscrow(order, signature, { value });
    return tx.wait();
  }

  async deployDestinationEscrow(orderComplement: OrderComplement, value?: ethers.BigNumberish) {
    const tx = await this.contract.deployDestinationEscrow(orderComplement, { value });
    return tx.wait();
  }

  async withdrawSource(orderId: string, secret: string, escrowIndex: number) {
    const secretBytes = arrayify(secret);
    const tx = await this.contract.withdrawSource(orderId, secretBytes, escrowIndex);
    return tx.wait();
  }

  async withdrawDestination(orderId: string, secret: string, escrowIndex: number) {
    const secretBytes = arrayify(secret);
    const tx = await this.contract.withdrawDestination(orderId, secretBytes, escrowIndex);
    return tx.wait();
  }
}
