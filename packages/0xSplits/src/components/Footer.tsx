import * as React from 'react'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Container from '@mui/material/Container'
import { Typography } from '@mui/material'

const Footer: React.FC = () => {
  return (
    <Box sx={{ pt: 6 }}>
      <AppBar
        position="static"
        sx={{
          boxShadow: 'none',
        }}
      >
        <Container maxWidth="xl">
          <Toolbar
            disableGutters
            sx={{ display: { xs: 'none', md: 'flex' } }}
            variant="dense"
          >
            <Box
              sx={{
                flexGrow: 1,
                display: { xs: 'none', md: 'inline' },
                textAlign: 'center',
              }}
            >
              <Typography fontSize={'small'}>Powered by Neobase</Typography>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </Box>
  )
}
export default Footer
