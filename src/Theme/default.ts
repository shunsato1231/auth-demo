import { createTheme } from '@mui/material/styles'


export default createTheme({
  palette: {
		common: {
			black: "rgba(51, 51, 51, 1)",
			white: "#fff"
		},
		background: {
			paper: "#fff",
			default: "#fafafa"
		},
		primary: {
			light: "#85b0ff",
			main: "#387df6",
			dark: "#2e5ca9",
			contrastText: "#fff"
		},
		secondary: {
			light: "#f5d846",
			main: "#ffd505",
			dark: "#d6b307",
			contrastText: "#fff"
		},
		error: {
			light: "rgba(246, 131, 140, 1)",
			main: "rgba(235, 22, 48, 1)",
			dark: "rgba(182, 11, 31, 1)",
			contrastText: "#fff"
		},
		text: {
			primary: "rgba(51, 51, 51, 1)",
			secondary: "rgba(51, 51, 51, 0.54)",
			disabled: "rgba(51, 51, 51, 0.38)",
		}
	},
  typography: {
    button: {
        textTransform: "none"
    }
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
    },
    MuiCheckbox: {
      defaultProps: {
        color: "primary"
      },
    },
    MuiRadio: {
      defaultProps: {
        color: "primary"
      },
    },
    MuiSwitch: {
      defaultProps: {
        color: "primary"
      }
    },
  }
})