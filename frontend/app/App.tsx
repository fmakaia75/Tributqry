"use client";

import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultConfig,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  base,
} from 'wagmi/chains';
import {
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";

import { localhost } from 'wagmi/chains'

const config = getDefaultConfig({
  appName: 'Tributqry',
  projectId: 'dummy', 
  chains: [localhost],
});
const queryClient = new QueryClient();

function App({children}:{children: ReactNode}){
                return (
                                <WagmiProvider config={config}>
                                <QueryClientProvider client={queryClient}>
                                <RainbowKitProvider>
                                {children}
                                </RainbowKitProvider>
                                </QueryClientProvider>
                                </WagmiProvider>
                );
        }

export default App;
