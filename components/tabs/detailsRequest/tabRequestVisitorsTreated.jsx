import React from 'react';
import PropTypes from 'prop-types';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { format } from 'date-fns';
import CustomTableCell from '../../styled/customTableCellHeader';

import { EMPLOYEE_TYPE, VISITOR_STATUS } from '../../../utils/constants/enums';

function createData({
  id, firstname, birthLastname, state, rank, company, employeeType,
}) {
  return {
    id,
    visitor: rank
      ? `${rank} ${birthLastname.toUpperCase()} ${firstname}`
      : `${birthLastname.toUpperCase()} ${firstname}`,
    company,
    type: EMPLOYEE_TYPE[employeeType],
    date: format(new Date(state.validationDate), "dd/MM/yyyy à k'h'mm"),
    status: VISITOR_STATUS[state.value],
  };
}

const columns = [
  { id: 'visitor', label: 'Visiteur(s)' },
  { id: 'company', label: 'Unité/Société' },
  { id: 'type', label: 'Type' },
  { id: 'date', label: 'Date de traitement' },
  { id: 'status', label: 'Status' },
];

export default function TabRequestVisitors({ visitors }) {
  const rows = visitors.reduce((acc, vis) => {
    acc.push(createData(vis));
    return acc;
  }, []);

  return (
    <Table stickyHeader aria-label="sticky table">
      <TableHead>
        <TableRow>
          {columns.map((column) => (
            <CustomTableCell key={column.id} align={column.align}>
              {column.label}
            </CustomTableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map((row) => (
          <TableRow
            role="checkbox"
            tabIndex={-1}
            key={row.id}
          >
            {columns.map((column) => {
              const value = row[column.id];
              return (
                <TableCell key={column.id} align={column.align}>
                  {column.format && typeof value === 'number' ? column.format(value) : value}
                </TableCell>
              );
            })}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

TabRequestVisitors.propTypes = {
  visitors: PropTypes.arrayOf(
    PropTypes.shape({
      firstname: PropTypes.string,
    }),
  ),
};

TabRequestVisitors.defaultProps = {
  visitors: [],
};
