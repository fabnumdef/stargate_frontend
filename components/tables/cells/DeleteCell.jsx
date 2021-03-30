import React from 'react';

import PropTypes from 'prop-types';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import SquareButton from '../../styled/common/squareButton';
import TableCell from '@material-ui/core/TableCell';
import { makeStyles } from '@material-ui/core/styles';

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
    right: {
        marginRight: theme.spacing(12)
    },
    error: {
        color: theme.palette.error.main,
        marginRight: theme.spacing(6),
        '&:hover': {
            backgroundColor: theme.palette.common.white
        }
    },
    success: {
        color: theme.palette.success.main,
        '&:hover': {
            backgroundColor: theme.palette.common.white
        }
    }
}));

export default function DeleteCell({ id, length, abort, onDelete }) {
    const classes = useStyles();

    return (
        <TableCell colSpan={length} className={classes.cells}>
            <span className={classes.right}>
                Êtes-vous sûr de vouloir supprimer la requette {id} ?
            </span>
            <SquareButton onClick={abort} classes={{ root: classes.error }}>
                <CloseIcon />
            </SquareButton>
            <SquareButton onClick={onDelete} classes={{ root: classes.success }}>
                <CheckIcon />
            </SquareButton>
        </TableCell>
    );
}

DeleteCell.propTypes = {
    id: PropTypes.string.isRequired,
    length: PropTypes.number.isRequired,
    abort: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired
};
