import { withStyles } from '@material-ui/core/styles';
import Tab from '@material-ui/core/Tab';
import { fade } from '@material-ui/core/styles/colorManipulator';

const AntTab = withStyles((theme) => ({
    root: {
        textTransform: 'none',
        color: 'rgba(0, 0, 0, 0.25)',
        fontSize: '0.875rem',
        minWidth: 150,
        marginRight: theme.spacing(5),
        '&:hover': {
            opacity: 1,
            color: theme.palette.primary.main,
            backgroundColor: fade(theme.palette.primary.main, 0.05)
        },
        '&$selected': {
            color: theme.palette.primary.main,
            fontWeight: 'bold',
            backgroundColor: fade(theme.palette.primary.main, 0)
        },
        borderColor: theme.palette.primary.main,
        borderRadius: '5%'
    },
    selected: {},
    wrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    }
    // Many props needed by Material-UI
    // eslint-disable-next-line react/jsx-props-no-spreading
}))((props) => <Tab disableRipple {...props} />);

export default AntTab;
