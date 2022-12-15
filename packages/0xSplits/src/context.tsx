import { createContext } from 'react'

interface colorMode {
  toggleColorMode: () => void
}

export const ColorModeContext = createContext<colorMode>({
  toggleColorMode: () => void 0,
})
