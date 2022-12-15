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
  Checkbox,
} from '@mui/material'
import * as React from 'react'
import { Split, SplitsClient } from '@neobase-one/splits-sdk'
import { useEffect } from 'react'
import {
  AccountInfo,
  IconButton,
  ToggleButtonGroup,
} from '@neobase-one/neobase-components'
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
import { getSplitEarningsInfo, getUserEarningsInfo } from '../utils'
import AccountSkeleton from './AccountSkeleton'

const SplitAccount: React.FC = () => {
  const navigate = useNavigate()
  const params = useParams()
  const [split, setSplit] = React.useState<Split>()
  const [earnings, setEarnings] = React.useState<{
    totalAmount: string
    activeAmount: string
    balances: AccountInfoProps[]
    withdrawnAmount: string
    withdrawn: AccountInfoProps[]
  }>()
  const [recipients, setRecipients] = React.useState<AccountInfoProps[]>()
  const [receiving, setReceiving] = React.useState<AccountInfoProps[]>()
  const [controlling, setControlling] = React.useState<AccountInfoProps[]>()
  const [transferred, setTransferred] = React.useState<AccountInfoProps[]>()
  const [viewAllRecipients, setViewAllRecipients] =
    React.useState<boolean>(false)
  const [viewAllReceiving, setViewAllReceiving] = React.useState<boolean>(false)
  const [distribute, setDistribute] = React.useState<number[]>([])
  const provider = useProvider()
  const theme = useTheme()
  const desktopView = useMediaQuery(theme.breakpoints.up('sm'))

  const [loadingRelated, setLoadingRelated] = React.useState<boolean>(false)
  const [loadingEarnings, setLoadingEarnings] = React.useState<boolean>(false)

  const ensProvider = new ethers.providers.InfuraProvider(
    'homestead',
    process.env.REACT_APP_INFURA_KEY || '',
  )

  const userViewMap = {
    Receiving: receiving,
    Controlling: controlling,
    Transferred: transferred,
  }
  const [currView, setCurrView] = React.useState<
    'Receiving' | 'Controlling' | 'Transferred'
  >('Receiving')

  useEffect(() => {
    async function queryRelated(splitsClient: SplitsClient, splitId: string) {
      setLoadingRelated(true)
      const relatedSplits = await splitsClient.getRelatedSplits({
        address: splitId,
      })
      const donors = await Promise.all(
        relatedSplits.receivingFrom.map(async (donor) => {
          const { totalAmount } = await getSplitEarningsInfo(
            splitsClient,
            splitId,
            true,
            provider,
          )
          return {
            address: donor.id,
            subinfo: `${donor.recipients.length} recipients`,
            amount: `$${totalAmount}`,
            onClick: () => navigate(`/accounts/${donor.id}`),
          } as AccountInfoProps
        }),
      )
      setReceiving(donors)

      const controlling = await Promise.all(
        relatedSplits.controlling.map(async (split) => {
          const { totalAmount } = await getSplitEarningsInfo(
            splitsClient,
            splitId,
            true,
            provider,
          )
          return {
            address: split.id,
            subinfo: `${split.recipients.length} recipients`,
            amount: `$${totalAmount}`,
            onClick: () => navigate(`/accounts/${split.id}`),
          } as AccountInfoProps
        }),
      )
      setControlling(controlling)

      const transferred = await Promise.all(
        relatedSplits.pendingControl.map(async (pending) => {
          const { totalAmount } = await getSplitEarningsInfo(
            splitsClient,
            splitId,
            true,
            provider,
          )
          return {
            address: pending.id,
            subinfo: `${pending.recipients.length} recipients`,
            amount: `$${totalAmount}`,
            onClick: () => navigate(`/accounts/${pending.id}`),
          } as AccountInfoProps
        }),
      )
      setTransferred(transferred)
      setLoadingRelated(false)
    }
    if (params.accountID && params.accountID != split?.id) {
      setSplit(undefined)
    }
    if (params.accountID && isAddress(params.accountID) && provider) {
      const splitsClient = new SplitsClient({
        chainId: 7700,
        provider: provider,
      })
      queryRelated(splitsClient, params.accountID)
    }
  }, [params, provider])

  useEffect(() => {
    async function queryEarnings(splitsClient: SplitsClient, userId: string) {
      setLoadingEarnings(true)
      const {
        activeAmount,
        activeBalances,
        withdrawnAmount,
        withdrawnBalances,
        totalAmount,
      } = await getUserEarningsInfo(splitsClient, userId, provider)
      setEarnings({
        activeAmount: activeAmount,
        balances: activeBalances,
        withdrawnAmount: withdrawnAmount,
        withdrawn: withdrawnBalances,
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
      {loadingEarnings || loadingRelated ? (
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
                        <ToggleButtonGroup
                          options={[
                            {
                              value: 'Receiving',
                              children: (
                                <Typography>
                                  Receiving {receiving ? receiving.length : 0}
                                </Typography>
                              ),
                            },
                            {
                              value: 'Controlling',
                              children: (
                                <Typography>
                                  Controlling{' '}
                                  {controlling ? controlling.length : 0}
                                </Typography>
                              ),
                            },
                            {
                              value: 'Transferred',
                              children: (
                                <Typography>
                                  Transferred{' '}
                                  {transferred ? transferred.length : 0}
                                </Typography>
                              ),
                            },
                          ]}
                          value={currView}
                          onChange={(event, newView) => {
                            setCurrView(newView.substring(currView.length))
                          }}
                          color="primary"
                        />
                      }
                    ></CardHeader>
                    <Divider />
                    <CardContent>
                      {userViewMap[currView] &&
                      userViewMap[currView]!.length > 0 ? (
                        userViewMap[currView]!.map((split, index) => (
                          <AccountInfo
                            key={`${currView}_${index}`}
                            {...split}
                          />
                        ))
                      ) : (
                        <Typography align="center">
                          No accounts exist that match this filter
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} md={6}>
              <Grid container flexDirection="column" spacing={3}>
                <Grid item>
                  <Card variant="outlined">
                    <CardHeader
                      title={
                        <Grid container>
                          <Grid item xs>
                            Account Earnings
                          </Grid>
                          <Grid item>${earnings?.totalAmount}</Grid>
                        </Grid>
                      }
                    ></CardHeader>
                    <Divider />
                    <CardContent>
                      <Stack pl={1} spacing={2} pt={1}>
                        {earnings && earnings.balances.length > 0 && (
                          <>
                            <Grid container alignItems="center">
                              <Grid item xs>
                                <Typography>Current Balances</Typography>
                              </Grid>
                              <Grid item>
                                <Button
                                  variant="outlined"
                                  disabled={
                                    distribute.length === 0 ? true : false
                                  }
                                  onClick={() => distributeBalance(distribute)}
                                >
                                  Withdraw Tokens
                                </Button>
                              </Grid>
                            </Grid>
                            {earnings &&
                              earnings.balances.map((balance, index) => (
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
                            <Grid container pr={2}>
                              <Grid item xs>
                                <Typography>Total Balances</Typography>
                              </Grid>
                              <Grid item>${earnings?.activeAmount}</Grid>
                            </Grid>
                          </>
                        )}
                        {earnings && earnings.withdrawn.length > 0 && (
                          <>
                            <Typography sx={{ paddingTop: '0.5rem' }}>
                              Withdrawn
                            </Typography>
                            <Stack>
                              {earnings &&
                                earnings.withdrawn.map(
                                  (withdrawnBalance, index) => (
                                    <React.Fragment key={`Withdrawn_${index}`}>
                                      <AccountInfo
                                        truncate={false}
                                        showMenu={false}
                                        {...withdrawnBalance}
                                      />
                                      <Divider
                                        sx={{ borderColor: '#d3d3d3' }}
                                      />
                                    </React.Fragment>
                                  ),
                                )}
                              <Grid container pr={2} pt={2}>
                                <Grid item xs>
                                  <Typography>Total Withdrawn</Typography>
                                </Grid>
                                <Grid item>${earnings?.withdrawnAmount}</Grid>
                              </Grid>
                            </Stack>
                          </>
                        )}
                        {earnings &&
                          earnings.balances.length === 0 &&
                          earnings.withdrawn.length === 0 && (
                            <Typography align="center">
                              No Data Found
                            </Typography>
                          )}
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </>
      )}
    </Container>
  )
}
export default SplitAccount
