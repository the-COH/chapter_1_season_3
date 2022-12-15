import React from 'react'
import Brightness4Icon from '@mui/icons-material/Brightness4'
import Brightness7Icon from '@mui/icons-material/Brightness7'
import { useTheme } from '@mui/material/styles'
import { IconButton, IconButtonProps } from '../../Basic/IconButton/IconButton'

type ToggleProps = Omit<IconButtonProps, 'startIcon'>

export const ThemeToggle = (toggleProps: ToggleProps) => {
  const theme = useTheme()
  return (
    <IconButton
      {...toggleProps}
      startIcon={
        theme.palette.mode === 'dark' ? (
          <Brightness4Icon />
        ) : (
          <Brightness7Icon />
        )
      }
    ></IconButton>
  )
}
