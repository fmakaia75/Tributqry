# 🚀 Tributqry

> Born from a typo, built for DAOs

A decentralized invoice management system that streamlines contractor payments for Web3 organizations. Say goodbye to manual multi-sig coordination and hello to automated, transparent invoice workflows.

## ✨ Features

- **🎯 Smart Invoice Creation** - Create invoices with automatic ID generation and on-chain storage
- **💰 USDC Payment Integration** - Complete approve + pay workflow with MockUSDC for testing
- **🔄 Real-time UI Updates** - Event-driven dashboard that refreshes automatically
- **🏛️ DAO Treasury Ready** - Designed for treasury managers and organizational workflows  
- **🛡️ Secure & Tested** - Comprehensive test coverage and security validations
- **⚡ Modern Web3 UX** - Built with Next.js, Wagmi, and RainbowKit for seamless wallet integration

## 🎯 Problem Solved

DAOs currently waste **weeks** on simple contractor payments:
- Manual Discord/email coordination for invoices
- Complex multi-sig transaction creation
- No structured invoice tracking system
- Accounting nightmares with crypto transactions
- Hours of manual reconciliation

**Tributqry automates this entire workflow in minutes.**

## 🛠️ Tech Stack

**Smart Contracts:**
- Solidity ^0.8.28
- Hardhat development environment  
- OpenZeppelin contracts for security
- Comprehensive test coverage with edge cases
- MockUSDC for development testing

**Frontend:**
- Next.js 14 with TypeScript
- Wagmi + Viem for Web3 integration
- RainbowKit for wallet connectivity
- Tailwind CSS for modern styling
- Real-time event listening

**Infrastructure:**
- Local Hardhat network (development)
- Event-driven architecture

## 📊 Usage

### For Contractors
1. **Connect Wallet** - Use MetaMask on Hardhat Local network
2. **Create Invoice** - Enter client address and amount in USDC  
3. **Get Invoice ID** - System generates unique invoice identifier
4. **Share with Client** - Send invoice ID for payment
5. **Receive Payment** - Automatic when client approves and pays

### For Clients (DAO Treasury Managers)
1. **Connect Wallet** - Authorized treasury manager wallet
2. **View Invoices** - See all pending invoices to pay
3. **Review Details** - Check contractor, amount, and terms
4. **Approve USDC** - First transaction: approve spending
5. **Pay Invoice** - Second transaction: execute payment
6. **Confirmation** - Real-time UI update on success

## 🧪 Testing

```bash
# Run comprehensive smart contract tests
npx hardhat test

# Test coverage includes:
# - Invoice creation validation
# - Payment workflow
# - Edge cases and security
# - Event emission verification