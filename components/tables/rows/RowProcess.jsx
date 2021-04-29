import React from 'react';

import TableCell from '@material-ui/core/TableCell';

import TableRow from '@material-ui/core/TableRow';
import PropTypes from 'prop-types';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import StepCell from '../cells/StepCell';

/** @todo Put layout Dark et main to hover and border effect */
const StyledRow = withStyles((theme) => ({
    root: {
        border: `19px solid ${theme.palette.background.table}`
    },
    hover: {
        '&:hover': {
            boxShadow: `inset -10px -10px 0px ${theme.palette.primary.dark}
            , inset 11px 11px 0px ${theme.palette.primary.dark}`,
            backgroundColor: `${theme.palette.common.white} !important`
        }
    }
}))(TableRow);

const useStyles = makeStyles((theme) => ({
    cells: {
        border: 'none',

        color: 'inherit',
        fontWeight: 'inherit',
        '&:first-child': {
            borderTopLeftRadius: 10,
            borderBottomLeftRadius: 10
        },
        '&:last-child': {
            borderTopRightRadius: 10,
            borderBottomRightRadius: 10,
            display: 'flex',
            justifyContent: 'flex-end'
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
        <StyledRow hover key={row.id}>
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
        </StyledRow>
    );
}

export default RowTreatments;

RowTreatments.propTypes = {
    columns: PropTypes.arrayOf(PropTypes.object).isRequired,
    row: PropTypes.object.isRequired
};
