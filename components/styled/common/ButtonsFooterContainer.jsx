import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
    buttonsFooter: {
        backgroundColor: theme.palette.background.default,
        position: 'fixed',
        boxShadow: '0px -10px 20px #E7E7E7',
        width: '100%',
        height: '80px',
        right: 0,
        bottom: '0'
    },
    divButtons: {
        position: 'absolute',
        right: '15%',
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '20px',
        width: '270px'
    }
}));

export default function ButtonsFooterContainer({ children }) {
    const classes = useStyles();
    return (
        <div className={classes.buttonsFooter}>
            <div className={classes.divButtons}>{children}</div>
        </div>
    );
}

ButtonsFooterContainer.propTypes = {
    children: PropTypes.node.isRequired
};
