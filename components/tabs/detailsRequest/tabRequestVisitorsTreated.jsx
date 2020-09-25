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
import VisitorGrid from '../../styled/visitor';

import {
  EMPLOYEE_TYPE,
  ROLES,
  VISITOR_STATUS,
  WORKFLOW_BEHAVIOR,
} from '../../../utils/constants/enums';
import findValidationDate from '../../../utils/mappers/findValidationDate';

import StatusLegend from '../../styled/statusLegend';

function findRejectedRole(units) {
  const sortRole = units.map((u) => `${ROLES[u.steps.find(
    (step) => step.state.value === WORKFLOW_BEHAVIOR.VALIDATION.RESPONSE.negative,
  ).role].shortLabel} - ${u.label}`);
  return sortRole.join(', ').toString();
}

function findVisitorStatus(units) {
  const status = units.find((u) => u.steps.find((s) => s.role === ROLES.ROLE_ACCESS_OFFICE.role))
    .steps.find((s) => s.role === ROLES.ROLE_ACCESS_OFFICE.role).state.tags;
  return status ? status.join(', ').toString() : '';
}

function createData({
  id, firstname, birthLastname, units, rank, company, employeeType, status, vip, vipReason,
}) {
  return {
    id,
    vip,
    vipReason,
    visitor: rank
      ? `${rank} ${birthLastname.toUpperCase()} ${firstname}`
      : `${birthLastname.toUpperCase()} ${firstname}`,
    company,
    type: EMPLOYEE_TYPE[employeeType],
    date: format(findValidationDate(units), "dd/MM/yyyy à k'h'mm"),
    status: status === WORKFLOW_BEHAVIOR.VALIDATION.RESPONSE.negative
      ? `${VISITOR_STATUS[status]} par ${findRejectedRole(units)}`
      : findVisitorStatus(units),
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
    <div>
      <StatusLegend />
      <TableContainer>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              { columns.map((column) => (
                <CustomTableCell key={column.id} align={column.align}>
                  { column.label }
                </CustomTableCell>
              )) }
            </TableRow>
          </TableHead>
          <TableBody>
            { rows.map((row) => (
              <TableRow
                role="checkbox"
                tabIndex={-1}
                key={row.id}
              >
                { columns.map((column) => {
                  const value = row[column.id];
                  return column.id === 'visitor' ? (
                    <TableCell key={column.id} align={column.align}>
                      <VisitorGrid name={value} vip={row.vip} vipReason={row.vipReason} />
                    </TableCell>
                  ) : (
                    <TableCell key={column.id} align={column.align}>
                      {column.format && typeof value === 'number' ? column.format(value) : value}
                    </TableCell>
                  );
                }) }
              </TableRow>
            )) }
          </TableBody>
        </Table>
      </TableContainer>
    </div>
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
