import * as React from 'react'
import { Split, SplitsClient } from '@neobase-one/splits-sdk'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { isAddress } from '@ethersproject/address'
import Loading from './Loading'
import SplitAccount from './SplitAccount'
import UserAccount from './UserAccount'

const Account: React.FC = () => {
  const params = useParams()
  const [split, setSplit] = React.useState<Split>()
  const [loading, setLoading] = React.useState(true)

  useEffect(() => {
    async function querySplit(splitsClient: SplitsClient, splitId: string) {
      try {
        const split = await splitsClient.getSplitMetadata({
          splitId: splitId,
        })
        setSplit(split)
      } catch {
        setSplit(undefined)
      } finally {
        setLoading(false)
      }
    }
    if (params.accountID && params.accountID != split?.id) {
      setSplit(undefined)
      setLoading(true)
    }
    if (params.accountID && isAddress(params.accountID)) {
      const splitsClient = new SplitsClient({
        chainId: 7700,
      })
      querySplit(splitsClient, params.accountID)
    }
  }, [params])
  if (loading) return <Loading />
  else return split ? <SplitAccount /> : <UserAccount />
}
export default Account
