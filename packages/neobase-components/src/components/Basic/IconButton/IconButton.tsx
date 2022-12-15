import React, { ReactNode } from 'react'
import {
  TooltipProps,
  Tooltip as MuiToolTip,
  Button as MuiButton,
  ButtonProps as MuiButtonProps,
} from '@mui/material'
import { styled } from '@mui/system'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'

export interface IconButtonProps extends MuiButtonProps {
  startIcon?: ReactNode
  toolTipProps?: Omit<TooltipProps, 'children'>
}

const StyledButton = styled(MuiButton)(({ theme }) => ({
  '& .MuiButton-startIcon': {
    margin: 0,
  },
  minWidth: 'auto',
})) as typeof MuiButton

export const IconButton = ({
  startIcon,
  toolTipProps,
  ...rest
}: IconButtonProps) => (
  <MuiToolTip
    title={toolTipProps === undefined ? '' : toolTipProps.title}
    {...toolTipProps}
  >
    <StyledButton startIcon={startIcon} {...rest}></StyledButton>
  </MuiToolTip>
)

IconButton.defaultProps = {
  variant: 'text',
  size: 'medium',
  color: 'primary',
  startIcon: <AddCircleOutlineIcon />,
}
