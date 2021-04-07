import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import Link from 'next/link';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import DoneIcon from '@material-ui/icons/Done';
import ErrorIcon from '@material-ui/icons/Error';
import DeleteIcon from '@material-ui/icons/Delete';
import CloseIcon from '@material-ui/icons/Close';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { useRouter } from 'next/router';
import CustomTableCellHeader from '../tables/cells/TableCellHeader';
import { useLogin } from '../../lib/loginContext';
import { ROLES } from '../../utils/constants/enums';

const useStyles = makeStyles({
    root: {
        width: '100%'
    },
    container: {
        maxHeight: 440
    },
    icon: {
        marginBottom: '-20px',
        marginTop: '-20px'
    },
    buttons: {
        marginTop: '1vh',
        marginBottom: '1vh'
    },
    export: {
        color: 'white'
    },
    exportContainer: {
        display: 'flex',
        justifyContent: 'flex-end'
    }
});

export default function TabAdmin({ rows, columns, deleteItem, tabData }) {
    const classes = useStyles();
    const { activeRole } = useLogin();
    const router = useRouter();

    const [del, setDel] = useState({});

    const [hover, setHover] = useState({});

    const editAuth = (userData) => {
        switch (activeRole.role) {
            case ROLES.ROLE_UNIT_CORRESPONDENT.role:
                return (
                    activeRole.unitLabel === userData.unit &&
                    userData.userRole === ROLES.ROLE_HOST.role
                );
            case ROLES.ROLE_ADMIN.role:
                return userData.role !== ROLES.ROLE_SUPERADMIN.role;
            default:
                return true;
        }
    };

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

    const handleDeleteConfirm = (id, deleteLabel) => {
        deleteItem(id, deleteLabel);
        setDel({});
    };

    const handleDeleteAvorted = () => {
        setDel({});
    };

    return (
        <Table>
            <TableHead>
                <TableRow>
                    {columns.map((column) => (
                        <CustomTableCellHeader
                            align={column.align}
                            key={column.label}
                            style={{
                                fontWeight: '600',
                                fontSize: '18px'
                            }}>
                            {column.label}
                        </CustomTableCellHeader>
                    ))}
                    <CustomTableCellHeader
                        key="action"
                        align="right"
                        style={{
                            minWidth: '130px'
                        }}>
                        <Link href={tabData().createPath}>
                            <Button type="button" variant="contained" color="primary">
                                Ajouter
                            </Button>
                        </Link>
                    </CustomTableCellHeader>
                </TableRow>
            </TableHead>
            <TableBody>
                {rows.map((row, index) => {
                    if (del[index]) {
                        const label = row.name ? row.name : row.lastname;
                        return (
                            <TableRow tabIndex={-1}>
                                <TableCell colSpan={columns.length + 1}>
                                    <Grid container>
                                        <Grid item sm={10}>
                                            {tabData(label).confirmDeleteText}
                                        </Grid>
                                        <Grid item sm={2}>
                                            <IconButton
                                                aria-label="valide"
                                                className={classes.icon}
                                                onClick={() => handleDeleteConfirm(row.id, label)}>
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
                            hover
                            role="checkbox"
                            tabIndex={-1}
                            key={row.id}
                            onMouseOver={() => handleMouseEnter(index)}
                            onFocus={() => handleMouseEnter(index)}
                            onMouseLeave={() => handleMouseLeave(index)}>
                            {columns.map((column) => {
                                const value = row[column.id];
                                return column.id === 'criblage' ? (
                                    <TableCell key={`${row.id} ${column.id}`} align={column.align}>
                                        {value ? (
                                            <DoneIcon style={{ color: '#4CAF50' }} />
                                        ) : (
                                            <ErrorIcon />
                                        )}
                                    </TableCell>
                                ) : (
                                    <TableCell key={`${row.id} ${column.id}`}>
                                        {column.format && typeof value === 'number'
                                            ? column.format(value)
                                            : value}
                                    </TableCell>
                                );
                            })}
                            <TableCell align="right">
                                {hover[index] && editAuth(row) && (
                                    <>
                                        <Link href={`${router.pathname}/${row.id}`}>
                                            <IconButton
                                                aria-label="modifier"
                                                color="primary"
                                                className={classes.icon}>
                                                <EditIcon />
                                            </IconButton>
                                        </Link>
                                        <IconButton
                                            aria-label="supprimer"
                                            className={classes.icon}
                                            color="primary"
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

TabAdmin.propTypes = {
    rows: PropTypes.arrayOf(PropTypes.object).isRequired,
    columns: PropTypes.arrayOf(PropTypes.object).isRequired,
    deleteItem: PropTypes.func.isRequired,
    tabData: PropTypes.func.isRequired
};
