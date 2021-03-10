import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import DoneIcon from '@material-ui/icons/Done';
import CloseIcon from '@material-ui/icons/Close';
import ScheduleIcon from '@material-ui/icons/Schedule';

const columns = [
    { id: 'visiteur', label: 'Visiteur', minWidth: 150 },
    { id: 'type', label: 'Type', minWidth: 100 },
    { id: 'unite', label: 'Unité/Société', minWidth: 100 },
    { id: 'status', label: 'Status', minWidth: 100 }
];

function createData({ visiteur }) {
    return {
        visiteur: `${visiteur.gradeVisiteur || ''} ${visiteur.nomVisiteur} ${
            visiteur.prenomVisiteur
        }`,
        type: visiteur.typeVisiteur,
        unite: visiteur.uniteVisiteur,
        status: visiteur.status
    };
}

const useStyles = makeStyles({
    root: {
        width: '100%'
    },
    container: {
        maxHeight: 440
    },
    icon: {
        marginBottom: '-15px',
        marginTop: '-15px',
        fontSize: '0.65rem',
        lineHeight: 2.05
    }
});

export default function TabVisiteurs({ tabData }) {
    const classes = useStyles();

    const [rows, setRows] = useState(
        tabData.reduce((acc, dem) => {
            acc.push(createData(dem));
            return acc;
        }, [])
    );

    const [hover, setHover] = useState({});

    const [del, setDel] = useState({});

    const handleMouseEnter = (index) => {
        setHover((prevState) => ({ ...prevState, [index]: true }));
    };

    const handleMouseLeave = (index) => {
        setTimeout(() => {}, 2000);
        setHover((prevState) => ({ ...prevState, [index]: false }));
    };

    const handleDelete = (index) => {
        setDel((prevState) => ({ ...prevState, [index]: true }));
    };

    const handleDeleteConfirm = (index) => {
        const newRows = rows;
        newRows.splice(index, 1);
        setRows(newRows);
        setDel({});
    };

    const handleDeleteAvorted = () => {
        setDel({});
    };

    return (
        <Table stickyHeader aria-label="sticky table">
            <TableHead>
                <TableRow>
                    {columns.map((column) => (
                        <TableCell
                            key={column.id}
                            align={column.align}
                            style={{ minWidth: column.minWidth }}>
                            {column.label}
                        </TableCell>
                    ))}
                    <TableCell key="actions" style={{ minWidth: 150 }} />
                </TableRow>
            </TableHead>
            <TableBody>
                {rows
                    // .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => {
                        if (del[index]) {
                            return (
                                <TableRow tabIndex={-1} key={row.code}>
                                    <TableCell
                                        key="delete"
                                        align="justify"
                                        colSpan={columns.length + 1}>
                                        <Grid container>
                                            <Grid item sm={9}>
                                                <Typography variant="subtitle2">
                                                    Êtes-vous sûr de vouloir supprimer ce visiteur ?
                                                </Typography>
                                            </Grid>
                                            <Grid item sm={3}>
                                                <IconButton
                                                    aria-label="valide"
                                                    className={classes.icon}
                                                    onClick={() => handleDeleteConfirm(index)}>
                                                    <DoneIcon />
                                                </IconButton>

                                                <IconButton
                                                    aria-label="cancel"
                                                    className={classes.icon}
                                                    onClick={() => handleDeleteAvorted(index)}>
                                                    <CloseIcon />
                                                </IconButton>
                                            </Grid>
                                        </Grid>
                                    </TableCell>
                                </TableRow>
                            );
                        }

                        return (
                            <TableRow
                                onMouseOver={() => handleMouseEnter(index)}
                                onFocus={() => handleMouseEnter(index)}
                                onMouseLeave={() => handleMouseLeave(index)}
                                role="checkbox"
                                tabIndex={-1}
                                key={row.code}>
                                {columns.map((column) => {
                                    const value = row[column.id];
                                    return column.id === 'status' ? (
                                        <TableCell key={column.id} align={column.align}>
                                            {value ? (
                                                <DoneIcon style={{ color: '#81c784' }} />
                                            ) : (
                                                <ScheduleIcon />
                                            )}
                                        </TableCell>
                                    ) : (
                                        <TableCell key={column.id} align={column.align}>
                                            {column.format && typeof value === 'number'
                                                ? column.format(value)
                                                : value}
                                        </TableCell>
                                    );
                                })}
                                <TableCell key="actions">
                                    {hover[index] && (
                                        <>
                                            <IconButton aria-label="edit" className={classes.icon}>
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton
                                                aria-label="delete"
                                                className={classes.icon}
                                                onClick={() => handleDelete(index)}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </>
                                    )}
                                </TableCell>
                            </TableRow>
                        );
                    })}
            </TableBody>
        </Table>
    );
}

TabVisiteurs.propTypes = {
    tabData: PropTypes.array.isRequired
};
