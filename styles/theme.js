// @flow
import { createMuiTheme } from '@material-ui/core/styles';
import { frFR } from '@material-ui/core/locale';
import red from '@material-ui/core/colors/red';

// Create a theme instance.
const theme = createMuiTheme(
  {
    palette: {
      primary: {
        main: '#0f4194',
      },
      secondary: {
        main: '#a51c81',
      },
      error: {
        main: red.A400,
      },
      background: {
        default: '#ffffff',
      },
    },
    overrides: {
      MuiInputBase: {
        input: {
          height: '0.9em',
        },
      },
      MuiTypography: {
        title: {
          fontSize: '1.6rem',
        },
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
      },
      MuiAppBar: {
        colorPrimary: {
          color: '#000000',
          backgroundColor: '#ffffff',
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
