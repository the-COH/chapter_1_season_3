import React from 'react'
import { CardProps, Card, Input, InputProps, Box } from '@mui/material'
import { useTheme } from '@mui/material/styles'

export interface NumberInputProps extends InputProps {
  value: number
  setValue: (val: number) => void
  error?: boolean
  cardProps?: CardProps
}

export const NumberInput = ({
  value,
  setValue,
  error,
  inputProps,
  cardProps,
  ...rest
}: NumberInputProps) => {
  const theme = useTheme()
  const [focused, setFocused] = React.useState(false)

  return (
    <Card
      {...cardProps}
      sx={{
        borderColor: error
          ? 'red'
          : focused || value > 0
          ? theme.palette.primary.main
          : theme.palette.text.disabled,
        borderRadius: 1,
        ...cardProps?.sx,
      }}
      variant="outlined"
    >
      <Input
        value={value > 0 ? value : ''}
        type={'number'}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onChange={(event) => {
          setValue(Number(event.target.value))
        }}
        inputProps={{
          sx: { py: 2 },
          border: 0,
          ...inputProps,
        }}
        {...rest}
      />
    </Card>
  )
}

NumberInput.defaultProps = {
  variant: 'standard',
  disableUnderline: true,
}
