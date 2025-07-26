# 🌌 BlockDAG Vision

A next-gen **explorer and analytics dashboard** for the **BlockDAG Primordial Testnet** — built for developers, analysts, and builders who want **Etherscan-like transparency**, **Dune-style data insights**, and **GPT-powered smart contract explainability** in one unified platform.



---

## 🧩 Key Features

| Module               | Description                                                                                      |
|---------------------|--------------------------------------------------------------------------------------------------|
| 🧠 **Smart AI Advisor**  | Explains contract logic in plain English. Flags scams and suggests safer alternatives.         |
| ⚡ **DAG Visualizer**    | Live, animated visualization of the BlockDAG topology. Built using `vis-network`.             |
| 📊 **Analytics Dashboard** | Real-time stats (Tx count, Gas fees, Throughput, Finality delay, etc.) with charting (Recharts).|
| 🔍 **Block/Tx Explorer** | Search by block hash, tx ID, or address with decoded data & status indicators.                |
| 🧾 **Smart Contract Hub** | Deploy & verify contracts. Auto-read ABI, show storage, call/write functions (via MetaMask).   |
| 👛 **Wallet Insights**   | Analyze any wallet’s behavior: Top contracts used, token transfers, value flows.               |
| 🧪 **Dev Suite**         | Hardhat + Solidity 0.8.x setup with test suite & verified contracts deployed on Primordial.    |

---

## 🛠️ Built With

- **Frontend:** React + TailwindCSS + Framer Motion  
- **Data Viz:** `vis-network`, `Recharts`, `D3`  
- **Contracts:** Solidity ^0.8.24, Hardhat, OpenZeppelin  
- **Web3 Stack:** `ethers.js`, MetaMask, BlockDAG RPC APIs  
- **Deployment:** Vercel (Frontend), Alchemy for RPC, GitHub Actions (CI/CD)

---

## 🔐 Smart Contracts

| Contract          | Status            |
|------------------|-------------------|
| `TransactionLens.sol` | ✅ Deployed to Primordial Testnet |
| `WalletAnalyzer.sol`  | ✅ Verified on Explorer           |
| `ContractExplainer.sol`| ✅ 95% Test Coverage via Hardhat |

- Secrets like RPC keys and private keys are secured via `.env`  
- All contracts follow **OpenZeppelin standards** and **Slither checks**



