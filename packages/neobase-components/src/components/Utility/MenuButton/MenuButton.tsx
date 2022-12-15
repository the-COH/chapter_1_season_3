import React from 'react'
import MenuIcon from '@mui/icons-material/Menu'
import Menu from '@mui/material/Menu'
import MenuItem, {
  MenuItemProps as MuiMenuItemProps,
} from '@mui/material/MenuItem'
import { IconButton, IconButtonProps } from '../../Basic/IconButton/IconButton'
import { ListItemIcon, ListItemText } from '@mui/material'

export interface MenuItemProps extends MuiMenuItemProps {
  label: string
  startIcon?: JSX.Element
}

export interface MenuButtonProps extends IconButtonProps {
  buttons: MenuItemProps[]
  closeOnClick: boolean
}

export const MenuButton = ({
  buttons,
  closeOnClick,
  ...rest
}: MenuButtonProps) => {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null)

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget)
  }

  return (
    <>
      <IconButton onClick={handleOpenNavMenu} {...rest} />
      <Menu
        id="menu-appbar"
        anchorEl={anchorElNav}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        open={Boolean(anchorElNav)}
        onClose={() => setAnchorElNav(null)}
      >
        {buttons.map((button, index) => (
          <MenuItem
            {...button}
            key={index}
            onClick={(event) => {
              if (closeOnClick) {
                setAnchorElNav(null)
              }
              if (button.onClick !== undefined) {
                button.onClick(event)
              }
            }}
          >
            {button.startIcon && (
              <ListItemIcon>{button.startIcon}</ListItemIcon>
            )}
            <ListItemText>{button.label}</ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </>
  )
}

MenuButton.defaultProps = {
  startIcon: <MenuIcon />,
  closeOnClick: true,
}
