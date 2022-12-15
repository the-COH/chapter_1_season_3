import React from 'react'
import {
  Avatar,
  Box,
  Button,
  Stack,
  StackProps,
  Typography,
  ButtonProps as MuiButtonProps,
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { MenuButton, MenuItemProps } from '../MenuButton/MenuButton'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { resolve, EnsData } from '../../../utils'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import { ButtonGroup } from '../ButtonGroup/ButtonGroup'
import { IconButtonProps } from '../../Basic/IconButton/IconButton'

export interface AccountInfoProps extends Omit<StackProps, 'onClick'> {
  address: string
  subinfo?: string
  amount?: string
  ensResolve?: boolean
  avatarSrc?: string
  showAvatar?: boolean
  showMenu?: boolean
  showButtonGroup?: boolean
  copyAddress?: boolean
  openExplorer?: boolean
  expandOnHover?: boolean
  menuButtons?: MenuItemProps[]
  iconButtons?: IconButtonProps[]
  dense?: boolean
  truncate?: boolean
  provider?: any
  buttonProps?: MuiButtonProps
}

export const AccountInfo = ({
  address,
  subinfo,
  amount,
  menuButtons,
  iconButtons,
  ensResolve,
  avatarSrc,
  showAvatar,
  showMenu,
  showButtonGroup,
  expandOnHover,
  copyAddress,
  openExplorer,
  dense,
  truncate,
  provider,
  buttonProps,
  ...rest
}: AccountInfoProps) => {
  const [hovering, setHovering] = React.useState(false)
  const [ensData, setEnsData] = React.useState<EnsData>()
  const theme = useTheme()
  React.useEffect(() => {
    const updateEns = async () => {
      const ensData = await resolve(provider, address)
      setEnsData(ensData)
    }
    if (provider) {
      updateEns()
    }
  }, [address])
  const defaultButtons = [
    ...(copyAddress
      ? [
          {
            label: 'Copy Address',
            onClick: () => navigator.clipboard.writeText(address),
            startIcon: <ContentCopyIcon />,
          },
        ]
      : []),
    ...(openExplorer
      ? [
          {
            label: 'Open Explorer',
            onClick: () =>
              window.open(
                'https://evm.explorer.canto.io/address/' + address,
                '_blank',
              ),
            startIcon: <OpenInNewIcon />,
          },
        ]
      : []),
  ]
  const avatarSize = dense ? 24 : 32
  return (
    <Stack
      sx={{ width: '100%' }}
      spacing={2}
      justifyContent="flex-start"
      alignItems="center"
      direction="row"
      {...rest}
    >
      <Button
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        {...buttonProps}
        sx={{
          flex: '1 1 auto',
          textAlign: 'left',
          display: 'flex',
          textTransform: 'none',
          py: dense ? 1 : 2,
          pl: 2,
          cursor: buttonProps?.onClick !== undefined ? 'pointer' : 'default',
          ...buttonProps?.sx,
        }}
      >
        {showAvatar &&
          (ensResolve && ensData && ensData.avatar !== null ? (
            <Avatar
              src={ensData.avatar}
              sx={{ width: avatarSize, height: avatarSize }}
            />
          ) : avatarSrc ? (
            <Avatar sx={{ width: avatarSize, height: avatarSize }}>
              <img
                src={avatarSrc}
                width={avatarSize + 8}
                height={avatarSize + 8}
              />
            </Avatar>
          ) : (
            <Avatar sx={{ width: avatarSize, height: avatarSize }}>
              <img
                src={`https://avatars.dicebear.com/api/identicon/${address}.svg`}
              />
            </Avatar>
          ))}
        <Box
          sx={{
            px: showAvatar ? 2 : 0,
            flexGrow: 1,
            width: '100px',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Typography variant="body1" noWrap>
            {expandOnHover && hovering
              ? address
              : ensResolve && ensData && ensData.name !== null
              ? ensData.name
              : truncate
              ? address.slice(0, 5) + '...' + address.slice(-4)
              : address}
          </Typography>
          {subinfo && (
            <Typography variant="caption" color={theme.palette.text.secondary}>
              {subinfo}
            </Typography>
          )}
        </Box>
        {amount && (
          <Typography variant="body1" color={theme.palette.text.secondary}>
            {amount}
          </Typography>
        )}
      </Button>
      {showButtonGroup && (
        <ButtonGroup
          sx={{ boxShadow: 0 }}
          iconButtons={[...defaultButtons, ...(iconButtons ? iconButtons : [])]}
          variant="text"
        />
      )}
      {showMenu && (
        <MenuButton
          buttons={[...defaultButtons, ...(menuButtons ? menuButtons : [])]}
          startIcon={<MoreVertIcon />}
        />
      )}
    </Stack>
  )
}

AccountInfo.defaultProps = {
  ensResolve: true,
  showAvatar: true,
  showMenu: true,
  copyAddress: true,
  openExplorer: true,
  expandOnHover: true,
  truncate: true,
}
