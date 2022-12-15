import React from 'react'
import {
  ToggleButtonGroupProps as MuiToggleButtonGroupProps,
  default as MuiToggleButtonGroup,
} from '@mui/material/ToggleButtonGroup'
import {
  ToggleButtonProps,
  default as ToggleButton,
} from '@mui/material/ToggleButton/ToggleButton'

export interface ToggleButtonGroupProps extends MuiToggleButtonGroupProps {
  buttonProps?: Omit<ToggleButtonProps, 'value'>
  options: {
    value: any
    children: React.ReactNode
  }[]
}

export const ToggleButtonGroup = ({
  options,
  buttonProps,
  ...rest
}: ToggleButtonGroupProps) => {
  return (
    <MuiToggleButtonGroup {...rest}>
      {options.map((option) => (
        <ToggleButton value={option.value} {...buttonProps}>
          {option.children}
        </ToggleButton>
      ))}
    </MuiToggleButtonGroup>
  )
}

ToggleButtonGroup.defaultProps = {
  color: 'primary',
}
