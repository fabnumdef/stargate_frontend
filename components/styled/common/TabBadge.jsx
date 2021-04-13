import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

const useStyles = makeStyles(() => ({
    root: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        border: '1px solid',
        borderRadius: '50%',
        background: 'transparent',
        height: '25px',
        width: '25px'
    }
}));

export default function CustomBadge({ select, children }) {
    const classes = useStyles(select);
    return <div className={classes.root}>{children}</div>;
}

CustomBadge.propTypes = {
    select: PropTypes.bool,
    children: PropTypes.number.isRequired
};
CustomBadge.defaultProps = {
    select: false
};
