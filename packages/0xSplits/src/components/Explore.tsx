import {
  Card,
  CardContent,
  CardHeader,
  Container,
  Divider,
  Grid,
  Stack,
  Skeleton,
} from '@mui/material'
import * as React from 'react'
import { SplitsClient } from '@neobase-one/splits-sdk'
import { useProvider } from 'wagmi'
import { useEffect } from 'react'
import { BigNumber } from '@ethersproject/bignumber'
import { AccountInfo } from '@neobase-one/neobase-components'
import { AccountInfoProps } from '@neobase-one/neobase-components/lib/components/Utility/AccountInfo/AccountInfo'
import { useNavigate } from 'react-router-dom'
import { getSplitEarningsInfo } from '../utils'

const Explore: React.FC = () => {
  const navigate = useNavigate()
  const provider = useProvider()
  const [splits, setSplits] = React.useState<AccountInfoProps[]>()
  const [loadingSplits, setLoadingSplits] = React.useState<boolean>(false)

  useEffect(() => {
    async function queryTopSplits(splitsClient: SplitsClient) {
      setLoadingSplits(true)
      const splits = await splitsClient.getTopSplits({
        lastId: '',
      })

      const splitsInfo = await Promise.all(
        splits.splits.map(async (split) => {
          const { totalAmount } = await getSplitEarningsInfo(
            splitsClient,
            split.id,
            true,
            provider,
          )
          const numberOfRecipients = split.recipients.length
          return {
            address: split.id,
            amount: `$${totalAmount}`,
            subinfo: `${numberOfRecipients} recipients`,
            value: Number(totalAmount),
            onClick: () => navigate(`/accounts/${split.id}`),
          }
        }),
      )
      setSplits(splitsInfo)
      setLoadingSplits(false)
    }
    if (provider != undefined) {
      const splitsClient = new SplitsClient({
        chainId: 7700,
        provider,
      })
      queryTopSplits(splitsClient)
    }
  }, [provider])

  const SplitsSkeleton = () => {
    return (
      <Grid container pt={8}>
        <Skeleton variant="rectangular" sx={{ width: '100%' }} height={400} />
      </Grid>
    )
  }

  return (
    <Container
      maxWidth="xl"
      sx={{
        flexGrow: 1,
        py: 2,
        pt: 8,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Grid container spacing={6}>
        {loadingSplits ? (
          <SplitsSkeleton />
        ) : (
          <Grid item xs={12}>
            <Card variant="outlined">
              <CardHeader title="Splits"></CardHeader>
              <Divider />
              <CardContent>
                <Stack sx={{ minHeight: '440px' }}>
                  {splits &&
                    splits.map((accountInfo, index) => (
                      <React.Fragment key={index}>
                        <AccountInfo {...accountInfo} />
                        {index !== splits.length - 1 && <Divider />}
                      </React.Fragment>
                    ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Container>
  )
}
export default Explore
