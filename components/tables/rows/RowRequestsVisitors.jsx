import React, { useMemo } from 'react';

import PropTypes from 'prop-types';

import TableCell from '@material-ui/core/TableCell';
import { makeStyles } from '@material-ui/core/styles';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';

import SquareButton from '../../styled/common/squareButton';
import { VISITOR_STATUS } from '../../../utils/constants/enums';
import StyledRow from '../../styled/common/StyledRow';

import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';

/** @todo Put layout Dark et main to hover and border effect */

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
    },
    iconStatus: {
        marginBottom: '-5px',
        marginRight: '5px'
    },
    iconSuccess: {
        color: theme.palette.success.main
    },
    iconInfo: {
        color: theme.palette.warning.main
    },
    iconError: {
        color: theme.palette.error.main
    }
}));

function RowRequestsVisitors({ columns, row, onDelete }) {
    const classes = useStyles();

    const statusIcon = useMemo(() => {
        switch (row.status) {
            case 'CREATED':
                return (
                    <PlayCircleFilledIcon
                        fontSize="small"
                        className={`${classes.iconStatus} ${classes.iconInfo}`}
                    />
                );
            case 'ACCEPTED':
                return (
                    <CheckCircleIcon
                        fontSize="small"
                        className={`${classes.iconStatus} ${classes.iconSuccess}`}
                    />
                );
            case 'REFUSED':
                return (
                    <ErrorIcon
                        fontSize="small"
                        className={`${classes.iconStatus} ${classes.iconError}`}
                    />
                );
        }
    }, [row]);

    return (
        <StyledRow hover key={row.id}>
            {columns.map((column) => {
                const value = row[column.id];
                switch (column.id) {
                    case 'action':
                        return (
                            <TableCell className={classes.cells} key={`${row.id} action`}>
                                <SquareButton
                                    aria-label="delete"
                                    onClick={onDelete}
                                    classes={{ root: classes.icon }}>
                                    <DeleteOutlineIcon />
                                </SquareButton>
                            </TableCell>
                        );
                    case 'status':
                        return (
                            <TableCell className={classes.cells} key={`${row.id} status`}>
                                <>
                                    {statusIcon} {VISITOR_STATUS[value]}
                                </>
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
        </StyledRow>
    );
}

export default RowRequestsVisitors;

RowRequestsVisitors.propTypes = {
    columns: PropTypes.arrayOf(PropTypes.object).isRequired,
    row: PropTypes.object.isRequired,
    onDelete: PropTypes.func.isRequired
};
