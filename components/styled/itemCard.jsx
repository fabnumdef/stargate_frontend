import React from 'react';
import PropTypes from 'prop-types';

const cardStyle = {
    border: 'solid 0.3px rgba(0, 0, 0, 0.4)',
    padding: 10,
    margin: '13px 10px 0 0',
    backgroundColor: 'white',
    width: '140px',
    height: '40px',
    borderRadius: '8px',
    boxShadow: '0 2px 10px 0 rgba(93, 119, 255, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'center'
};

const ItemCard = ({ children, style }) => {
    return <div style={{ ...cardStyle, ...style }}>{children}</div>;
};

ItemCard.defaultProps = {
    opacity: 1
};

ItemCard.propTypes = {
    children: PropTypes.node.isRequired,
    style: PropTypes.object
};

export default ItemCard;
