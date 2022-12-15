import React from 'react'
import { CardProps, Card, Input, InputProps } from '@mui/material'
import { useTheme } from '@mui/material/styles'

export interface PercentageInputProps extends InputProps {
  value: number
  setValue: (val: number) => void
  allowZero: boolean
  cardProps?: CardProps
}

export const PercentageInput = ({
  value,
  setValue,
  allowZero,
  inputProps,
  cardProps,
  ...rest
}: PercentageInputProps) => {
  const theme = useTheme()
  const ref = React.useRef(null)
  const [focused, setFocused] = React.useState(false)
  const [cursor, setCursor] = React.useState(0)

  React.useEffect(() => {
    if (ref.current) {
      ;(ref.current as any).setSelectionRange(cursor, cursor) // do something after state has updated
    }
  }, [value, cursor])

  return (
    <Card
      {...cardProps}
      sx={{
        borderColor:
          focused || value > 0 || (allowZero && value >= 0)
            ? theme.palette.primary.main
            : theme.palette.text.disabled,
        borderRadius: 1,
        ...cardProps?.sx,
      }}
      variant="outlined"
    >
      <Input
        value={
          value > 0 || (allowZero && value >= 0)
            ? `${parseFloat(`${value}`).toFixed(2)}%`
            : ''
        }
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onChange={(event) => {
          let newVal = event.target.value
          if (newVal.slice(-1) == '%') {
            newVal = newVal.slice(0, -1)
          }
          const newValNum = parseFloat(parseFloat(newVal).toFixed(2))
          const cursor = event.target.selectionStart
          if (cursor !== null && newValNum <= 100) {
            setCursor(cursor)
            if (!isNaN(newValNum)) {
              setValue(newValNum)
            }
          }
        }}
        inputProps={{
          ref: ref,
          sx: { py: 2 },
          border: 0,
          ...inputProps,
        }}
        {...rest}
      />
    </Card>
  )
}

PercentageInput.defaultProps = {
  variant: 'standard',
  disableUnderline: true,
  allowZero: false,
}
