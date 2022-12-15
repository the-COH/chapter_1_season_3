import * as React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { BrowserRouter } from 'react-router-dom'
import { WagmiConfig } from 'wagmi'
import { client } from './web3client'
import { SplitsProvider } from '@neobase-one/splits-sdk-react'

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Failed to find the root element')
const root = createRoot(rootElement)

root.render(
  <BrowserRouter>
    <WagmiConfig client={client}>
      <SplitsProvider>
        <App />
      </SplitsProvider>
    </WagmiConfig>
  </BrowserRouter>,
)
