module.exports = {

"[project]/src/data/chains.json (json)": ((__turbopack_context__) => {

__turbopack_context__.v(JSON.parse("{\"Ethereum\":[\"ETH\",\"USDC\",\"DAI\",\"WETH\"],\"Polkadot\":[\"DOT\"],\"SUI\":[\"WAL\",\"USDC\",\"SUI\"]}"));}),
"[project]/src/api/chainApi.ts [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

// src/utils/chains.ts
__turbopack_context__.s({
    "chains": ()=>chains,
    "getTokensByChain": ()=>getTokensByChain
});
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$chains$2e$json__$28$json$29$__ = __turbopack_context__.i("[project]/src/data/chains.json (json)");
;
const chains = Object.keys(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$chains$2e$json__$28$json$29$__["default"]);
const getTokensByChain = (chain)=>{
    return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$chains$2e$json__$28$json$29$__["default"][chain] || [];
};
}),
"[project]/src/api/quoteApi.ts [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "fetchQuote": ()=>fetchQuote
});
const fetchQuote = (fromChain, fromToken, fromAmount, toChain, toToken)=>{
    // Placeholder logic — replace with your real API call or logic
    const amountNum = parseFloat(fromAmount);
    if (isNaN(amountNum) || amountNum <= 0) return "";
    // e.g. pretend the quote is 90% of input amount
    return (amountNum * 0.9).toFixed(6);
};
}),
"[project]/src/api/orderApi.ts [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "orderSwap": ()=>orderSwap
});
const orderSwap = async (fromChain, fromToken, fromAmount, toChain, toToken, signature)=>{
    // Call your blockchain or backend swap logic here
    console.log("Swapping", {
        fromChain,
        fromToken,
        fromAmount,
        toChain,
        toToken
    });
    return true; // Return success or failure
};
}),
"[externals]/node:util [external] (node:util, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("node:util", () => require("node:util"));

module.exports = mod;
}}),
"[externals]/node:crypto [external] (node:crypto, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("node:crypto", () => require("node:crypto"));

module.exports = mod;
}}),
"[project]/src/lib/walletManager.ts [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "connectWallet": ()=>connectWallet,
    "signMessage": ()=>signMessage
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$polkadot$2f$extension$2d$dapp$2f$bundle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@polkadot/extension-dapp/bundle.js [app-ssr] (ecmascript) <locals>");
;
async function connectWallet(chain) {
    if (chain.toLowerCase() === "ethereum") {
        if (!window.ethereum) throw new Error("MetaMask not available");
        const accounts = await window.ethereum.request({
            method: "eth_requestAccounts"
        });
        return accounts[0] ?? null;
    }
    if (chain.toLowerCase() === "polkadot") {
        const extensions = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$polkadot$2f$extension$2d$dapp$2f$bundle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["web3Enable"])("MyDappName");
        if (!extensions.length) throw new Error("Polkadot.js extension not available");
        const accounts = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$polkadot$2f$extension$2d$dapp$2f$bundle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["web3Accounts"])();
        // if (!accounts.length) throw new Error("No Polkadot accounts found");
        console.log('Address', accounts);
        return accounts[0].address;
    }
    return null;
}
async function signMessage(chain, message) {
    if (chain.toLowerCase() === "ethereum") {
        const from = await connectWallet("ethereum");
        if (!from) throw new Error("Ethereum wallet not connected");
        return await window.ethereum.request({
            method: "personal_sign",
            params: [
                message,
                from
            ]
        });
    }
    if (chain.toLowerCase() === "polkadot") {
        const extensions = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$polkadot$2f$extension$2d$dapp$2f$bundle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["web3Enable"])("YourApp");
        if (!extensions.length) throw new Error("Polkadot.js extension not available");
        const accounts = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$polkadot$2f$extension$2d$dapp$2f$bundle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["web3Accounts"])();
        if (!accounts.length) throw new Error("No Polkadot accounts found");
        const injector = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$polkadot$2f$extension$2d$dapp$2f$bundle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["web3FromSource"])(accounts[0].meta.source);
        return await injector.signer.signRaw({
            address: accounts[0].address,
            data: message,
            type: "bytes"
        });
    }
    throw new Error(`Signing not supported for chain: ${chain}`);
}
}),
"[project]/src/components/SwapWidget.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "default": ()=>SwapWidget
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$chainApi$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/api/chainApi.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$quoteApi$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/api/quoteApi.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$orderApi$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/api/orderApi.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$walletManager$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/walletManager.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
function SwapWidget() {
    const [sourceChain, setSourceChain] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$chainApi$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["chains"][0]);
    const [destChain, setDestChain] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$chainApi$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["chains"][1] || __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$chainApi$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["chains"][0]);
    const [sourceTokens, setSourceTokens] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$chainApi$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getTokensByChain"])(sourceChain));
    const [destTokens, setDestTokens] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$chainApi$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getTokensByChain"])(destChain));
    const [sourceToken, setSourceToken] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(sourceTokens[0]);
    const [destToken, setDestToken] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(destTokens[0]);
    const [sourceAmount, setSourceAmount] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [destAmount, setDestAmount] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [isSourceAmountActive, setIsSourceAmountActive] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const tokens = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$chainApi$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getTokensByChain"])(sourceChain);
        setSourceTokens(tokens);
        setSourceToken(tokens[0]);
    }, [
        sourceChain
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const tokens = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$chainApi$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getTokensByChain"])(destChain);
        setDestTokens(tokens);
        setDestToken(tokens[0]);
    }, [
        destChain
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (isSourceAmountActive) {
            const quote = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$quoteApi$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchQuote"])(sourceChain, sourceToken, sourceAmount, destChain, destToken);
            setDestAmount(quote);
        } else {
            const quote = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$quoteApi$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchQuote"])(destChain, destToken, destAmount, sourceChain, sourceToken);
            setSourceAmount(quote);
        }
    }, [
        sourceChain,
        sourceToken,
        sourceAmount,
        destChain,
        destToken,
        destAmount,
        isSourceAmountActive
    ]);
    const swapAll = ()=>{
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
    const handleSwap = async ()=>{
        const fromAddress = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$walletManager$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["connectWallet"])(sourceChain);
        if (!fromAddress) {
            alert("Failed to connect wallet.");
            return;
        } else {
            console.log(fromAddress);
        }
        // If you want to sign some message or payload (e.g., transaction details)
        const message = `Swap ${sourceAmount} ${sourceToken} from ${sourceChain} to ${destToken} on ${destChain}`;
        try {
            const signature = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$walletManager$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["signMessage"])(sourceChain, message);
            console.log("Signature:", signature);
            const success = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$orderApi$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["orderSwap"])(sourceChain, sourceToken, sourceAmount, destChain, destToken, signature);
            if (success) {
                alert("Swap successful!");
            } else {
                alert("Swap failed!");
            }
        } catch (error) {
            alert("Signing failed or rejected.");
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "max-w-[700px] mx-auto mt-5 bg-white rounded-2xl shadow-xl p-8 pt-20 font-sans",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex flex-col space-y-2",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "relative bg-gray-50 rounded-xl pt-6 p-3 shadow-inner border border-gray-200",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "absolute -top-3 rounded-md border border-gray-700 left-4 bg-gray-50 px-2 text-sm text-gray-700 font-medium",
                            children: "SOURCE"
                        }, void 0, false, {
                            fileName: "[project]/src/components/SwapWidget.tsx",
                            lineNumber: 105,
                            columnNumber: 7
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid grid-cols-[1fr_2fr] gap-4 items-center",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex flex-col space-y-0",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                            className: "h-10 p-0 rounded-t-md border border-gray-300 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500",
                                            value: sourceChain,
                                            onChange: (e)=>setSourceChain(e.target.value),
                                            children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$chainApi$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["chains"].map((chain)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: chain,
                                                    children: chain
                                                }, chain, false, {
                                                    fileName: "[project]/src/components/SwapWidget.tsx",
                                                    lineNumber: 116,
                                                    columnNumber: 19
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/SwapWidget.tsx",
                                            lineNumber: 110,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                            className: "h-10 p-0 rounded-b-md border border-gray-300 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500",
                                            value: sourceToken,
                                            onChange: (e)=>setSourceToken(e.target.value),
                                            children: sourceTokens.map((token)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: token,
                                                    children: token
                                                }, token, false, {
                                                    fileName: "[project]/src/components/SwapWidget.tsx",
                                                    lineNumber: 128,
                                                    columnNumber: 19
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/SwapWidget.tsx",
                                            lineNumber: 122,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/SwapWidget.tsx",
                                    lineNumber: 109,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "number",
                                    step: "any",
                                    min: "0",
                                    placeholder: "0.0",
                                    className: "h-[82px] w-full p-3 rounded-md border border-gray-300 bg-white text-right text-gray-900 text-xl focus:outline-none focus:ring-2 focus:ring-purple-500",
                                    value: sourceAmount,
                                    onChange: (e)=>{
                                        setIsSourceAmountActive(true);
                                        setSourceAmount(e.target.value);
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/src/components/SwapWidget.tsx",
                                    lineNumber: 136,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/SwapWidget.tsx",
                            lineNumber: 107,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/SwapWidget.tsx",
                    lineNumber: 104,
                    columnNumber: 5
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex justify-center",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: swapAll,
                        "aria-label": "Swap",
                        className: "bg-gray-200 hover:bg-gray-300 rounded-full p-2 shadow-md transition-transform hover:scale-110",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                            className: "w-8 h-8 text-gray-700",
                            fill: "none",
                            stroke: "currentColor",
                            strokeWidth: "2",
                            strokeLinecap: "round",
                            strokeLinejoin: "round",
                            viewBox: "0 0 24 24",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                    d: "M17 1l4 4-4 4"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/SwapWidget.tsx",
                                    lineNumber: 167,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                    d: "M21 5H7a4 4 0 0 0-4 4v7"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/SwapWidget.tsx",
                                    lineNumber: 168,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                    d: "M7 23l-4-4 4-4"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/SwapWidget.tsx",
                                    lineNumber: 169,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                    d: "M3 19h14a4 4 0 0 0 4-4v-7"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/SwapWidget.tsx",
                                    lineNumber: 170,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/SwapWidget.tsx",
                            lineNumber: 158,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/SwapWidget.tsx",
                        lineNumber: 153,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/SwapWidget.tsx",
                    lineNumber: 152,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "relative bg-gray-50 rounded-xl pt-6 p-3 shadow-inner border border-gray-200",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "absolute -top-3 rounded-md border border-gray-700 left-4 bg-gray-50 px-2 text-sm text-gray-700 font-medium",
                            children: "DESTINATION"
                        }, void 0, false, {
                            fileName: "[project]/src/components/SwapWidget.tsx",
                            lineNumber: 177,
                            columnNumber: 7
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid grid-cols-[1fr_2fr] gap-4 items-center",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex flex-col space-y-0",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                            className: "h-10 p-0 rounded-t-md border border-gray-300 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500",
                                            value: destChain,
                                            onChange: (e)=>setDestChain(e.target.value),
                                            children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$chainApi$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["chains"].map((chain)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: chain,
                                                    children: chain
                                                }, chain, false, {
                                                    fileName: "[project]/src/components/SwapWidget.tsx",
                                                    lineNumber: 188,
                                                    columnNumber: 19
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/SwapWidget.tsx",
                                            lineNumber: 182,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                            className: "h-10 p-0 rounded-b-md border border-gray-300 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500",
                                            value: destToken,
                                            onChange: (e)=>setDestToken(e.target.value),
                                            children: destTokens.map((token)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: token,
                                                    children: token
                                                }, token, false, {
                                                    fileName: "[project]/src/components/SwapWidget.tsx",
                                                    lineNumber: 200,
                                                    columnNumber: 19
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/SwapWidget.tsx",
                                            lineNumber: 194,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/SwapWidget.tsx",
                                    lineNumber: 181,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "number",
                                    step: "any",
                                    min: "0",
                                    placeholder: "0.0",
                                    className: "h-[82px] w-full p-3 rounded-md border border-gray-300 bg-white text-right text-gray-900 text-xl focus:outline-none focus:ring-2 focus:ring-purple-500",
                                    value: destAmount,
                                    onChange: (e)=>{
                                        setIsSourceAmountActive(false);
                                        setDestAmount(e.target.value);
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/src/components/SwapWidget.tsx",
                                    lineNumber: 208,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/SwapWidget.tsx",
                            lineNumber: 179,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/SwapWidget.tsx",
                    lineNumber: 176,
                    columnNumber: 5
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    className: "w-full rounded-xl bg-purple-600 py-4 text-lg font-semibold text-white hover:bg-purple-700 transition-colors",
                    onClick: handleSwap,
                    children: "Swap"
                }, void 0, false, {
                    fileName: "[project]/src/components/SwapWidget.tsx",
                    lineNumber: 224,
                    columnNumber: 8
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/SwapWidget.tsx",
            lineNumber: 102,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/SwapWidget.tsx",
        lineNumber: 100,
        columnNumber: 7
    }, this);
}
}),
"[project]/src/app/swap/page.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "default": ()=>SwapPage
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$SwapWidget$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/SwapWidget.tsx [app-ssr] (ecmascript)");
"use client";
;
;
function SwapPage() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-gray-50 flex items-center justify-center m-0 p-0",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$SwapWidget$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
            fileName: "[project]/src/app/swap/page.tsx",
            lineNumber: 8,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/swap/page.tsx",
        lineNumber: 7,
        columnNumber: 5
    }, this);
}
}),

};

//# sourceMappingURL=%5Broot-of-the-server%5D__b9cce13f._.js.map