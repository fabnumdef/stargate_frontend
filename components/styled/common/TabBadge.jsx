import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '0.8125rem',
        border: '1px solid',
        borderRadius: '50%',
        background: 'transparent',
        height: '30px',
        width: '30px'
    },
    smallBadge: {
        marginLeft: 5,
        display: 'flex',
        justifyContent: 'center',
        color: theme.palette.primary.main,
        border: '1px solid',
        borderRadius: '50%',
        height: 15,
        width: 15,
        fontSize: 9
    }
}));

export default function CustomBadge({ select, small, children }) {
    const classes = useStyles(select);
    return <div className={small ? classes.smallBadge : classes.root}>{children}</div>;
}

CustomBadge.propTypes = {
    select: PropTypes.bool,
    small: PropTypes.bool,
    children: PropTypes.number.isRequired
};
CustomBadge.defaultProps = {
    select: false,
    small: false
};
