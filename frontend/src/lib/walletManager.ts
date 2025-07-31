
// Extend global window for wallet compatibility
export {};

declare global {
  interface Window {
    ethereum?: any;
  }
}

// Define common interface for Ethereum and Polkadot
export interface InjectedExtension {
  signer: {
    signPayload: (payload: any) => Promise<any>;
  };
  accounts: {
    get: () => Promise<{ address: string }[]>;
  };
}

// Connect to wallet based on selected chain
export async function connectWallet(chain: string): Promise<string | null> {
  if (chain.toLowerCase() === "ethereum") {
    if (!window.ethereum) throw new Error("MetaMask not available");

    const accounts: string[] = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    return accounts[0] ?? null;
  }

  if (chain.toLowerCase() === "polkadot") {
    const { web3Enable, web3Accounts } = await import("@polkadot/extension-dapp");

    const extensions = await web3Enable("MyDappName");
    if (!extensions.length) throw new Error("Polkadot.js extension not available");

    const accounts = await web3Accounts();
    if (!accounts.length) throw new Error("No Polkadot accounts found");

    console.log('Address', accounts)
    return accounts[0].address;
  }

  return null;
}

// Sign a message based on the connected chain
export async function signMessage(chain: string, message: string): Promise<any> {
  if (chain.toLowerCase() === "ethereum") {
    const from = await connectWallet("ethereum");
    if (!from) throw new Error("Ethereum wallet not connected");

    return await window.ethereum.request({
      method: "personal_sign",
      params: [message, from],
    });
  }

  if (chain.toLowerCase() === "polkadot") {
    const { web3Enable, web3Accounts , web3FromSource} = await import("@polkadot/extension-dapp");

    const extensions = await web3Enable("YourApp");
    if (!extensions.length) throw new Error("Polkadot.js extension not available");

    const accounts = await web3Accounts();
    if (!accounts.length) throw new Error("No Polkadot accounts found");

    const injector = await web3FromSource(accounts[0].meta.source);

    return await injector.signer.signRaw!({
      address: accounts[0].address,
      data: message,
      type: "bytes",
    });
  }

  throw new Error(`Signing not supported for chain: ${chain}`);
}
