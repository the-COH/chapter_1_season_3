import { useEffect, useState } from "react"
import {
  useAccount,
  useDisconnect,
  useNetwork,
  useProvider,
  useSigner,
} from "wagmi"
import { CHAIN_ID } from "../utils/env-vars"

export function useAuth() {
  const provider = useProvider()
  const { data: signer } = useSigner()
  const { address, isConnecting } = useAccount()
  const { disconnect } = useDisconnect()
  const { chain } = useNetwork()
  const [ incorrectChain, setIncorrectChain ] = useState(false)

  const [ connectedAddress, setConnectedAddress ] = useState<string>() // nextjs hydration issues :|
  useEffect(() => setConnectedAddress(address), [ address ])

  useEffect(() => {
    setIncorrectChain(chain ? chain.id.toString() !== CHAIN_ID : false)
  }, [ chain ])

  return {
    provider,
    incorrectChain,
    signer,
    address: connectedAddress,
    loading: isConnecting,
    logout: disconnect,
  }
}
