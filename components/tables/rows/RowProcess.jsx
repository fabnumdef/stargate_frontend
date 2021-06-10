import React from 'react';

import TableCell from '@material-ui/core/TableCell';

import TableRow from '@material-ui/core/TableRow';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import StepCell from '../cells/StepCell';

const useStyles = makeStyles((theme) => ({
    cells: {
        color: 'inherit',
        fontWeight: 'inherit',
        '&:first-child': {
            width: '20%'
        }
    },
    icon: {
        color: 'rgba(0, 0, 0, 0.25)',
        '&:hover': {
            backgroundColor: theme.palette.common.white,
            color: theme.palette.primary.main
        }
    }
}));

function RowTreatments({ columns, row }) {
    const classes = useStyles();
    return (
        <TableRow hover key={row.id}>
            {columns.map((column) => {
                const value = row[column.id];
                switch (column.id) {
                    case 'steps':
                        return (
                            <StepCell
                                className={classes.cells}
                                key={`${row.id} ${value}`}
                                steps={value}
                            />
                        );
                    default:
                        return (
                            <TableCell className={classes.cells} key={`${row.id} ${value}`}>
                                {column.format && typeof value === 'number'
                                    ? column.format(value)
                                    : value}
                            </TableCell>
                        );
                }
            })}
        </TableRow>
    );
}

export default RowTreatments;

RowTreatments.propTypes = {
    columns: PropTypes.arrayOf(PropTypes.object).isRequired,
    row: PropTypes.object.isRequired
};
