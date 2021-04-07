// @flow
import { createMuiTheme } from '@material-ui/core/styles';
import { frFR } from '@material-ui/core/locale';
import red from '@material-ui/core/colors/red';

const palette = {
    primary: {
        main: '#336CFB',
        dark: '#0042c7',
        light: '#799aff'
    },
    secondary: {
        main: '#FBBB33'
    },
    success: {
        main: '#28a745'
    },
    error: {
        main: red.A400
    },
    background: {
        default: '#ffffff',
        layout: '#F7F8FF',
        layoutDark: '#E1E7FC',
        table: '#F6F7FE'
    },
    common: {
        white: '#ffffff',
        yellow: '#FDD835',
        purple: '#A4ABFF',
        grey: 'rgba(0, 0, 0,0.25)'
    }
};

// Create a theme instance.
const theme = createMuiTheme(
    {
        typography: {
            fontFamily: [
                'Marianne',
                '-apple-system',
                'BlinkMacSystemFont',
                '"Lato"',
                'Roboto',
                '"Helvetica Neue"',
                'Arial',
                'sans-serif',
                '"Apple Color Emoji"'
            ].join(',')
        },
        overrides: {
            MuiCssBaseline: {
                '@global': {
                    ul: {
                        padding: 0,
                        margin: 0
                    }
                }
            }
        },
        palette
    },
    frFR
);

export default theme;
