import { createTheme, responsiveFontSizes } from '@mui/material'

export const lightTheme = responsiveFontSizes(
  createTheme({
    palette: {
      mode: 'light',
      primary: {
        main: '#ad8a27',
      },
      secondary: {
        main: '#775a12',
      },
    },
  }),
)
