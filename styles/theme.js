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
        main: '#0C09CA'
    },
    success: {
        main: '#28a745'
    },
    warning: {
        main: '#FF9700'
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
                    },
                    table: {
                        backgroundColor: palette.background.table
                    },
                    tbody: {
                        '&::before': {
                            content: '""',
                            display: 'block',
                            height: '20px'
                        }
                    },
                    'table tbody:last-child': {
                        '&::after': {
                            content: '""',
                            display: 'block',
                            height: '20px'
                        }
                    },
                    th: {
                        borderBottom: 'none !important'
                    },
                    'thead tr': {
                        backgroundColor: 'white'
                    },
                    'tbody tr': {
                        backgroundColor: 'white'
                    },
                    'tr td:last-child': {
                        borderTopRightRadius: '10px',
                        borderBottomRightRadius: '10px'
                    },
                    'tr td:first-child': {
                        borderTopLeftRadius: '10px',
                        borderBottomLeftRadius: '10px'
                    }
                }
            },
            MuiTable: {
                stickyHeader: {
                    borderCollapse: 'unset'
                }
            },
            MuiTableRow: {
                root: {
                    '&.MuiTableRow-hover:hover': {
                        backgroundColor: 'white'
                    }
                }
            },
            MuiFilledInput: {
                root: {
                    fontSize: '0.75rem',
                    borderRadius: '4px',
                    backgroundColor: '#F9F9F9'
                },
                multiline: {
                    padding: '20px 12px 20px'
                }
            }
        },
        props: {
            MuiFilledInput: {
                disableUnderline: true
            }
        },
        palette
    },
    frFR
);

export default theme;
