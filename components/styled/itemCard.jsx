import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
    cardStyle: {
        border: 'solid 0.3px rgba(0, 0, 0, 0.4)',
        margin: '13px 10px 0 0',
        backgroundColor: 'white',
        width: '140px',
        height: '40px',
        borderRadius: '8px',
        boxShadow: '0 2px 10px 0 rgba(93, 119, 255, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        textAlign: 'center'
    }
}));

const ItemCard = ({ children, style }) => {
    const classes = useStyles();
    return (
        <div className={classes.cardStyle} style={{ ...style }}>
            <div>{children}</div>
        </div>
    );
};

ItemCard.defaultProps = {
    opacity: 1
};

ItemCard.propTypes = {
    children: PropTypes.node.isRequired,
    style: PropTypes.object
};

export default ItemCard;
