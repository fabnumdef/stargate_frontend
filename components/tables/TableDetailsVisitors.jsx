import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

import Table from '@material-ui/core/Table';
import TableContainer from '@material-ui/core/TableContainer';

import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import CustomTableCellHeader from './cells/TableCellHeader';
import RowRequestsVisitors from './rows/RowRequestsVisitors';
import DeleteModal from '../styled/common/DeleteDialogs';
import { EMPLOYEE_TYPE, STATE_REQUEST } from '../../utils/constants/enums';

const columns = [
    {
        id: 'visitor',
        label: 'Visiteur(s)'
    },
    {
        id: 'company',
        label: 'Unité / Société'
    },
    { id: 'type', label: 'Type de visiteurs' },
    {
        id: 'status',
        label: 'Statut'
    }
];

function createData({ id, rank, firstname, birthLastname, employeeType, company, status }) {
    return {
        id,
        visitor: `${rank ? `${rank} ` : ''}${birthLastname.toUpperCase()} ${firstname}`,
        company,
        type: EMPLOYEE_TYPE[employeeType],
        status
    };
}

const useStyles = makeStyles({
    root: {
        border: '1px solid #F3F3F3',
        maxHeight: '440px',
        overflowX: 'hidden'
    }
});

export default function TabDetailVisitors({ list, status, onDelete }) {
    const classes = useStyles();

    const [toDeleteID, setToDeleteID] = useState();

    /** Suppress action depends on status */
    const columnStatus = useMemo(
        () =>
            status === STATE_REQUEST.STATE_CREATED.state
                ? columns.concat([
                      {
                          id: 'action',
                          label: ''
                      }
                  ])
                : columns,
        [status]
    );

    const rows = useMemo(
        () =>
            list.reduce((acc, dem) => {
                acc.push(createData(dem));
                return acc;
            }, []),
        [list]
    );

    return (
        <TableContainer className={classes.root}>
            <Table stickyHeader aria-label="sticky table" className={classes.table}>
                <TableHead>
                    <TableRow>
                        {columnStatus.map((column) => {
                            if (column.id === 'visitor') {
                                return (
                                    <CustomTableCellHeader key={column.id} style={column.style}>
                                        {column.label} ({list.length})
                                    </CustomTableCellHeader>
                                );
                            }
                            return (
                                <CustomTableCellHeader key={column.id} style={column.style}>
                                    {column.label}
                                </CustomTableCellHeader>
                            );
                        })}
                    </TableRow>
                </TableHead>

                <TableBody>
                    {rows.map((row) => (
                        <RowRequestsVisitors
                            key={row.id}
                            row={row}
                            columns={columnStatus}
                            onDelete={() => setToDeleteID({ id: row.id, visitor: row.visitor })}
                        />
                    ))}
                </TableBody>
            </Table>
            <DeleteModal
                isOpen={toDeleteID ? toDeleteID.visitor : null}
                title="Supression visiteur"
                onClose={(confirm) => {
                    if (confirm) onDelete(toDeleteID.id);
                    setToDeleteID(null);
                }}
            />
        </TableContainer>
    );
}

TabDetailVisitors.propTypes = {
    list: PropTypes.arrayOf(PropTypes.object).isRequired,
    status: PropTypes.string.isRequired,
    onDelete: PropTypes.func.isRequired
};
