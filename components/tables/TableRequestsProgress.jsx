import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import { format } from 'date-fns';
import EmptyArray from '../styled/emptyArray';
import CustomTableCellHeader from './cells/TableCellHeader';
import RowRequests from './rows/RowRequests';

const columns = [
    { id: 'id', label: '#N°' },
    {
        id: 'periode',
        label: 'Période',
        style: {
            width: 180
        }
    },
    { id: 'reason', label: 'Motif' },
    { id: 'places', label: 'Lieu' },
    { id: 'action', label: '' }
];

function createData({ id, from, to, places, reason }) {
    return {
        id,
        periode: `${format(new Date(from), 'dd/MM/yyyy')}
        \n
        ${format(new Date(to), 'dd/MM/yyyy')}`,
        places: places.map((place, index) => {
            if (index === places.length - 1) return `${place.label}.`;
            return `${place.label}, `;
        }),
        reason
    };
}

const useStyles = makeStyles({
    table: {
        // marginTop: '-19px',
        // borderSpacing: ' 0 19px',
        // borderCollapse: 'separate',
        backgroundColor: '#F3F3F3'
    },
    head: {
        padding: '12px 12px 12px 12px;'
    }
});

export default function TabMyRequestToTreat({ request, emptyLabel, onDelete }) {
    const classes = useStyles();

    const rows = React.useMemo(
        () =>
            request.reduce((acc, dem) => {
                acc.push(createData(dem));
                return acc;
            }, []),
        [request]
    );

    return request.length > 0 ? (
        <Table aria-label="sticky table" size="small" className={classes.table}>
            <TableHead>
                <TableRow>
                    {columns.map((column) => (
                        <CustomTableCellHeader key={column.id} style={column.style}>
                            {column.label}
                        </CustomTableCellHeader>
                    ))}
                </TableRow>
            </TableHead>

            <TableBody>
                {rows.map((row) => (
                    <RowRequests
                        key={row.id}
                        row={row}
                        columns={columns}
                        onDelete={() => onDelete(row.id)}
                    />
                ))}
            </TableBody>
        </Table>
    ) : (
        <EmptyArray type={emptyLabel} />
    );
}

TabMyRequestToTreat.propTypes = {
    request: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    emptyLabel: PropTypes.string.isRequired,
    onDelete: PropTypes.func.isRequired
};
