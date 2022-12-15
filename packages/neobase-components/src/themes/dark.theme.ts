import { createTheme, responsiveFontSizes } from '@mui/material'

export const darkTheme = responsiveFontSizes(
  createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: '#ad8a27',
      },
      secondary: {
        main: '#775a12',
      },
    },
    // typography: {
    //   fontSize: 12,
    // },
  }),
)
