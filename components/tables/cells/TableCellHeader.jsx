// we use spreading because we dont know explicit props will be used
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import TableCell from '@material-ui/core/TableCell';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';

const StyledTableCell = withStyles(() => ({}))(TableCell);

export default function CustomTableCell({ children, style, ...others }) {
    return (
        <StyledTableCell
            {...others}
            style={{
                ...style,
                fontWeight: 'bold',
                fontSize: '0.875rem'
            }}>
            {children}
        </StyledTableCell>
    );
}

CustomTableCell.propTypes = {
    children: PropTypes.node,
    style: PropTypes.object
};

CustomTableCell.defaultProps = {
    children: '',
    style: {}
};
