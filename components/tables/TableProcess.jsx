import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

import Table from '@material-ui/core/Table';

import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import TableContainer from './styled/TableContainer';
import CustomTableCellHeader from './cells/TableCellHeader';
import RowProcess from './rows/RowProcess';

const columns = [
    {
        id: 'unit',
        label: 'Unité'
    },
    {
        id: 'steps',
        label: 'Workflow de validation'
    }
];

function createData(units) {
    return {
        unit: units.label,
        steps: units.steps
    };
}

const useStyles = makeStyles({
    table: {
        zIndex: 1000
    }
});

export default function TabProcess({ units }) {
    const classes = useStyles();

    const rows = React.useMemo(
        () =>
            units?.reduce((acc, dem) => {
                acc.push(createData(dem));
                return acc;
            }, []),
        [units]
    );

    return (
        <TableContainer height={36}>
            <Table stickyHeader aria-label="sticky table" size="small" className={classes.table}>
                <TableHead>
                    <TableRow>
                        {columns.map((column) => (
                            <CustomTableCellHeader
                                key={column.id}
                                style={column.id === 'steps' && { paddingLeft: '85px' }}>
                                {column.label}
                            </CustomTableCellHeader>
                        ))}
                    </TableRow>
                </TableHead>

                {rows?.map((row) => (
                    <TableBody key={row.unit}>
                        <RowProcess row={row} columns={columns} />
                    </TableBody>
                ))}
            </Table>
        </TableContainer>
    );
}

TabProcess.propTypes = {
    units: PropTypes.array.isRequired
};
