import React from 'react'
import { Button } from '../../Basic/Button/Button'
import {
  ButtonGroupProps as MuiButtonGroupProps,
  default as MuiButtonGroup,
} from '@mui/material/ButtonGroup'
import { ButtonProps } from '../../Basic/Button/Button'
import { styled } from '@mui/system'
import { IconButton, IconButtonProps } from '../../Basic/IconButton/IconButton'

export interface ButtonGroupProps extends MuiButtonGroupProps {
  buttons?: ButtonProps[]
  iconButtons?: IconButtonProps[]
}

const StyledMuiButtonGroup = styled(MuiButtonGroup)(({ theme }) => ({
  '& .MuiButtonGroup-grouped:not(:last-of-type)': {
    borderRight: 0,
  },
})) as typeof MuiButtonGroup

export const ButtonGroup = ({
  buttons,
  iconButtons,
  ...rest
}: ButtonGroupProps) => {
  return (
    <StyledMuiButtonGroup variant="contained" {...rest}>
      {buttons &&
        buttons.map((button, index) => (
          <Button key={index} {...(rest as ButtonProps)} {...button} />
        ))}
      {iconButtons &&
        iconButtons.map((iconButton, index) => (
          <IconButton
            key={index}
            {...(rest as IconButtonProps)}
            {...iconButton}
            sx={{ border: 0 }}
          />
        ))}
    </StyledMuiButtonGroup>
  )
}

ButtonGroup.defaultProps = {
  variant: 'contained',
}
