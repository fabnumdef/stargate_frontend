import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import { format } from 'date-fns';
import CustomTableCellHeader from './cells/TableCellHeader';
import RowRequests from './rows/RowRequests';
import DeleteModal from '../styled/common/DeleteDialogs';
import LoadMore from '../styled/common/LoadMore';

const columns = [
    {
        id: 'id',
        label: '#N°',
        style: {
            width: 230
        }
    },
    {
        id: 'periode',
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
    return {
        id,
        periode: `${format(new Date(from), 'dd/MM/yyyy')}
        \n
        ${format(new Date(to), 'dd/MM/yyyy')}`,
        places: places.map((place, index) => {
            if (index === places.length - 1) return `${place.label}.`;
            return `${place.label}, `;
        }),
        reason,
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

export default function TabMyRequestToTreat({ request, onDelete, load, onLoadMore }) {
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
        <>
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
                            onDelete={() => setToDeleteID(row.id)}
                        />
                    ))}
                </TableBody>
            </Table>
            {load && <LoadMore onLoadMore={onLoadMore} />}
            <DeleteModal
                isOpen={toDeleteID}
                title="Supression demande"
                onClose={(confirm) => {
                    if (confirm) onDelete(toDeleteID);
                    setToDeleteID(null);
                }}
            />
        </>
    );
}

TabMyRequestToTreat.propTypes = {
    request: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    load: PropTypes.bool.isRequired,
    onDelete: PropTypes.func.isRequired,
    onLoadMore: PropTypes.func.isRequired
};
