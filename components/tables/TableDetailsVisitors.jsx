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
        label: 'Visiteur'
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

const useStyles = makeStyles((theme) => ({
    cont: {
        position: 'relative'
    },
    root: {
        borderTop: '1px solid rgba(224, 224, 224, 1)',
        padding: '0 20px 0 20px',
        background: theme.palette.background.table,
        maxHeight: '63vh',
        overflowX: 'hidden'
    },
    header: {
        position: 'absolute',
        top: '1px',
        left: '0',
        width: '100%',
        height: '57px',
        backgroundColor: 'white',
        '&::after': {
            content: '""',
            position: 'absolute',
            bottom: '-1px',
            height: '1px',
            width: '100%',
            backgroundColor: 'rgba(224, 224, 224, 1)'
        }
    },
    table: {
        zIndex: 10
    }
}));

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
        <div className={classes.cont}>
            <div className={classes.header} />
            <TableContainer className={classes.root}>
                <Table stickyHeader aria-label="sticky table" className={classes.table}>
                    <TableHead>
                        <TableRow>
                            {columnStatus.map((column) => {
                                if (column.id === 'visitor') {
                                    return (
                                        <CustomTableCellHeader key={column.id} style={column.style}>
                                            {list.length > 1
                                                ? `${column.label}s (${list.length})`
                                                : `${column.label} (${list.length})`}
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
                    {rows.map((row) => (
                        <TableBody key={row.id}>
                            <RowRequestsVisitors
                                row={row}
                                columns={columnStatus}
                                onDelete={() => setToDeleteID({ id: row.id, visitor: row.visitor })}
                            />
                        </TableBody>
                    ))}
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
        </div>
    );
}

TabDetailVisitors.propTypes = {
    list: PropTypes.arrayOf(PropTypes.object).isRequired,
    status: PropTypes.string.isRequired,
    onDelete: PropTypes.func.isRequired
};
