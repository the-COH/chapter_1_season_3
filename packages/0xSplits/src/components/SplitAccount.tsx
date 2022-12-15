import {
  Card,
  CardContent,
  CardHeader,
  Container,
  Divider,
  Grid,
  Stack,
  Typography,
  Button,
  Link,
  Checkbox,
} from '@mui/material'
import QrCodeIcon from '@mui/icons-material/QrCode'
import * as React from 'react'
import { Split, SplitsClient } from '@neobase-one/splits-sdk'
import { useEffect } from 'react'
import { AccountInfo, IconButton } from '@neobase-one/neobase-components'
import { AccountInfoProps } from '@neobase-one/neobase-components/lib/components/Utility/AccountInfo/AccountInfo'
import { useNavigate, useParams } from 'react-router-dom'
import { isAddress } from '@ethersproject/address'
import { useTheme } from '@mui/material/styles'
import { useProvider } from 'wagmi'
import useMediaQuery from '@mui/material/useMediaQuery'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { BigNumber } from '@ethersproject/bignumber'
import { formatEther } from '@ethersproject/units'
import { ethers } from 'ethers'
import { getSplitEarningsInfo } from '../utils'
import AccountSkeleton from './AccountSkeleton'

const SplitAccount: React.FC = () => {
  const navigate = useNavigate()
  const params = useParams()
  const [split, setSplit] = React.useState<Split>()
  const [earnings, setEarnings] = React.useState<{
    balances: AccountInfoProps[]
    distributed: AccountInfoProps[]
    totalAmount: string
    activeAmount: string
    distributedAmount: string
  }>()
  const [recipients, setRecipients] = React.useState<AccountInfoProps[]>()
  const [receiving, setReceiving] = React.useState<AccountInfoProps[]>()
  const [viewAllRecipients, setViewAllRecipients] =
    React.useState<boolean>(false)
  const [viewAllReceiving, setViewAllReceiving] = React.useState<boolean>(false)
  const [distribute, setDistribute] = React.useState<number[]>([])

  const provider = useProvider()
  const theme = useTheme()
  const desktopView = useMediaQuery(theme.breakpoints.up('sm'))
  const ensProvider = new ethers.providers.InfuraProvider(
    'homestead',
    process.env.REACT_APP_INFURA_KEY || '',
  )

  const [loadingSplit, setLoadingSplit] = React.useState<boolean>(false)
  const [loadingRelated, setLoadingRelated] = React.useState<boolean>(false)
  const [loadingEarnings, setLoadingEarnings] = React.useState<boolean>(false)

  useEffect(() => {
    async function querySplit(splitsClient: SplitsClient, splitId: string) {
      setLoadingSplit(true)
      const split = await splitsClient.getSplitMetadata({
        splitId: splitId,
      })
      setSplit(split)
      setLoadingSplit(false)
    }
    if (params.accountID && params.accountID != split?.id) {
      setSplit(undefined)
    }
    if (params.accountID && isAddress(params.accountID)) {
      const splitsClient = new SplitsClient({
        chainId: 7700,
      })
      querySplit(splitsClient, params.accountID)
    }
  }, [params])

  useEffect(() => {
    async function queryRelated(splitsClient: SplitsClient, splitId: string) {
      setLoadingRelated(true)
      const { receivingFrom } = await splitsClient.getRelatedSplits({
        address: splitId,
      })
      const donors = await Promise.all(
        receivingFrom.map(async (donor) => {
          const { activeAmount } = await getSplitEarningsInfo(
            splitsClient,
            splitId,
            true,
            provider,
          )
          const percentAllocation = donor.recipients.find(
            (recipient) => recipient.address === params.accountID,
          )?.percentAllocation
          return {
            address: donor.id,
            amount: `${percentAllocation}%`,
            subinfo: `$${
              Number(activeAmount) * (percentAllocation! / 100)
            } pending`,
            onClick: () => navigate(`/accounts/${donor.id}`),
          } as AccountInfoProps
        }),
      )
      setReceiving(donors)
      setLoadingRelated(false)
    }
    async function queryEarnings(splitsClient: SplitsClient, splitId: string) {
      setLoadingEarnings(true)
      const {
        activeAmount,
        activeBalances,
        distributedAmount,
        distributions,
        totalAmount,
      } = await getSplitEarningsInfo(splitsClient, splitId, true, provider)
      setEarnings({
        activeAmount: activeAmount,
        balances: activeBalances,
        distributedAmount: distributedAmount,
        distributed: distributions,
        totalAmount: totalAmount,
      })
      setLoadingEarnings(false)
    }
    if (params.accountID && params.accountID != split?.id) {
      setSplit(undefined)
    }
    if (params.accountID && isAddress(params.accountID) && provider) {
      const splitsClient = new SplitsClient({
        chainId: 7700,
        provider: provider,
      })
      queryEarnings(splitsClient, params.accountID)
      queryRelated(splitsClient, params.accountID)
    }
  }, [params, provider])

  useEffect(() => {
    if (split) {
      const recipients = split.recipients.map(
        (recipient) =>
          ({
            address: recipient.address,
            amount: `${recipient.percentAllocation}%`,
            onClick: () => navigate(`/accounts/${recipient.address}`),
          } as AccountInfoProps),
      )
      setRecipients(recipients)
    } else {
      setRecipients(undefined)
    }
  }, [split])

  const addBalance = (index: number, distributeCopy: number[]) => {
    const ind = distributeCopy.indexOf(index)
    if (ind == -1) {
      distributeCopy.push(index)
    } else {
      distributeCopy.splice(ind, 1)
    }
    setDistribute([...distributeCopy])
  }

  const distributeBalance = (distributeCopy: number[]) => {
    console.log(distributeCopy)
  }

  if (!params.accountID || !isAddress(params.accountID)) {
    return (
      <Container
        maxWidth="xl"
        sx={{
          flexGrow: 1,
          py: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <>Couldn't locate address</>
      </Container>
    )
  }

  return (
    <Container maxWidth="xl" sx={{ alignSelf: 'start', pt: 6 }}>
      {loadingSplit || loadingEarnings || loadingRelated ? (
        <AccountSkeleton />
      ) : (
        <>
          <Card sx={{ width: '100%', display: 'flex' }} variant="outlined">
            <IconButton
              startIcon={<ArrowBackIcon />}
              sx={{ px: 2 }}
              onClick={() => navigate(-1)}
            />
            <AccountInfo
              address={params.accountID}
              showMenu={false}
              showButtonGroup={true}
              expandOnHover={true}
              dense={true}
              truncate={!desktopView}
              onClick={undefined}
              provider={ensProvider}
            />
          </Card>
          <Grid container spacing={6} sx={{ pt: 6 }}>
            <Grid item xs={12} md={6}>
              <Grid container flexDirection="column" spacing={3}>
                <Grid item>
                  <Card variant="outlined">
                    <CardHeader
                      title={
                        <Grid container>
                          <Grid item xs>
                            Split Earnings
                          </Grid>
                          <Grid item>${earnings?.totalAmount}</Grid>
                        </Grid>
                      }
                    ></CardHeader>
                    <Divider />
                    <CardContent>
                      <Stack pl={1} spacing={2} pt={1}>
                        <Typography paragraph={true}>
                          The Split pays {split?.distributorFeePercent}% for
                          each balance distributed.{' '}
                          <Link href="https://docs.0xsplits.xyz/core-concepts#distributor-fee">
                            Learn more
                          </Link>
                        </Typography>
                        {earnings && earnings.balances.length > 0 && (
                          <>
                            <Grid container alignItems="center">
                              <Grid item xs>
                                <Typography>Balances</Typography>
                              </Grid>
                              <Grid item>
                                <Button
                                  variant="outlined"
                                  disabled={
                                    distribute.length === 0 ? true : false
                                  }
                                  onClick={() => distributeBalance(distribute)}
                                >
                                  Distribute
                                </Button>
                              </Grid>
                            </Grid>
                            {earnings.balances.map((balance, index) => (
                              <React.Fragment key={`Balance_${index}`}>
                                <Stack>
                                  <Grid container alignItems="center">
                                    <Grid item>
                                      <Checkbox
                                        onChange={() =>
                                          addBalance(index, distribute)
                                        }
                                      />
                                    </Grid>
                                    <Grid item xs>
                                      <AccountInfo
                                        truncate={false}
                                        showMenu={false}
                                        {...balance}
                                      />
                                    </Grid>
                                  </Grid>
                                  <Divider sx={{ borderColor: '#d3d3d3' }} />
                                </Stack>
                              </React.Fragment>
                            ))}
                            <Grid container pr={2} pt={2}>
                              <Grid item xs>
                                <Typography>Total Balances</Typography>
                              </Grid>
                              <Grid item>${earnings?.activeAmount}</Grid>
                            </Grid>
                          </>
                        )}
                        {earnings && earnings.distributed.length > 0 && (
                          <>
                            <Typography sx={{ paddingTop: '0.5rem' }}>
                              Distributed
                            </Typography>
                            <Stack>
                              {earnings.distributed.map(
                                (distribution, index) => (
                                  <React.Fragment key={`Distributed_${index}`}>
                                    <AccountInfo
                                      truncate={false}
                                      showMenu={false}
                                      {...distribution}
                                    />
                                    <Divider sx={{ borderColor: '#d3d3d3' }} />
                                  </React.Fragment>
                                ),
                              )}
                            </Stack>
                            <Grid container pr={2} pt={2}>
                              <Grid item xs>
                                <Typography>Total Distributed</Typography>
                              </Grid>
                              <Grid item>${earnings?.distributedAmount}</Grid>
                            </Grid>
                          </>
                        )}
                        {earnings &&
                          earnings.balances.length === 0 &&
                          earnings.distributed.length === 0 && (
                            <Typography align="center">
                              No Data Found
                            </Typography>
                          )}
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item>
                  <Card variant="outlined">
                    <CardHeader title="Recipients"></CardHeader>
                    <Divider />
                    <CardContent>
                      <Stack>
                        {recipients &&
                          recipients
                            .slice(
                              0,
                              viewAllRecipients ? recipients.length : 10,
                            )
                            .map((accountInfo, index) => (
                              <AccountInfo
                                key={`Recipients_${index}`}
                                {...accountInfo}
                                provider={ensProvider}
                              />
                            ))}
                        {recipients && recipients.length > 10 && (
                          <Button
                            variant="outlined"
                            onClick={() =>
                              setViewAllRecipients((prev) => !prev)
                            }
                            sx={{ padding: '0.5rem 0rem' }}
                          >
                            {viewAllRecipients ? 'View Less' : 'View All'}
                          </Button>
                        )}
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} md={6}>
              <Grid container flexDirection="column" spacing={3}>
                <Grid item>
                  <Card variant="outlined">
                    <CardHeader title="Address"></CardHeader>
                    <Divider />
                    <CardContent>
                      <Stack spacing={2} py={1}>
                        <AccountInfo
                          address={params.accountID}
                          showMenu={false}
                          showButtonGroup={true}
                          openExplorer={false}
                          showAvatar={false}
                          truncate={false}
                          sx={{ background: '#d3d3d3', borderRadius: '0.5rem' }}
                          iconButtons={[
                            {
                              toolTipProps: {
                                title: 'View QR Code',
                              },
                              startIcon: <QrCodeIcon />,
                            },
                          ]}
                        />
                        <Typography
                          paragraph={true}
                          sx={{ padding: '1rem 0rem' }}
                        >
                          Funds sent to this address will be split among the
                          recipients.
                        </Typography>
                        <Button
                          fullWidth
                          variant="contained"
                          sx={{
                            fontWeight: 'bold',
                          }}
                        >
                          Deposit Funds
                        </Button>
                        <Button variant="outlined" fullWidth>
                          New Vesting Module
                        </Button>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
                {receiving && receiving.length > 0 && (
                  <Grid item>
                    <Card variant="outlined">
                      <CardHeader title="Receiving from"></CardHeader>
                      <Divider />
                      <CardContent>
                        <Stack>
                          {receiving &&
                            receiving
                              .slice(
                                0,
                                viewAllReceiving ? receiving.length : 10,
                              )
                              .map((accountInfo, index) => (
                                <AccountInfo
                                  key={`Receiving_${index}`}
                                  {...accountInfo}
                                />
                              ))}
                          {receiving && receiving.length > 10 && (
                            <Button
                              variant="outlined"
                              onClick={() =>
                                setViewAllReceiving((prev) => !prev)
                              }
                              sx={{ padding: '0.5rem 0rem' }}
                            >
                              {viewAllReceiving ? 'View Less' : 'View All'}
                            </Button>
                          )}
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                )}
              </Grid>
            </Grid>
          </Grid>
        </>
      )}
    </Container>
  )
}
export default SplitAccount
