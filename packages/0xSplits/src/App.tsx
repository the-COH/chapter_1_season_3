import * as React from 'react'
import Box from '@mui/material/Box'
import Header from './components/Header'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import Content from './components/Content'
import Footer from './components/Footer'
import {
  useProvider,
  useSigner,
  useAccount,
  useNetwork,
  useSwitchNetwork,
} from 'wagmi'
import { customDarkTheme, customLightTheme } from './theme'
import { ColorModeContext } from './context'
import { useSplitsClient } from '@neobase-one/splits-sdk-react'
import useMediaQuery from '@mui/material/useMediaQuery'

export default function App() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')

  const [mode, setMode] = React.useState<'light' | 'dark'>(
    prefersDarkMode ? 'dark' : 'light',
  )
  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'))
      },
    }),
    [],
  )

  const provider = useProvider()
  const { data: signer } = useSigner()

  const { isConnected } = useAccount()
  const { chain } = useNetwork()
  const { switchNetwork } = useSwitchNetwork()

  React.useEffect(() => {
    if (isConnected && chain && switchNetwork && chain.id !== 7700) {
      switchNetwork(7700)
    }
  }, [isConnected, chain, switchNetwork])

  useSplitsClient({
    chainId: 7700,
    provider,
    ...(signer && { signer }),
  })

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider
        theme={mode == 'light' ? customLightTheme : customDarkTheme}
      >
        <CssBaseline />
        <Box
          sx={{
            width: '100%',
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Header />
          <Content />
          <Footer />
        </Box>
      </ThemeProvider>
    </ColorModeContext.Provider>
  )
}
