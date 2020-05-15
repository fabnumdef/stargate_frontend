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

export default function CustomTableCell({ children }) {
  return (
    <StyledTableCell>
      {children}
    </StyledTableCell>
  );
}

CustomTableCell.propTypes = {
  children: PropTypes.node.isRequired,
};
