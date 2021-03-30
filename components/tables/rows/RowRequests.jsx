import React, { useState } from 'react';

import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import PropTypes from 'prop-types';
import { withStyles, makeStyles } from '@material-ui/core/styles';

import IconButton from '@material-ui/core/IconButton';

import DescriptionOutlinedIcon from '@material-ui/icons/DescriptionOutlined';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';

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

const SquireButton = withStyles(() => ({
    root: {
        color: 'inherit',
        lineBreak: 'pre-line',
        borderRadius: '15%',
        padding: '8px'
    }
}))(IconButton);

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

function RowTreatments({ columns, row }) {
    const classes = useStyles();
    const [hover, setHover] = useState(false);
    return (
        <StyledRow hover onMouseOver={() => setHover(true)} onMouseLeave={() => setHover(false)}>
            {columns.map((column) => {
                const value = row[column.id];
                switch (column.id) {
                    case 'action':
                        return (
                            <TableCell className={classes.cells} key={column.id}>
                                <SquireButton
                                    classes={{ root: classes.icon }}
                                    className={hover ? '' : classes.actionNotHover}>
                                    <DescriptionOutlinedIcon />
                                </SquireButton>
                                <SquireButton
                                    classes={{ root: classes.icon }}
                                    className={hover ? '' : classes.actionNotHover}>
                                    <DeleteOutlineIcon />
                                </SquireButton>
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
    row: PropTypes.object.isRequired
};
