import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import { format } from 'date-fns';
import CustomTableCellHeader from './cells/TableCellHeader';
import TableContainer from './styled/TableContainer';
import RowRequests from './rows/RowRequests';
import DeleteModal from '../styled/common/DeleteDialogs';

const columns = [
    {
        id: 'id',
        label: '#N°',
        style: {
            width: 230
        }
    },
    {
        id: 'period',
        label: 'Période',
        style: {
            width: 115
        }
    },
    { id: 'reason', label: 'Motif' },
    {
        id: 'action',
        label: '',
        style: {
            width: 125
        }
    }
];

function createData({ id, from, to, places, reason, status }) {
    const fromDate = format(new Date(from), 'dd/MM/yyyy');
    const toDate = format(new Date(to), 'dd/MM/yyyy');

    return {
        id,
        period: `${fromDate === toDate ? fromDate : `${fromDate} \n ${toDate}`}`,
        places: places.map((place, index) => {
            if (index === places.length - 1) return `${place.label}.`;
            return `${place.label}, `;
        }),
        reason,
        status
    };
}

const useStyles = makeStyles(() => ({
    table: {
        zIndex: 10
    }
}));

export default function TabMyRequestToTreat({ request, onDelete }) {
    const classes = useStyles();

    const [toDeleteID, setToDeleteID] = useState();

    const rows = React.useMemo(
        () =>
            request.reduce((acc, dem) => {
                acc.push(createData(dem));
                return acc;
            }, []),
        [request]
    );

    return (
        <TableContainer height={55}>
            <Table stickyHeader aria-label="sticky table" className={classes.table}>
                <TableHead>
                    <TableRow>
                        {columns.map((column) => (
                            <CustomTableCellHeader key={column.id} style={column.style}>
                                {column.label}
                            </CustomTableCellHeader>
                        ))}
                    </TableRow>
                </TableHead>

                {rows.map((row) => (
                    <TableBody key={row.id}>
                        <RowRequests
                            row={row}
                            columns={columns}
                            onDelete={() => setToDeleteID(row.id)}
                        />
                    </TableBody>
                ))}
            </Table>
            <DeleteModal
                isOpen={toDeleteID}
                title="Supression demande"
                onClose={(confirm) => {
                    if (confirm) onDelete(toDeleteID);
                    setToDeleteID(null);
                }}
            />
        </TableContainer>
    );
}

TabMyRequestToTreat.propTypes = {
    request: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    load: PropTypes.bool.isRequired,
    onDelete: PropTypes.func.isRequired,
    onLoadMore: PropTypes.func.isRequired
};
