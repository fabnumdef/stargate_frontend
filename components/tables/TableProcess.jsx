import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

import Table from '@material-ui/core/Table';
import TableContainer from '@material-ui/core/TableContainer';

import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import CustomTableCellHeader from './cells/TableCellHeader';
import RowProcess from './rows/RowProcess';

const columns = [
    {
        id: 'unit',
        label: 'Unité'
    },
    {
        id: 'state',
        label: 'Workflow de validation'
    }
];

function createData({ units }) {
    return {
        unit: units.label,
        steps: units.steps
    };
}

const useStyles = makeStyles({
    root: {
        border: '1px solid #F3F3F3',
        maxHeight: '340px',
        overflowX: 'hidden'
    }
});

export default function TabProcess({ units }) {
    const classes = useStyles();

    const rows = React.useMemo(
        () =>
            units.reduce((acc, dem) => {
                acc.push(createData(dem));
                return acc;
            }, []),
        [units]
    );

    return (
        <TableContainer className={classes.root}>
            <Table stickyHeader aria-label="sticky table" size="small" className={classes.table}>
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
                        <RowProcess key={row.id} row={row} columns={columns} />
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

TabProcess.propTypes = {
    units: PropTypes.array.isRequired
};
