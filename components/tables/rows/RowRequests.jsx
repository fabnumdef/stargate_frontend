import React, { useState } from 'react';

import { useRouter } from 'next/router';
import TableCell from '@material-ui/core/TableCell';

import TableRow from '@material-ui/core/TableRow';
import PropTypes from 'prop-types';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import DescriptionOutlinedIcon from '@material-ui/icons/DescriptionOutlined';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import SquareButton from '../../styled/common/squareButton';
import DeleteRequestCell from '../cells/DeleteCell';

const StyledRow = withStyles((theme) => ({
    root: {
        border: '19px solid #F9F9F9',
        backgroundColor: `${theme.palette.common.white} !important`
    },
    hover: {
        '&:hover': {
            color: `${theme.palette.common.white} !important`,
            backgroundColor: `${theme.palette.primary.main} !important`
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
    actionNotHover: {
        color: 'rgba(0, 0, 0, 0.25)'
    },
    icon: {
        '&:hover': {
            backgroundColor: theme.palette.common.white,
            color: theme.palette.primary.main
        }
    }
}));

function RowTreatments({ columns, row, onDelete }) {
    const router = useRouter();
    const classes = useStyles();

    const [hover, setHover] = useState(false);
    const [deletion, setDeletion] = useState(false);

    if (deletion)
        return (
            <StyledRow
                hover
                onMouseOver={() => setHover(true)}
                onMouseLeave={() => setHover(false)}>
                <DeleteRequestCell
                    id={row.id}
                    length={columns.length}
                    abort={() => setDeletion(false)}
                    onDelete={onDelete}
                />
            </StyledRow>
        );

    return (
        <StyledRow hover onMouseOver={() => setHover(true)} onMouseLeave={() => setHover(false)}>
            {columns.map((column) => {
                const value = row[column.id];
                switch (column.id) {
                    case 'action':
                        return (
                            <TableCell className={classes.cells} key={column.id}>
                                <SquareButton
                                    onClick={() => router.push(`/demandes/en-cours/${row.id}`)}
                                    classes={{ root: classes.icon }}
                                    className={hover ? '' : classes.actionNotHover}>
                                    <DescriptionOutlinedIcon />
                                </SquareButton>
                                <SquareButton
                                    onClick={() => setDeletion(true)}
                                    classes={{ root: classes.icon }}
                                    className={hover ? '' : classes.actionNotHover}>
                                    <DeleteOutlineIcon />
                                </SquareButton>
                            </TableCell>
                        );
                    default:
                        return (
                            <TableCell className={classes.cells} key={column.id}>
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
    row: PropTypes.object.isRequired,
    onDelete: PropTypes.func.isRequired
};
