import { createContext, useEffect, useState, useContext } from "react"
import { useAccount, useSigner } from "wagmi"
import { Contract } from "ethers"

import { ASKS_V1_1, OFFERS_V1, ROYALTY_ENGINE_V1, ZORA_MODULE_MANAGER } from "../utils/env-vars"
import { defaultProvider } from "../utils"

import { ReactChildren } from "../types"
import { AsksV1_1_ABI, OffersV1_ABI, RoyaltyEngineV1_ABI, ZoraModuleManager_ABI } from "../abis"

const defaultModuleManager = new Contract(ZORA_MODULE_MANAGER, ZoraModuleManager_ABI, defaultProvider)

const defaultAsksV1_1 = new Contract(ASKS_V1_1, AsksV1_1_ABI, defaultProvider)
const defaultOffersV1 = new Contract(OFFERS_V1, OffersV1_ABI, defaultProvider)

const defaultRoyaltyV1 = new Contract(ROYALTY_ENGINE_V1, RoyaltyEngineV1_ABI, defaultProvider)

export type ContractContext = {
  ModuleManager: Contract,
  AsksManager: Contract,
  OffersManager: Contract,
  RoyaltyManager: Contract,
  isReadOnly: boolean,
}

export const ContractCtx = createContext<ContractContext>({
  ModuleManager: defaultModuleManager,
  AsksManager: defaultAsksV1_1,
  OffersManager: defaultOffersV1,
  RoyaltyManager: defaultRoyaltyV1,
  isReadOnly: true,
})

export function useContractContext(): ContractContext {
  return useContext(ContractCtx)
}

export function ContractProvider({ children }: ReactChildren) {
	const { address } = useAccount()
  const { data: signer } = useSigner()
  const [ isReadOnly, setIsReadOnly ] = useState<boolean>(false)

  const [ ModuleManager, setModuleManager ] = useState<Contract>(defaultModuleManager)
  const [ AsksManager, setAsksManager ] = useState<Contract>(defaultAsksV1_1)
  const [ OffersManager, setOffersManager ] = useState<Contract>(defaultOffersV1)
  const [ RoyaltyManager, setRoyaltyManager ] = useState<Contract>(defaultRoyaltyV1)

  useEffect(() => {
    if (!signer) return

    if (address) {
			const signedModuleManager = new Contract(ZORA_MODULE_MANAGER, ZoraModuleManager_ABI, signer)
      setModuleManager(signedModuleManager)

      const signedAsksManager = new Contract(ASKS_V1_1, AsksV1_1_ABI, signer)
      setAsksManager(signedAsksManager)

      const signedOffersManager = new Contract(OFFERS_V1, OffersV1_ABI, signer)
      setOffersManager(signedOffersManager)

      const signedRoyaltyManager = new Contract(ROYALTY_ENGINE_V1, RoyaltyEngineV1_ABI, signer)
      setRoyaltyManager(signedRoyaltyManager)

      setIsReadOnly(false)
    }
  }, [ signer, address ])

  useEffect(() => {
    if (!address && !isReadOnly) {
      setModuleManager(defaultModuleManager)
      setAsksManager(defaultAsksV1_1)
      setOffersManager(defaultOffersV1)
      setRoyaltyManager(defaultRoyaltyV1)
      setIsReadOnly(true)
    }
  }, [ address, isReadOnly ])

  return (
    <ContractCtx.Provider
      value={{
        ModuleManager,
        AsksManager,
        OffersManager,
        RoyaltyManager,
        isReadOnly
      }}>
      {children}
    </ContractCtx.Provider>
  )
}
