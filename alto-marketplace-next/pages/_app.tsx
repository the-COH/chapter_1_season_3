import type { AppProps } from "next/app"
import { Analytics } from "@vercel/analytics/react"
import { NETWORK_RPC_URL } from "../utils/env-vars"

import { Chain, configureChains, createClient, WagmiConfig } from "wagmi"
import { publicProvider } from "wagmi/providers/public"
import { jsonRpcProvider } from "wagmi/providers/jsonRpc"

import { SWRConfig } from "swr"
import axios from "axios"

import { ContractProvider, JazzModeProvider } from "../providers"

import { darkTheme as rkDarkTheme, getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit"
import '@rainbow-me/rainbowkit/styles.css'

import { ThemeProvider } from "styled-components"
import { GlobalStyle } from "../styles/GlobalStyle"
import { darkTheme } from "../styles/theme"
import localFont from "@next/font/local"

import NextNProgress from 'nextjs-progressbar'

import { Header } from "../compositions/Header"
import { Footer } from "../compositions/Footer"
import { PageWrapper } from "../components/PageWrapper"
import { TVStaticNoise } from "../components/TVStaticNoise"

const cantoChain: Chain = {
  id: 7_700,
  name: "Canto",
  network: "canto",
  nativeCurrency: {
    decimals: 18,
    name: "Canto",
    symbol: "CANTO",
  },
  rpcUrls: {
    default: NETWORK_RPC_URL,
  },
  blockExplorers: {
    default: { name: "Canto Explorer", url: "https://evm.explorer.canto.io" },
  },
  testnet: false,
}

const { chains, provider } = configureChains(
  [ cantoChain ],
  [
    publicProvider(),
    jsonRpcProvider({
      rpc: (chain) => {
        if (chain.id !== cantoChain.id) return null
        return { http: chain.rpcUrls.default }
      },
    }),
  ]
)

const { connectors } = getDefaultWallets({
  appName: "Alto Market",
  chains,
})

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
})

const DMSans = localFont({
  src: [
    { path: "../public/fonts/DMSans-Regular.ttf", weight: "300" },
    { path: "../public/fonts/DMSans-Medium.ttf", weight: "400" },
    { path: "../public/fonts/DMSans-Bold.ttf", weight: "700" }
  ]
})

const BMArbeiterNeue = localFont({
  src: "../public/fonts/BMArbeiterNeue-Fett.otf",
  weight: "400"
})

export default function MyApp({ Component, pageProps }: AppProps) {
  return (<>
    <Analytics/>
    <WagmiConfig client={wagmiClient}>
      <SWRConfig value={{
        refreshInterval: 10000,
        fetcher: (url) => axios.get(url).then(({ data }) => data),
      }}>
        <RainbowKitProvider
          chains={chains}
          coolMode
          theme={rkDarkTheme({ borderRadius: "large" })}>
          <ContractProvider>
            <JazzModeProvider>
              <ThemeProvider theme={darkTheme}>
                <GlobalStyle/>
                <style jsx global>{`
                  :root {
                    --jazz-font: ${BMArbeiterNeue.style.fontFamily};
                  }
                  body, html {
                    font-family: ${DMSans.style.fontFamily};
                  }
                `}</style>
                <NextNProgress
                  color={darkTheme.backgroundColor.tertiary}
                  stopDelayMs={200}
                  height={3}
                  showOnShallow={true}
                  options={{ showSpinner: false }}
                />
                <TVStaticNoise/>
                <Header/>
                <PageWrapper>
                  <Component {...pageProps}/>
                </PageWrapper>
                <Footer/>
              </ThemeProvider>
            </JazzModeProvider>
          </ContractProvider>
        </RainbowKitProvider>
      </SWRConfig>
    </WagmiConfig>
  </>)
}
