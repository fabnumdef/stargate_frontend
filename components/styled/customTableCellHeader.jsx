// we use spreading because we dont know explicit props will be used
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import TableCell from '@material-ui/core/TableCell';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import { fade } from '@material-ui/core/styles/colorManipulator';

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: fade(theme.palette.primary.main, 0.05),
    color: theme.palette.primary.main,
  },
}))(TableCell);

export default function CustomTableCell({ children, style, ...others }) {
  return (
    <StyledTableCell
      {...others}
      style={{
        ...style,
        fontWeight: '600',
        fontSize: '0.9rem',
      }}
    >
      {children}
    </StyledTableCell>
  );
}

CustomTableCell.propTypes = {
  children: PropTypes.node,
  style: PropTypes.oneOf(PropTypes.object),
};

CustomTableCell.defaultProps = {
  children: '',
  style: {},
};
