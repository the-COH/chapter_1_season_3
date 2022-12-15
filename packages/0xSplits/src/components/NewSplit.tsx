import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CircularProgress,
  Container,
  Divider,
  Typography,
} from '@mui/material'
import * as React from 'react'
import {
  AddressInput,
  Button,
  ToggleButtonGroup,
} from '@neobase-one/neobase-components'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '@mui/material/styles'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import SplitsForm, { SplitsData } from './SplitsForm'
import { isAddress } from 'ethers/lib/utils.js'
import { SplitsClient } from '@neobase-one/splits-sdk'
import { useProvider, useSigner, useAccount, useConnect } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'

type SplitsType = 'immutable' | 'mutable' | 'liquid'

const Account: React.FC = () => {
  const defaultData: SplitsData = {
    recipients: [
      { address: '', percentAllocation: 0 },
      { address: '', percentAllocation: 0 },
    ],
    distributorFeePercent: 1.0,
  }
  const provider = useProvider()
  const { data: signer } = useSigner()
  const navigate = useNavigate()
  const { address, isConnecting, isDisconnected } = useAccount()
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  })
  const [data, setData] = React.useState<SplitsData>(defaultData)
  const [splitType, setSplitType] = React.useState<SplitsType>('immutable')
  const [predictAddress, setPridictAdrress] = React.useState({
    isLoading: false,
    address: '',
  })
  const [formStatus, setFormStatus] = React.useState({
    pending: true,
    loading: false,
  })

  const theme = useTheme()

  const handleSetType = (
    event: React.MouseEvent<HTMLElement>,
    newSplitType: SplitsType | null,
  ) => {
    if (newSplitType !== null) {
      setSplitType(newSplitType)
    }
  }

  React.useEffect(() => {
    if (
      data.recipients.every(
        (recipient) =>
          isAddress(recipient.address) &&
          recipient.percentAllocation > 0 &&
          recipient.percentAllocation < 100,
      ) &&
      data.distributorFeePercent < 10 &&
      data.recipients.reduce(
        (curr, next) => curr + next.percentAllocation,
        0,
      ) == 100
    ) {
      setFormStatus({ ...formStatus, pending: false })
    } else {
      setFormStatus({ ...formStatus, pending: true })
    }
  }, [data])

  React.useEffect(() => {
    async function getPredicted(splitsClient: SplitsClient) {
      try {
        const { splitId } = await splitsClient.predictImmutableSplitAddress(
          data,
        )
        setPridictAdrress({ address: splitId, isLoading: false })
      } catch (err) {
        // error handling
        console.log(err)
      }
    }
    if (!formStatus.pending && provider != undefined) {
      setPridictAdrress({ address: '', isLoading: true })
      const splitsClient = new SplitsClient({
        chainId: 7700,
        provider,
      })
      getPredicted(splitsClient)
    }
  }, [formStatus, data])

  const splitTypeOptions = [
    {
      value: 'immutable',
      children: [
        <Typography textAlign="left">Immutable Split</Typography>,
        <Typography
          textAlign="left"
          variant="caption"
          color={theme.palette.text.secondary}
        >
          Recipients cannot be updated once deployed
        </Typography>,
      ],
    },
    {
      value: 'mutable',
      children: [
        <Typography textAlign="left">Mutable Split</Typography>,
        <Typography
          textAlign="left"
          variant="caption"
          color={theme.palette.text.secondary}
        >
          Recipients can be updated by the Controlling Address
        </Typography>,
      ],
    },
    {
      value: 'liquid',
      children: [
        <Typography textAlign="left">Liquid Split</Typography>,
        <Typography
          textAlign="left"
          variant="caption"
          color={theme.palette.text.secondary}
        >
          Recipients are represented by transferrable NFTs
        </Typography>,
      ],
    },
  ]

  async function createSplit() {
    if (signer) {
      const splitsClient = new SplitsClient({
        chainId: 7700,
        provider,
        signer,
      })
      setFormStatus({ pending: false, loading: true })
      try {
        const { splitId } = await splitsClient.createSplit(data)
        setFormStatus({ pending: false, loading: false })
        navigate(`/accounts/${splitId}`)
      } catch (err) {
        setFormStatus({ pending: false, loading: false })
        // error handling
        console.log(err)
      }
    }
  }

  return (
    <Container maxWidth="xl" sx={{ alignSelf: 'start' }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)}
        label="back"
        variant="text"
      />
      <Typography variant="h4" sx={{ pt: 2 }}>
        New Split
      </Typography>
      <Typography color={theme.palette.text.secondary} sx={{ pt: 1 }}>
        A Split is a payable smart contract that splits all ETH & ERC20 tokens
        it receives.
      </Typography>
      <Box sx={{ mt: 6 }}>
        <ToggleButtonGroup
          value={splitType}
          exclusive
          onChange={handleSetType}
          fullWidth
          // color="primary"
          options={splitTypeOptions}
          buttonProps={{
            sx: {
              display: 'flex',
              flexDirection: 'column',
              textTransform: 'none',
              alignItems: 'start',
            },
          }}
          color="primary"
        ></ToggleButtonGroup>
      </Box>
      <Box sx={{ mt: 6 }}>
        {<SplitsForm data={data} setDataHandler={setData} />}
      </Box>
      <Card sx={{ mt: 6 }} variant="outlined">
        <CardHeader title="Contract Address"></CardHeader>
        <Divider />
        <CardContent>
          <Typography>
            Immutable Splits use CREATE2 to determine the Split's address before
            it's actually deployed. The Split must eventually be deployed for
            recipients to withdraw their funds.
          </Typography>
          <Box sx={{ pt: 1, display: 'flex' }}>
            {predictAddress.isLoading ? (
              <CircularProgress />
            ) : (
              <AddressInput
                value={predictAddress.address}
                setValue={(event) => undefined}
                disabled
                placeholder="0xXXXX...XXX"
                cardProps={{ sx: { flexGrow: 1 } }}
              />
            )}
          </Box>
        </CardContent>
      </Card>
      <CardActions sx={{ justifyContent: 'center', mt: 2 }}>
        {isDisconnected ? (
          <Button onClick={() => connect()} label="Connect Wallet" />
        ) : formStatus.loading ? (
          <CircularProgress />
        ) : (
          <Button
            disabled={formStatus.pending || formStatus.loading}
            label="Create Split"
            onClick={createSplit}
          />
        )}
      </CardActions>
    </Container>
  )
}
export default Account
