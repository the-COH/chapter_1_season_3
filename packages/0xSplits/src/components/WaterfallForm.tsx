import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  LinearProgress,
  Stack,
  Typography,
} from '@mui/material'
import * as React from 'react'
import {
  AddressInput,
  Button,
  IconButton,
  ToggleButtonGroup,
  PercentageInput,
} from '@neobase-one/neobase-components'
import { useTheme } from '@mui/material/styles'
import CloseIcon from '@mui/icons-material/Close'
import { ethers } from 'ethers'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'

interface TranchesData {
  start: number
  end: number
  recipientAddress: string
}

export interface WaterfallData {
  permittedToken: string
  tranches: TranchesData[]
}

export const WaterfallForm: React.FC<{
  data: WaterfallData
  setDataHandler: (data: WaterfallData) => void
}> = ({ data, setDataHandler }) => {
  const theme = useTheme()
  const [view, setView] = React.useState<'table' | 'csv'>('table')
  const [sum, setSum] = React.useState(0.0)
  const [empty, setEmpty] = React.useState<any[]>([])
  const handleSetView = (
    event: React.MouseEvent<HTMLElement>,
    newView: 'table' | 'csv' | null,
  ) => {
    if (newView !== null) {
      setView(newView)
    }
  }
  const ensProvider = new ethers.providers.InfuraProvider(
    'homestead',
    process.env.REACT_APP_INFURA_KEY || '',
  )

  // React.useEffect(() => {
  //   const newSum = data.recipients.reduce(
  //     (curr, next) => curr + next.percentAllocation,
  //     0,
  //   )
  //   setSum(newSum)
  // }, [data])
  // React.useEffect(() => {
  //   const newEmpty = data.recipients
  //     .map((recipient, index) =>
  //       recipient.percentAllocation <= 0 ? index : null,
  //     )
  //     .filter((index) => index !== null)
  //   setEmpty(newEmpty)
  // }, [data])

  // const toDistribute = (amount: number, accounts: number) => {
  //   amount = Math.floor(amount * 100)
  //   const split = Math.floor(amount / accounts)
  //   let remaining = amount - split * accounts
  //   let splits = Array(accounts).fill(split)
  //   splits = splits.map((val) => {
  //     if (remaining) {
  //       remaining = remaining - 1
  //       return (val + 1) / 100
  //     }
  //     return val / 100
  //   })
  //   return splits
  // }
  return (
    <Box>
      <Card variant="outlined">
        <CardHeader title="Permitted Token"></CardHeader>
        <Divider />
        <CardContent>
          <Typography variant="caption" color={theme.palette.text.secondary}>
            Each Waterfall can process either ETH or a single ERC20 token.
            Non-permitted tokens sent to this Waterfall can be recovered to any
            of the recipients.
          </Typography>
          <Typography sx={{ pt: 2 }}>Token Address</Typography>
          <Stack>
            <Box sx={{ pt: 2 }} display="flex" flexDirection="row">
              <Box flexGrow={1}>
                {/* // TODO: Add erc20 token validation */}
                <AddressInput
                  value={data.permittedToken}
                  setValue={(event) => {
                    setDataHandler({
                      ...data,
                      permittedToken: data.permittedToken,
                    })
                  }}
                  placeholder="0x0000...000"
                  provider={ensProvider}
                />
              </Box>
              <Button
                sx={{ ml: 2 }}
                label="Clear"
                variant="outlined"
                onClick={() => {
                  // TODO: clear form content onclick
                }}
              />
            </Box>
          </Stack>
        </CardContent>
        {/* TODO: Add erc20 token selector */}
        <Box></Box>
      </Card>
      <Card sx={{ mt: 6 }} variant="outlined">
        <CardHeader title="Tranches"></CardHeader>
        <Divider />
        <CardContent>
          <Typography variant="caption" color={theme.palette.text.secondary}>
            Funds received will be paid out sequentially in Tranches. When one
            Tranches limit has been reached, the excess funds are then paid to
            the subsequent Tranche, and so on.
          </Typography>
          <Stack>
            {data.tranches.map((tranch, index) => (
              <Box
                sx={{ pt: 2 }}
                display="flex"
                flexDirection="row"
                key={index}
              >
                <PercentageInput
                  placeholder="0.00%"
                  value={tranch.start}
                  setValue={(val) => {
                    setDataHandler({ ...data, tranches: data.tranches })
                  }}
                  inputProps={{ sx: { py: 2 } }}
                  sx={{ width: 150, border: 0, px: 2 }}
                  cardProps={{ sx: { ml: 2 } }}
                />
                <PercentageInput
                  placeholder="0.00%"
                  value={tranch.end}
                  setValue={(val) => {
                    setDataHandler({ ...data, tranches: data.tranches })
                  }}
                  inputProps={{ sx: { py: 2 } }}
                  sx={{ width: 150, border: 0, px: 2 }}
                  cardProps={{ sx: { ml: 2 } }}
                />
                <Box flexGrow={1}>
                  <AddressInput
                    value={tranch.recipientAddress}
                    setValue={(val) => {
                      setDataHandler({ ...data, tranches: data.tranches })
                    }}
                    placeholder="0x0000...000"
                    provider={ensProvider}
                    cardProps={{ sx: { ml: 2 } }}
                  />
                </Box>
                <IconButton
                  sx={{ ml: 2 }}
                  startIcon={<CloseIcon />}
                  variant="outlined"
                  onClick={() => {
                    const newTranches = data.tranches
                    newTranches.splice(index, 1)
                    setDataHandler({ ...data, tranches: newTranches })
                  }}
                />
              </Box>
            ))}
          </Stack>
          <Box sx={{ pt: 4, display: 'flex' }}>
            <Typography
              sx={{ ml: 2 }}
              variant="body2"
              color={theme.palette.text.secondary}
            >
              Tip: fill out the Recipients section to estimate when automatic
              payouts will occur.
            </Typography>
          </Box>
        </CardContent>
        <CardActions sx={{ px: 4, pb: 2 }}>
          <Button
            label="Add Tranche"
            variant="outlined"
            onClick={() => {
              const newTranches = data.tranches
              newTranches.push({ start: 0, end: 0, recipientAddress: '' })
              setDataHandler({ ...data, tranches: newTranches })
            }}
            sx={{ mb: 2 }}
          />
          {/* <Button label="Add Donation" variant="outlined" /> */}
        </CardActions>
      </Card>
    </Box>
  )
}
export default WaterfallForm
