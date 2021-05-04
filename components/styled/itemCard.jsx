import React from 'react';
import PropTypes from 'prop-types';

const cardStyle = {
    border: 'solid 1px #0e4194',
    padding: 5,
    margin: 20,
    backgroundColor: 'white',
    width: '130px',
    height: '70px',
    borderRadius: '3px',
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
