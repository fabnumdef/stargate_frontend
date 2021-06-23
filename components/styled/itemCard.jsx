import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import classNames from 'classnames';

const useStyles = makeStyles((theme) => ({
    cardStyle: {
        margin: '13px 10px 0 0',
        backgroundColor: 'white',
        width: '140px',
        height: '40px',
        borderRadius: '8px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        textAlign: 'center'
    },
    clickable: {
        border: `solid 1px ${theme.palette.primary.main}`,
        color: theme.palette.primary.main,
        cursor: 'pointer',
        '&:hover': {
            transition: '.5s',
            backgroundColor: theme.palette.background.layoutDark
        }
    },
    unclickable: {
        border: 'solid 0.3px rgba(0, 0, 0, 0.4)',
        boxShadow: '0 2px 10px 0 rgba(93, 119, 255, 0.1)'
    }
}));

const ItemCard = ({ children, style, clickable }) => {
    const classes = useStyles();
    return (
        <div
            className={classNames(
                classes.cardStyle,
                clickable ? classes.clickable : classes.unclickable
            )}
            style={{ ...style }}>
            <div>{children}</div>
        </div>
    );
};

ItemCard.defaultProps = {
    opacity: 1,
    clickable: false
};

ItemCard.propTypes = {
    children: PropTypes.node.isRequired,
    style: PropTypes.object,
    clickable: PropTypes.bool
};

export default ItemCard;
