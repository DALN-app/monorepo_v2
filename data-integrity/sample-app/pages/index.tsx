import {WagmiConfig, createConfig, mainnet } from 'wagmi';
import { createPublicClient, http } from 'viem';
import dynamic from 'next/dynamic';

const config = createConfig({
    autoConnect: true,
    publicClient: createPublicClient({
        chain: mainnet,
        transport: http()
    }),
})

export default function Index() {
    const Home = dynamic(() =>
        import('./home'), {
        ssr: false,
    });

    return (
        <WagmiConfig config={config}>
            <Home />
        </WagmiConfig>
  )
}
