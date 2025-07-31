"use client";

import React, { useEffect, useState } from "react";
import { chains, Chain, getTokensByChain } from "@/api/chainApi";
import { fetchQuote } from "@/api/quoteApi";
import { orderSwap } from "@/api/orderApi";
import { connectWallet, signMessage } from "@/lib/walletManager";


export default function SwapWidget() {
  const [sourceChain, setSourceChain] = useState<Chain>(chains[0]);
  const [destChain, setDestChain] = useState<Chain>(chains[1] || chains[0]);

  const [sourceTokens, setSourceTokens] = useState<string[]>(getTokensByChain(sourceChain));
  const [destTokens, setDestTokens] = useState<string[]>(getTokensByChain(destChain));

  const [sourceToken, setSourceToken] = useState<string>(sourceTokens[0]);
  const [destToken, setDestToken] = useState<string>(destTokens[0]);

  const [sourceAmount, setSourceAmount] = useState("");
  const [destAmount, setDestAmount] = useState("");

  const [isSourceAmountActive, setIsSourceAmountActive] = useState(true);

  useEffect(() => {
    const tokens = getTokensByChain(sourceChain);
    setSourceTokens(tokens);
    setSourceToken(tokens[0]);
  }, [sourceChain]);

  useEffect(() => {
    const tokens = getTokensByChain(destChain);
    setDestTokens(tokens);
    setDestToken(tokens[0]);
  }, [destChain]);

  useEffect(() => {
    if (isSourceAmountActive) {
      const quote = fetchQuote(sourceChain, sourceToken, sourceAmount, destChain, destToken);
      setDestAmount(quote);
    } else {
      const quote = fetchQuote(destChain, destToken, destAmount, sourceChain, sourceToken);
      setSourceAmount(quote);
    }
  }, [
    sourceChain,
    sourceToken,
    sourceAmount,
    destChain,
    destToken,
    destAmount,
    isSourceAmountActive,
  ]);

  const swapAll = () => {
    const tempChain = sourceChain;
    const tempToken = sourceToken;
    const tempAmount = sourceAmount;

    setSourceChain(destChain);
    setSourceToken(destToken);
    setSourceAmount(destAmount);

    setDestChain(tempChain);
    setDestToken(tempToken);
    setDestAmount(tempAmount);
  };

  // This is the only handler left inside for event binding
  // It simply calls the imported performSwap function
  const handleSwap = async () => {
      const fromAddress = await connectWallet(sourceChain);
      if (!fromAddress) {
        alert("Failed to connect wallet.");
        return;
      } else {
        console.log(fromAddress)
      }

      // If you want to sign some message or payload (e.g., transaction details)
      const message = `Swap ${sourceAmount} ${sourceToken} from ${sourceChain} to ${destToken} on ${destChain}`;

      try {
        const signature = await signMessage(sourceChain, message);
        console.log("Signature:", signature);

        const success = await orderSwap(sourceChain, sourceToken, sourceAmount, destChain, destToken, signature);
        if (success) {
          alert("Swap successful!");
        } else {
          alert("Swap failed!");
        }
      } catch (error) {
        alert("Signing failed or rejected.");
      }

  };

  return (
      <div className="max-w-[700px] mx-auto mt-5 bg-white rounded-2xl shadow-xl p-8 pt-20 font-sans">

      <div className="flex flex-col space-y-2">
        {/* Source Pallet */}
    <div className="relative bg-gray-50 rounded-xl pt-6 p-3 shadow-inner border border-gray-200">
      <span className="absolute -top-3 rounded-md border border-gray-700 left-4 bg-gray-50 px-2 text-sm text-gray-700 font-medium">SOURCE</span>

          <div className="grid grid-cols-[1fr_2fr] gap-4 items-center">
            {/* Left column: Chain and Token stacked */}
            <div className="flex flex-col space-y-0">
              <select
                className="h-10 p-0 rounded-t-md border border-gray-300 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={sourceChain}
                onChange={(e) => setSourceChain(e.target.value as Chain)}
              >
                {chains.map((chain) => (
                  <option key={chain} value={chain}>
                    {chain}
                  </option>
                ))}
              </select>

              <select
                className="h-10 p-0 rounded-b-md border border-gray-300 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={sourceToken}
                onChange={(e) => setSourceToken(e.target.value)}
              >
                {sourceTokens.map((token) => (
                  <option key={token} value={token}>
                    {token}
                  </option>
                ))}
              </select>
            </div>

            {/* Right column: Amount input matches combined height */}
            <input
              type="number"
              step="any"
              min="0"
              placeholder="0.0"
              className="h-[82px] w-full p-3 rounded-md border border-gray-300 bg-white text-right text-gray-900 text-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={sourceAmount}
              onChange={(e) => {
                setIsSourceAmountActive(true);
                setSourceAmount(e.target.value);
              }}
            />
          </div>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center">
          <button
            onClick={swapAll}
            aria-label="Swap"
            className="bg-gray-200 hover:bg-gray-300 rounded-full p-2 shadow-md transition-transform hover:scale-110"
          >
            <svg
              className="w-8 h-8 text-gray-700"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
            >
              <path d="M17 1l4 4-4 4" />
              <path d="M21 5H7a4 4 0 0 0-4 4v7" />
              <path d="M7 23l-4-4 4-4" />
              <path d="M3 19h14a4 4 0 0 0 4-4v-7" />
            </svg>
          </button>
        </div>

        {/* Destination Pallet */}
    <div className="relative bg-gray-50 rounded-xl pt-6 p-3 shadow-inner border border-gray-200">
      <span className="absolute -top-3 rounded-md border border-gray-700 left-4 bg-gray-50 px-2 text-sm text-gray-700 font-medium">DESTINATION</span>

          <div className="grid grid-cols-[1fr_2fr] gap-4 items-center">
            {/* Left column: Chain and Token stacked */}
            <div className="flex flex-col space-y-0">
              <select
                className="h-10 p-0 rounded-t-md border border-gray-300 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={destChain}
                onChange={(e) => setDestChain(e.target.value as Chain)}
              >
                {chains.map((chain) => (
                  <option key={chain} value={chain}>
                    {chain}
                  </option>
                ))}
              </select>

              <select
                className="h-10 p-0 rounded-b-md border border-gray-300 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={destToken}
                onChange={(e) => setDestToken(e.target.value)}
              >
                {destTokens.map((token) => (
                  <option key={token} value={token}>
                    {token}
                  </option>
                ))}
              </select>
            </div>

            {/* Right column: Amount input matches combined height */}
            <input
              type="number"
              step="any"
              min="0"
              placeholder="0.0"
              className="h-[82px] w-full p-3 rounded-md border border-gray-300 bg-white text-right text-gray-900 text-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={destAmount}
              onChange={(e) => {
                setIsSourceAmountActive(false);
                setDestAmount(e.target.value);
              }}
            />
          </div>
        </div>

        {/* Swap Action Button */}
       <button
        className="w-full rounded-xl bg-purple-600 py-4 text-lg font-semibold text-white hover:bg-purple-700 transition-colors"
        onClick={handleSwap}>
        Swap
      </button>
    </div>
    </div>
  );}
