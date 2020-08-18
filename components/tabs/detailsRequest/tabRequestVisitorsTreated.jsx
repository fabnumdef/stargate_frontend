import React from 'react';
import PropTypes from 'prop-types';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { format } from 'date-fns';
import TableContainer from '@material-ui/core/TableContainer';
import CustomTableCell from '../../styled/customTableCellHeader';


import {
  EMPLOYEE_TYPE,
  ROLES,
  VISITOR_STATUS,
  WORKFLOW_BEHAVIOR,
} from '../../../utils/constants/enums';
import findValidationDate from '../../../utils/mappers/findValidationDate';

function findRejectedRole(status) {
  const sortRole = status.map((s) => `${ROLES[s.steps.find((step) => step.status === WORKFLOW_BEHAVIOR.VALIDATION.RESPONSE.negative).role].shortLabel} - ${s.label}`);
  return sortRole.toString();
}

function createData({
  id, firstname, birthLastname, state, rank, company, employeeType, status,
}) {
  return {
    id,
    visitor: rank
      ? `${rank} ${birthLastname.toUpperCase()} ${firstname}`
      : `${birthLastname.toUpperCase()} ${firstname}`,
    company,
    type: EMPLOYEE_TYPE[employeeType],
    date: format(findValidationDate(state), "dd/MM/yyyy à k'h'mm"),
    status: VISITOR_STATUS[status] === VISITOR_STATUS.rejected
      ? `${VISITOR_STATUS[status]} par ${findRejectedRole(status)}`
      : VISITOR_STATUS[status],
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
    <TableContainer>
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
    </TableContainer>
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
