import React from 'react';

import { useRouter } from 'next/router';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';

import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import DescriptionOutlinedIcon from '@material-ui/icons/DescriptionOutlined';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import SeeMoreOrLess from '../../styled/common/SeeMoreOrLess';
import { STATE_REQUEST } from '../../../utils/constants/enums';
import { IconButton } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    cells: {
        border: 'none',
        color: 'inherit',
        fontWeight: 'inherit',
        '&:last-child': {
            textAlign: 'right'
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
        <TableRow hover key={row.id}>
            {columns.map((column) => {
                const value = row[column.id];
                switch (column.id) {
                    case 'action':
                        return (
                            <TableCell className={classes.cells} key={`${row.id} action`}>
                                <IconButton
                                    aria-label="details"
                                    onClick={() => router.push(`/demandes/${row.id}`)}
                                    classes={{ root: classes.icon }}>
                                    <DescriptionOutlinedIcon />
                                </IconButton>
                                {row.status === STATE_REQUEST.STATE_CREATED.state && (
                                    <IconButton
                                        aria-label="delete"
                                        onClick={onDelete}
                                        classes={{ root: classes.icon }}>
                                        <DeleteOutlineIcon />
                                    </IconButton>
                                )}
                            </TableCell>
                        );
                    case 'reason':
                        return (
                            <TableCell className={classes.cells} key={`${row.id} ${value}`}>
                                <SeeMoreOrLess>
                                    {column.format && typeof value === 'number'
                                        ? column.format(value)
                                        : value}
                                </SeeMoreOrLess>
                            </TableCell>
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
    row: PropTypes.object.isRequired,
    onDelete: PropTypes.func.isRequired
};
