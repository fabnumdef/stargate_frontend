import React, { useEffect, useState } from 'react';

import { useRouter } from 'next/router';
import TableCell from '@material-ui/core/TableCell';

import TableRow from '@material-ui/core/TableRow';
import PropTypes from 'prop-types';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import DescriptionOutlinedIcon from '@material-ui/icons/DescriptionOutlined';
import SquareButton from '../../styled/common/squareButton';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import ReasonCell from '../cells/ReasonCell';
import { STATE_REQUEST } from '../../../utils/constants/enums';

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

function RowTreatments({ columns, row, onDelete }) {
    const router = useRouter();
    const classes = useStyles();

    const [link, setlink] = useState('');

    useEffect(() => {
        row.status === STATE_REQUEST.STATE_CREATED.state
            ? setlink('en-cours')
            : setlink('traitees');
    }, []);

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
                                        aria-label="details"
                                        onClick={() => router.push(`/demandes/${link}/${row.id}`)}
                                        classes={{ root: classes.icon }}>
                                        <DescriptionOutlinedIcon />
                                    </SquareButton>
                                    {row.status === STATE_REQUEST.STATE_CREATED.state && (
                                        <SquareButton
                                            aria-label="delete"
                                            onClick={onDelete}
                                            classes={{ root: classes.icon }}>
                                            <DeleteOutlineIcon />
                                        </SquareButton>
                                    )}
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
