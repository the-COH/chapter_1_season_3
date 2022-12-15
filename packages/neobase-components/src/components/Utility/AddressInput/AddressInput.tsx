import React from 'react'
import {
  Avatar,
  Stack,
  FormHelperText,
  Input,
  InputProps,
  Card,
  CardProps,
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { resolve, EnsData } from '../../../utils'
import { ethers } from 'ethers'
// import Identicon from '@polkadot/react-identicon'

export interface AddressInputProps extends InputProps {
  ensResolve?: boolean
  value: string
  setValue: (value: string) => void
  provider?: any
  dense: boolean
  cardProps?: CardProps
  reDirect?: () => void
  showStatus: boolean
}

export const AddressInput = ({
  ensResolve,
  value,
  setValue,
  provider,
  dense,
  cardProps,
  reDirect,
  showStatus,
  ...rest
}: AddressInputProps) => {
  const theme = useTheme()
  const [ensData, setEnsData] = React.useState<EnsData>()
  const [focused, setFocused] = React.useState(false)
  const [status, setStatus] = React.useState({
    locked: false,
    error: false,
    helperText: 'lol',
  })

  const [edited, setEdited] = React.useState(false)

  React.useEffect(() => {
    if (!edited && value != '') {
      setEdited(true)
    }
    if (ethers.utils.isAddress(value)) {
      if (reDirect !== undefined) {
        reDirect()
      } else {
        setStatus({
          locked: true,
          error: false,
          helperText: 'Valid address',
        })
      }
    } else {
      setStatus({
        locked: false,
        error: true,
        helperText: 'Invalid address',
      })
    }
    const resolveEns = async () => {
      // const newAddress = await provider.resolveName(value)
      const newAddress = await provider.resolveName(value)
      if (newAddress !== null) {
        setValue(newAddress)
      }
    }
    if (provider) {
      resolveEns()
    }
  }, [value])

  React.useEffect(() => {
    const updateEns = async () => {
      const ensData = await resolve(provider, value)
      setEnsData(ensData)
    }
    if (provider) {
      updateEns()
    }
  }, [value])

  return (
    <Card
      {...cardProps}
      sx={{
        borderColor:
          focused || status.locked
            ? theme.palette.primary.main
            : theme.palette.text.disabled,
        borderRadius: 1,
        ...cardProps?.sx,
      }}
      variant="outlined"
    >
      <Stack
        sx={{ width: '100%', px: 2 }}
        spacing={2}
        justifyContent="flex-start"
        alignItems="center"
        direction="row"
      >
        {status.locked &&
          (ensResolve &&
          ensData &&
          ensData.address === value &&
          ensData.avatar !== null ? (
            <Avatar src={ensData.avatar} sx={{ width: 24, height: 24 }} />
          ) : (
            <Avatar sx={{ width: 24, height: 24 }}>
              {/* <Jdenticon size="48" value="Hello World" /> */}
              <img
                src={`https://avatars.dicebear.com/api/identicon/${value}.svg`}
              />
            </Avatar>
          ))}
        <Input
          sx={{
            flexGrow: 1,
          }}
          inputProps={{
            sx: {
              py: dense ? 1 : 2,
            },
            ...rest.inputProps,
          }}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          value={
            !reDirect && ensData && ensData.name && ensData.address === value
              ? ensData.name
              : status.locked
              ? value.slice(0, 6) + '...' + value.slice(-4)
              : value
          }
          disabled={status.locked}
          onChange={
            status.locked
              ? undefined
              : (event) => {
                  setValue(event.target.value)
                }
          }
          {...rest}
          {...status}
        />
        {edited && showStatus && (
          <FormHelperText
            sx={{
              color: status.error
                ? theme.palette.error.main
                : theme.palette.success.main,
            }}
          >
            {status.helperText}
          </FormHelperText>
        )}
      </Stack>
    </Card>
  )
}

AddressInput.defaultProps = {
  label: '',
  variant: 'outlined',
  dense: false,
  ensResolve: true,
  disableUnderline: true,
  showStatus: true,
}
