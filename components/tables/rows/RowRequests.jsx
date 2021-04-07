import React from 'react';

import { useRouter } from 'next/router';
import TableCell from '@material-ui/core/TableCell';

import TableRow from '@material-ui/core/TableRow';
import PropTypes from 'prop-types';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import DescriptionOutlinedIcon from '@material-ui/icons/DescriptionOutlined';
import SquareButton from '../../styled/common/squareButton';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import ReasonCell from '../cells/ReasonCell';

/** @todo Put layout Dark et main to hover and border effect */
const StyledRow = withStyles(() => ({
    root: {
        border: '19px solid #F9F9F9'
    },
    hover: {
        '&:hover': {
            //backgroundColor: `${theme.palette.common.purple} !important`
        }
    }
}))(TableRow);

const useStyles = makeStyles((theme) => ({
    cells: {
        color: 'inherit',
        fontWeight: 'inherit',
        '&:first-child': {
            borderTopLeftRadius: 10,
            borderBottomLeftRadius: 10
        },
        '&:last-child': {
            borderTopRightRadius: 10,
            borderBottomRightRadius: 10
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

function RowTreatments({ columns, row, onDelete }) {
    const router = useRouter();
    const classes = useStyles();

    return (
        <>
            <StyledRow hover key={row.id}>
                {columns.map((column) => {
                    const value = row[column.id];
                    switch (column.id) {
                        case 'action':
                            return (
                                <TableCell className={classes.cells} key={`${row.id} action`}>
                                    <SquareButton
                                        onClick={() => router.push(`/demandes/en-cours/${row.id}`)}
                                        classes={{ root: classes.icon }}>
                                        <DescriptionOutlinedIcon />
                                    </SquareButton>
                                    <SquareButton
                                        aria-label="delete"
                                        onClick={onDelete}
                                        classes={{ root: classes.icon }}>
                                        <DeleteOutlineIcon />
                                    </SquareButton>
                                </TableCell>
                            );
                        case 'reason':
                            return (
                                <ReasonCell className={classes.cells} key={`${row.id} ${value}`}>
                                    {column.format && typeof value === 'number'
                                        ? column.format(value)
                                        : value}
                                </ReasonCell>
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
        </>
    );
}

export default RowTreatments;

RowTreatments.propTypes = {
    columns: PropTypes.arrayOf(PropTypes.object).isRequired,
    row: PropTypes.object.isRequired,
    onDelete: PropTypes.func.isRequired
};
