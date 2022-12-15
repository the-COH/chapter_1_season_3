import { Chain, configureChains, createClient } from 'wagmi'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'

const cantoChain: Chain = {
  id: 7700,
  name: 'Canto',
  network: 'canto',
  nativeCurrency: {
    decimals: 18,
    name: 'Canto',
    symbol: 'CANTO',
  },
  rpcUrls: {
    default: 'https://canto.neobase.one',
  },
  blockExplorers: {
    default: { name: 'Canto Explorer', url: 'https://evm.explorer.canto.io/' },
  },
  testnet: false,
}

const { provider, webSocketProvider } = configureChains(
  [cantoChain],
  [
    jsonRpcProvider({
      rpc: (chain) => {
        if (chain.id !== cantoChain.id) return null
        return { http: chain.rpcUrls.default }
      },
      priority: 0,
    }),
  ],
)

export const client = createClient({
  autoConnect: true,
  provider,
  webSocketProvider,
})
