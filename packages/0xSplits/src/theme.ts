import { darkTheme, lightTheme } from '@neobase-one/neobase-components'
import { createTheme } from '@mui/material/styles'

const [customDarkThemeBase, customLightThemeBase] = [darkTheme, lightTheme].map(
  (theme) =>
    createTheme(theme, {
      spacing: (factor: any) => `${0.25 * factor}rem`,
      palette: {
        // divider: 'grey',
      },
      components: {
        MuiCardHeader: {
          styleOverrides: {
            title: {
              fontSize: darkTheme.typography.h6.fontSize,
            },
          },
        },
        MuiPaper: {
          styleOverrides: {
            outlined: {
              // borderRadius: 10,
              // borderColor: 'grey',
            },
            root: {
              borderRadius: 10,
              // borderColor: 'grey',
            },
          },
        },
        MuiToggleButton: {
          styleOverrides: {
            root: {
              textTransform: 'none',
            },
          },
        },
      },
    }),
)

export const customDarkTheme = createTheme(customDarkThemeBase, {
  // palette: {
  //     secondary: {
  //         main: '#050505',
  //     },
  // },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: '#121212',
        },
      },
    },
  },
})

export const customLightTheme = createTheme(customLightThemeBase, {
  // palette: {
  //     secondary: {
  //         main: '#050505',
  //     },
  // },
})
