
import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultConfig,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import {
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";
import { Chain } from 'wagmi/chains';
import { http } from 'wagmi';
const hardhatLocal: Chain = {
  id: 1337, // Correspond à ton hardhat.config.ts
  name: 'Hardhat Local',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: { 
      http: ['http://127.0.0.1:8545'] 
    },
    public: { 
      http: ['http://127.0.0.1:8545'] 
    },
  },
  testnet: true,
};

const config = getDefaultConfig({
  appName: 'Tributqry',
  projectId: 'dummy', 
  chains: [hardhatLocal],
  transports: {
    [hardhatLocal.id]: http('http://127.0.0.1:8545'),
  },
});
const queryClient = new QueryClient();
export { config, WagmiProvider, RainbowKitProvider, QueryClientProvider, queryClient}
