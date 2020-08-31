// @flow
import { createMuiTheme } from '@material-ui/core/styles';
import { frFR } from '@material-ui/core/locale';
import red from '@material-ui/core/colors/red';

const palette = {
  primary: {
    main: '#0f4194',
  },
  secondary: {
    main: '#a51c81',
  },
  success: {
    main: '#28a745',
  },
  error: {
    main: red.A400,
  },
  background: {
    default: '#ffffff',
  },
};

// Create a theme instance.
const theme = createMuiTheme(
  {
    typography: {
      fontFamily: [
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ].join(','),
    },
    palette,
    overrides: {
      MuiInputBase: {
        input: {
          height: '0.9em',
        },
      },
      MuiTypography: {
        subtitle1: {
          fontWeight: 'bold',
          fontSize: '1.1rem',
        },
        subtitle2: {
          fontWeight: '300',
          fontSize: '1.1rem',
          lineHeight: '1.8',
          color: '#0f4194',
        },
        body1: {
          fontSize: '0.85rem',
        },
        body2: {
          fontSize: '0.75rem',
        },
        h5: {
          fontSize: '1.35rem',
          fontWeight: 600,
          fontStretch: 'normal',
          lineHeight: 1.32,
          letterSpacing: '0.22px',
        },
      },
      MuiTable: {
        root: {
          overflow: 'auto',
        },
      },
      MuiAppBar: {
        opacity: 0,
        colorPrimary: {
          color: '#000000',
          backgroundColor: '#ffffff',
        },
      },
      MuiTablePagination: {
        root: {
          color: palette.primary.main,
        },
      },
      MuiFormControlLabel: {
        label: {
          fontSize: '0.90rem',
        },
      },
      MuiExpansionPanelDetails: {
        root: {
          padding: {},
        },
      },
      MuiButton: {
        root: {
          lineHeight: '2.65',
          minWidth: '0',
        },
      },
      MuiTableCell: {
        body: {
          color: '#0d40a0',
        },
      },
      MuiTableRow: {
        hover: {
          padding: '0px',
        },
      },
      MuiRadio: {
        root: {
          color: '#0f4194',
          '&$checked': {
            color: '#0f4194',
          },
        },
      },
      MuiAlert: {
        root: {
          borderRadius: '20px',
        },
      },
      MuiInput: {
        underline: {
          '&:before': {
            borderBottom: '1px solid #0f4194',
          },
        },
      },
      MuiOutlinedInput: {
        notchedOutline: {
          borderColor: '#0f4194',
        },
      },
    },
  },
  frFR,
);

export default theme;
