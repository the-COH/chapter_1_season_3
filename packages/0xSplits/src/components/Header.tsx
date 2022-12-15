import * as React from 'react'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Container from '@mui/material/Container'
import Modal from '@mui/material/Modal'
import { matchPath, useLocation, useNavigate } from 'react-router-dom'
import { ColorModeContext } from '../context'
import {
  ThemeToggle,
  MenuButton,
  Button,
  ButtonGroup,
  IconButton,
  AddressInput,
} from '@neobase-one/neobase-components'
import HomeIcon from '@mui/icons-material/Home'
import CallSplitIcon from '@mui/icons-material/CallSplit'
import WaterfallChartIcon from '@mui/icons-material/WaterfallChart'
import DocumentScannerIcon from '@mui/icons-material/DocumentScanner'
import LogoutIcon from '@mui/icons-material/Logout'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import { MenuItemProps } from '@neobase-one/neobase-components/lib/components/Utility/MenuButton/MenuButton'
import { IconButtonProps } from '@neobase-one/neobase-components/lib/components/Basic/IconButton/IconButton'
import SearchIcon from '@mui/icons-material/Search'
import { ethers } from 'ethers'
import { isAddress } from 'ethers/lib/utils.js'

const style = {
  position: 'absolute',
  top: '12%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
}

const Header: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const colorMode = React.useContext(ColorModeContext)
  const [openSearch, setOpenSearch] = React.useState<boolean>(false)
  const [searchAddress, setSearchAddress] = React.useState<string>('')

  const theme = useTheme()
  const desktopView = useMediaQuery(theme.breakpoints.up('sm'))

  const { address, isConnected } = useAccount()
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  })
  const { disconnect } = useDisconnect()
  const ensProvider = new ethers.providers.InfuraProvider(
    'homestead',
    process.env.REACT_APP_INFURA_KEY || '',
  )

  const pages = [
    { label: 'Home', link: '/', startIcon: <HomeIcon /> },
    { label: 'New split', link: '/split', startIcon: <CallSplitIcon /> },
    {
      label: 'New waterfall',
      link: '/waterfall',
      startIcon: <WaterfallChartIcon />,
    },
    { label: 'Explore', link: '/explore', startIcon: <DocumentScannerIcon /> },
  ]

  const menuInput = pages.map(
    (page) =>
      ({
        ...page,
        disabled: matchPath(location.pathname, page.link) !== null,
        onClick: () => navigate(page.link),
      } as MenuItemProps),
  )

  const butttonGroupInput = pages.map(
    (page) =>
      ({
        ...page,
        onClick: () => navigate(page.link),
        toolTipProps: { title: page.label },
        color:
          matchPath(location.pathname, page.link) !== null
            ? theme.palette.mode == 'light'
              ? 'secondary'
              : 'primary'
            : 'inherit',
        sx: {
          borderRight: 0,
          textTransform: 'none',
        },
        variant: 'text',
      } as IconButtonProps),
  )

  React.useEffect(() => {
    if (!openSearch && isAddress(searchAddress)) {
      navigate(`/accounts/${searchAddress}`)
      setSearchAddress('')
    }
  }, [openSearch])

  return (
    <Box>
      <Modal
        open={openSearch}
        onClose={() => {
          // setSearchAddress('')
          setOpenSearch(false)
        }}
        keepMounted={true}
      >
        <Box sx={style}>
          <AddressInput
            value={searchAddress}
            setValue={(event) => {
              setSearchAddress(event)
            }}
            showStatus={false}
            placeholder="0x0000...000"
            provider={ensProvider}
            reDirect={() => {
              setOpenSearch(false)
            }}
            cardProps={{ sx: { borderColor: 'inherit' } }}
          />
        </Box>
      </Modal>
      <AppBar
        position="static"
        sx={{
          boxShadow: 'none',
          borderRadius: 0,
          py: -1,
        }}
      >
        <Container maxWidth={false}>
          <Toolbar disableGutters>
            {desktopView ? (
              <ButtonGroup
                iconButtons={butttonGroupInput}
                sx={{ boxShadow: 0 }}
              />
            ) : (
              <MenuButton
                buttons={menuInput}
                color="secondary"
                sx={{ color: 'white' }}
              />
            )}
            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ flexGrow: 0, px: 2 }}>
              <IconButton
                onClick={() => setOpenSearch(true)}
                color="secondary"
                sx={{ color: 'white' }}
                startIcon={<SearchIcon sx={{ color: 'white' }} />}
              />
              <ThemeToggle
                onClick={colorMode.toggleColorMode}
                sx={{ color: 'white' }}
                color="secondary"
              />
            </Box>
            <Box
              sx={{
                flexGrow: 0,
                display: 'flex',
              }}
            >
              {isConnected && address ? (
                <Button
                  label={address.slice(0, 6) + '...' + address.slice(-4)}
                  endIcon={<LogoutIcon />}
                  variant="contained"
                  color={
                    theme.palette.mode == 'light' ? 'secondary' : 'primary'
                  }
                  sx={{
                    textTransform: 'none',
                    width: '160px',
                  }}
                  onClick={() => {
                    disconnect()
                  }}
                />
              ) : (
                <Button
                  label="Connect Wallet"
                  // endIcon={<LogoutIcon />}
                  variant="contained"
                  color={
                    theme.palette.mode == 'light' ? 'secondary' : 'primary'
                  }
                  sx={{
                    textTransform: 'none',
                    width: '160px',
                  }}
                  onClick={() => {
                    connect()
                  }}
                />
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </Box>
  )
}
export default Header
