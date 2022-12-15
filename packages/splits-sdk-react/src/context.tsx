import React, { createContext, useState, useMemo } from 'react'
import { SplitsClient, SplitsClientConfig } from '@neobase-one/splits-sdk'

type SplitsReactSdkContext = {
  splitsClient: SplitsClient
  initClient: (config: SplitsClientConfig) => void
}

export const SplitsContext = createContext<SplitsReactSdkContext | undefined>(
  undefined,
)

interface Props {
  config?: SplitsClientConfig
  children: React.ReactNode
}

export const SplitsProvider: React.FC<Props> = ({
  config = { chainId: 1 },
  children,
}) => {
  const [splitsClient, setSplitsClient] = useState(
    () => new SplitsClient(config),
  )
  const initClient = (config: SplitsClientConfig) => {
    setSplitsClient(new SplitsClient(config))
  }

  const contextValue = useMemo(
    () => ({ splitsClient, initClient }),
    [splitsClient],
  )

  return (
    <SplitsContext.Provider value={contextValue}>
      {children}
    </SplitsContext.Provider>
  )
}
