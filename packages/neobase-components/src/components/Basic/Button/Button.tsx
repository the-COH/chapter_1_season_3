import React from 'react'
import {
  Button as MuiButton,
  ButtonProps as MuiButtonProps,
  TooltipProps,
  Tooltip as MuiToolTip,
} from '@mui/material'
import { styled } from '@mui/system'

// Only include variant, size, color from MuiButtonProps
// type ButtonBaseProps = Pick<MuiButtonProps, "variant" | "size" | "color">;

// Include everything from MuiButtonProps except disableRipple
// type ButtonBaseProps = Omit<MuiButtonProps, "disableRipple">;

export interface ButtonProps extends MuiButtonProps {
  label: string
  toolTipProps?: Omit<TooltipProps, 'children'>
}

// const StyledButton = styled(MuiButton)(({ theme }) => ({
//   borderRadius: 0,
// })) as typeof MuiButton

export const Button = ({ label, toolTipProps, ...rest }: ButtonProps) => (
  <MuiToolTip
    title={toolTipProps === undefined ? '' : toolTipProps.title}
    {...toolTipProps}
  >
    <MuiButton {...rest}>{label}</MuiButton>
  </MuiToolTip>
)

Button.defaultProps = {
  variant: 'contained',
  size: 'medium',
  color: 'primary',
}
