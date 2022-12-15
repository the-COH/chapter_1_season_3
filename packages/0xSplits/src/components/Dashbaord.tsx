import {
  Card,
  CardContent,
  CardHeader,
  Container,
  Divider,
  Grid,
  Stack,
  Typography,
  Skeleton,
  Avatar,
  Box,
} from '@mui/material'
import * as React from 'react'
import { SplitsClient } from '@neobase-one/splits-sdk'
import { useProvider } from 'wagmi'
import { useEffect } from 'react'
import { AccountInfo } from '@neobase-one/neobase-components'
import { AccountInfoProps } from '@neobase-one/neobase-components/lib/components/Utility/AccountInfo/AccountInfo'
import { useNavigate } from 'react-router-dom'
import { ethers } from 'ethers'
import EastIcon from '@mui/icons-material/East'
import { getSplitEarningsInfo, getUserEarningsInfo } from '../utils'
import { useTheme } from '@mui/material/styles'

const Dashboard: React.FC = () => {
  const navigate = useNavigate()
  const provider = useProvider()
  const [loadingSplits, setLoadingSplits] = React.useState<boolean>(false)
  const [loadingRecipients, setLoadingRecipients] =
    React.useState<boolean>(false)
  const [topSplits, setTopSplits] = React.useState<AccountInfoProps[]>()
  const [topRecipients, setTopRecipients] = React.useState<AccountInfoProps[]>()

  const theme = useTheme()

  const ensProvider = new ethers.providers.InfuraProvider(
    'homestead',
    process.env.REACT_APP_INFURA_KEY || '',
  )

  const DashboardSkeleton = () => {
    return (
      <Stack>
        {[1, 2, 3, 4, 5].map((index, key) => (
          <Grid key={key} container spacing={3.5} p={2}>
            <Grid item>
              <Skeleton variant="circular">
                <Avatar />
              </Skeleton>
            </Grid>
            <Grid item xs>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Skeleton variant="rectangular" width={200} />
                </Grid>
                <Grid item xs={12}>
                  <Skeleton variant="rectangular" width={100} />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        ))}
      </Stack>
    )
  }

  useEffect(() => {
    async function queryTopSplits(splitsClient: SplitsClient) {
      setLoadingSplits(true)
      const splits = await splitsClient.getTopSplits({
        lastId: '',
      })

      const topSplitsInfo = await Promise.all(
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

      const topSplitsFiltered = topSplitsInfo
        .sort((split1, split2) => split1.value - split2.value)
        .slice(0, 5)
        .map((split) => split as AccountInfoProps)

      setTopSplits(topSplitsFiltered)
      setLoadingSplits(false)
    }
    async function queryTopRecipients(splitsClient: SplitsClient) {
      setLoadingRecipients(true)
      const recipients = await splitsClient.getTopRecipients({
        lastId: '',
      })
      const topInfo = await Promise.all(
        recipients.recipients.map(async (recipient) => {
          const { totalAmount } = await getUserEarningsInfo(
            splitsClient,
            recipient.address,
            provider,
          )
          return {
            address: recipient.address,
            amount: `$${totalAmount}`,
            subinfo: `0 accounts`,
            value: Number(totalAmount),
            onClick: () => navigate(`/accounts/${recipient.address}`),
          }
        }),
      )
      const unique_ids: string[] = []
      const topRecipientsFiltered = topInfo
        .sort((split1, split2) => split1.value - split2.value)
        .filter((split) => {
          if (unique_ids.indexOf(split.address) === -1) {
            unique_ids.push(split.address)
            return true
          }
          return false
        })
        .slice(0, 5)
        .map((split) => split as AccountInfoProps)

      setTopRecipients(topRecipientsFiltered)
      setLoadingRecipients(false)
    }
    if (provider != undefined) {
      const splitsClient = new SplitsClient({
        chainId: 7700,
        provider,
      })
      queryTopSplits(splitsClient)
      queryTopRecipients(splitsClient)
    }
  }, [provider])

  return (
    <Box>
      <Grid container spacing={6} pt={5}>
        <Grid item xs={12}>
          <Card
            sx={{
              cursor: 'pointer',
              background:
                theme.palette.mode == 'light'
                  ? theme.palette.primary.main
                  : theme.palette.primary.main,
              color: 'white',
            }}
            onClick={() => navigate('/split')}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                p: 4,
              }}
            >
              <Grid item>
                <Grid container>
                  <Grid item xs={12}>
                    <Typography variant="h6">Get started</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    Create a split and start using it with your favorite web3
                    platforms today
                  </Grid>
                </Grid>
              </Grid>
              <EastIcon fontSize="large" />
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardHeader title="Top Splits"></CardHeader>
            <Divider />
            <CardContent>
              {!loadingSplits ? (
                <Stack>
                  {topSplits &&
                    topSplits.map((accountInfo, index) => (
                      // <AccountInfo key={index} {...accountInfo} />
                      <React.Fragment key={index}>
                        <AccountInfo {...accountInfo} />
                        {index !== topSplits.length - 1 && <Divider />}
                      </React.Fragment>
                    ))}
                </Stack>
              ) : (
                <DashboardSkeleton />
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardHeader title="Top Recipients"></CardHeader>
            <Divider />
            <CardContent>
              {!loadingRecipients ? (
                <Stack>
                  {topRecipients &&
                    topRecipients.map((accountInfo, index) => (
                      <React.Fragment key={index}>
                        <AccountInfo {...accountInfo} provider={ensProvider} />
                        {index !== topRecipients.length - 1 && <Divider />}
                      </React.Fragment>
                    ))}
                </Stack>
              ) : (
                <DashboardSkeleton />
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Card>
                <CardHeader title="Lorem Ipsum"></CardHeader>
                <CardContent>
                  elit at imperdiet dui accumsan sit amet nulla facilisi morbi
                  tempus iaculis urna id volutpat lacus laoreet non curabitur
                  gravida
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardHeader title="Lorem Ipsum"></CardHeader>
                <CardContent>
                  elit at imperdiet dui accumsan sit amet nulla facilisi morbi
                  tempus iaculis urna id volutpat lacus laoreet non curabitur
                  gravida
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardHeader title="Lorem Ipsum"></CardHeader>
                <CardContent>
                  elit at imperdiet dui accumsan sit amet nulla facilisi morbi
                  tempus iaculis urna id volutpat lacus laoreet non curabitur
                  gravida
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  )
}
export default Dashboard
