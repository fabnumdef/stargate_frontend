import React, { useMemo } from 'react';
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
  VISITOR_STATUS,
  WORKFLOW_BEHAVIOR,
} from '../../../utils/constants/enums';
import findValidationDate from '../../../utils/mappers/findValidationDate';
import findRejectedRole from '../../../utils/mappers/findRejectedRole';
import findVisitorStatus from '../../../utils/mappers/findVisitorStatus';

import StatusLegend from '../../styled/statusLegend';


function createData({
  id, firstname, birthLastname, units, rank, company, employeeType, status, vip,
}) {
  return {
    id,
    vip,
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
  const rows = useMemo(() => visitors.reduce((acc, vis) => {
    acc.push(createData(vis));
    return acc;
  }, []), [visitors]);

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
                  return (
                    column.id === 'visitor' ? (
                      <TableCell
                        key={column.id}
                        align={column.align}
                      >
                        <VisitorGrid name={value} vip={row.vip} />
                      </TableCell>
                    )
                      : (
                        <TableCell key={column.id} align={column.align}>
                          { column.format && typeof value === 'number' ? column.format(value) : value }
                        </TableCell>
                      )
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
