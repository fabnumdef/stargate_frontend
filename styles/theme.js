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
        default: '#ffffff'
    },
    common: {
        white: '#ffffff'
    }
};

// Create a theme instance.
const theme = createMuiTheme(
    {
        typography: {
            fontFamily: [
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
        palette
    },
    frFR
);

export default theme;
