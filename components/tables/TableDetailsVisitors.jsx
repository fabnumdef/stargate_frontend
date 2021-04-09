import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

import Table from '@material-ui/core/Table';
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
        label: 'Unité / Société',
        style: {
            width: 115
        }
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
    table: {
        // marginTop: '-19px',
        // borderSpacing: ' 0 19px',
        // borderCollapse: 'separate',
        // backgroundColor: '#F3F3F3'
    },
    head: {
        padding: '12px 12px 12px 12px;'
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
        <>
            <Table aria-label="sticky table" size="small" className={classes.table}>
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
                            onDelete={() => setToDeleteID(row.id)}
                        />
                    ))}
                </TableBody>
            </Table>
            <DeleteModal
                isOpen={toDeleteID ? 'ce visiteur' : null}
                title="Supression visiteur"
                onClose={(confirm) => {
                    if (confirm) onDelete(toDeleteID);
                    setToDeleteID(null);
                }}
            />
        </>
    );
}

TabDetailVisitors.propTypes = {
    list: PropTypes.arrayOf(PropTypes.object).isRequired,
    status: PropTypes.string.isRequired,
    onDelete: PropTypes.func.isRequired
};
