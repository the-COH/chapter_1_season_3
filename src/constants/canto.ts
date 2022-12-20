import { Chain } from 'wagmi'

interface Icon {
  iconUrl: string
}

export const canto: Chain & Icon = {
  id: 7700,
  name: 'Canto',
  network: 'canto',
  nativeCurrency: {
    decimals: 18,
    name: 'Canto',
    symbol: 'CANTO',
  },
  rpcUrls: {
    default: { http: ['https://canto.slingshot.finance'] },
  },
  blockExplorers: {
    default: { name: 'Canto EVM Explorer (Blockscout)', url: 'https://evm.explorer.canto.io/' },
  },
  testnet: false,
  iconUrl: '/chains/canto.svg',
}
