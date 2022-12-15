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

interface RecipientsData {
  address: string
  percentAllocation: number
}

export interface SplitsData {
  recipients: RecipientsData[]
  distributorFeePercent: number
  controller?: string
}

export const SplitsForm: React.FC<{
  data: SplitsData
  setDataHandler: (data: SplitsData) => void
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

  React.useEffect(() => {
    const newSum = data.recipients.reduce(
      (curr, next) => curr + next.percentAllocation,
      0,
    )
    setSum(newSum)
  }, [data])
  React.useEffect(() => {
    const newEmpty = data.recipients
      .map((recipient, index) =>
        recipient.percentAllocation <= 0 ? index : null,
      )
      .filter((index) => index !== null)
    setEmpty(newEmpty)
  }, [data])

  const toDistribute = (amount: number, accounts: number) => {
    amount = Math.floor(amount * 100)
    const split = Math.floor(amount / accounts)
    let remaining = amount - split * accounts
    let splits = Array(accounts).fill(split)
    splits = splits.map((val) => {
      if (remaining) {
        remaining = remaining - 1
        return (val + 1) / 100
      }
      return val / 100
    })
    return splits
  }
  return (
    <Box>
      <Card variant="outlined">
        <CardHeader
          title="Recipients"
          action={
            <ToggleButtonGroup
              value={view}
              exclusive
              onChange={handleSetView}
              fullWidth
              color="primary"
              sx={{ minWidth: 200, pr: 2 }}
              options={[
                {
                  value: 'table',
                  children: 'Table View',
                },
                {
                  value: 'csv',
                  children: 'CSV Upload',
                },
              ]}
              buttonProps={{
                sx: {
                  textTransform: 'none',
                  p: 0,
                },
              }}
            />
          }
        ></CardHeader>
        <Divider />
        <CardContent>
          <Typography>
            Enter each recipient's address and their share. Ownership must add
            to 100%.
          </Typography>
          <Stack>
            {data.recipients.map((accountInfo, index) => (
              <Box
                sx={{ pt: 2 }}
                display="flex"
                flexDirection="row"
                key={index}
              >
                <Box flexGrow={1}>
                  <AddressInput
                    value={accountInfo.address}
                    setValue={(event) => {
                      const newRecipients = data.recipients
                      newRecipients[index].address = event
                      setDataHandler({ ...data, recipients: newRecipients })
                    }}
                    placeholder="0x0000...000"
                    provider={ensProvider}
                  />
                </Box>
                <PercentageInput
                  placeholder="0.00%"
                  value={accountInfo.percentAllocation}
                  setValue={(val) => {
                    const newRecipients = data.recipients
                    newRecipients[index].percentAllocation = Math.max(
                      0,
                      Math.min(100, val),
                    )
                    setDataHandler({ ...data, recipients: newRecipients })
                  }}
                  inputProps={{ sx: { py: 2 } }}
                  sx={{ width: 200, border: 0, px: 2 }}
                  cardProps={{ sx: { ml: 2 } }}
                />
                <IconButton
                  sx={{ ml: 2 }}
                  startIcon={<CloseIcon />}
                  variant="outlined"
                  onClick={() => {
                    const newRecipients = data.recipients
                    newRecipients.splice(index, 1)
                    setDataHandler({ ...data, recipients: newRecipients })
                  }}
                />
              </Box>
            ))}
          </Stack>
        </CardContent>
        <CardActions sx={{ px: 4, pb: 2 }}>
          <Button
            label="Add Recipient"
            variant="outlined"
            onClick={() => {
              const newRecipients = data.recipients
              newRecipients.push({ address: '', percentAllocation: 0 })
              setDataHandler({ ...data, recipients: newRecipients })
            }}
          />
          {/* <Button label="Add Donation" variant="outlined" /> */}
          <Box flexGrow={1}></Box>
          <Button
            label="Split Remaining"
            variant="outlined"
            disabled={empty.length === 0}
            onClick={() => {
              if (empty.length) {
                const splits = toDistribute(
                  parseFloat((100 - sum).toFixed(2)),
                  empty.length,
                )
                const newRecipients = data.recipients
                empty.forEach(
                  (index, key) =>
                    (newRecipients[index].percentAllocation = splits[key]),
                )
                setDataHandler({ ...data, recipients: newRecipients })
              }
            }}
          />
          <Button
            label="Split Evenly"
            variant="outlined"
            onClick={() => {
              const splits = toDistribute(100, data.recipients.length)
              console.log(splits)
              const newRecipients = data.recipients.map((recipient, index) => {
                recipient.percentAllocation = splits[index]
                return recipient
              })
              setDataHandler({ ...data, recipients: newRecipients })
            }}
          />
        </CardActions>
        <Box sx={{ px: 4, pt: 2, pb: 1 }}>
          <LinearProgress
            variant="determinate"
            value={sum}
            color={sum > 100 ? 'error' : 'primary'}
            sx={{ height: 10, borderRadius: 5 }}
          />
        </Box>
        <Box sx={{ pb: 2, px: 4 }} display="flex">
          <Typography color="secondary">{`${sum}% Allocated`}</Typography>
          <Box flexGrow={1}></Box>
          {sum < 100 && (
            <Typography color="secondary">{`${(100 - sum).toFixed(
              2,
            )}% Remaining`}</Typography>
          )}
        </Box>
      </Card>
      <Card sx={{ mt: 6 }} variant="outlined">
        <CardHeader title="Distribution Incentive"></CardHeader>
        <Divider />
        <CardContent>
          <Typography>
            Set the portion of the Split's balance that is paid to any bot or
            third party that distributes the balance to recipients. A higher
            incentive leads to more frequent distributions.
          </Typography>
          <Box sx={{ pt: 4, display: 'flex' }}>
            <IconButton
              sx={{ p: 2.4, height: '100%' }}
              variant="outlined"
              onClick={() => {
                let newVal = data.distributorFeePercent - 0.05
                newVal = Math.max(newVal, 0)
                newVal = parseFloat(newVal.toFixed(2))
                setDataHandler({
                  ...data,
                  distributorFeePercent: newVal,
                })
              }}
              startIcon={<RemoveIcon />}
            />
            <PercentageInput
              placeholder="0.00%"
              value={data.distributorFeePercent}
              setValue={(val) => {
                val = Math.min(10, val)
                val = Math.max(0, val)
                setDataHandler({ ...data, distributorFeePercent: val })
              }}
              inputProps={{ sx: { py: 2 } }}
              sx={{ width: 200, px: 2 }}
              cardProps={{ sx: { mx: 2, height: 'fit-content' } }}
              allowZero={true}
            />
            <IconButton
              sx={{ p: 2.4, height: '100%' }}
              variant="outlined"
              onClick={() => {
                let newVal = data.distributorFeePercent + 0.05
                newVal = Math.min(10, newVal)
                newVal = parseFloat(newVal.toFixed(2))
                setDataHandler({
                  ...data,
                  distributorFeePercent: newVal,
                })
              }}
              startIcon={<AddIcon />}
            />
            <Typography
              sx={{ ml: 2 }}
              variant="body2"
              color={theme.palette.text.secondary}
            >
              Tip: fill out the Recipients section to estimate when automatic
              payouts will occur
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}
export default SplitsForm
