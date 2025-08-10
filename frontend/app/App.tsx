"use client";

import { ReactNode } from "react";
import { config, WagmiProvider, queryClient, QueryClientProvider, RainbowKitProvider } from "../lib/wagmi";

function App({ children }: { children: ReactNode }) {
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
