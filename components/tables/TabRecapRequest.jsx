import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import CustomTableCellHeader from './cells/TableCellHeader';

import { EMPLOYEE_TYPE } from '../../utils/constants/enums';
import TableContainer from './styled/TableContainer';
import DescriptionOutlinedIcon from '@material-ui/icons/DescriptionOutlined';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import DeleteModal from '../styled/common/DeleteDialogs';
import { IconButton } from '@material-ui/core';

const createColumns = (visitors) => [
    {
        id: 'visiteur',
        label:
            visitors.length > 1 ? `Visiteurs (${visitors.length})` : `Visiteur (${visitors.length})`
    },
    {
        id: 'unite',
        label: 'Unité / Société'
    },
    {
        id: 'type',
        label: 'Type'
    },
    {
        id: 'action',
        label: ''
    }
];

function createData({ id, firstname, birthLastname, rank, company, employeeType }) {
    return {
        id,
        visiteur: rank
            ? `${rank} ${birthLastname.toUpperCase()} ${firstname}`
            : `${birthLastname.toUpperCase()} ${firstname}`,
        unite: company,
        type: EMPLOYEE_TYPE[employeeType]
    };
}

const useStyles = makeStyles((theme) => ({
    table: {
        zIndex: 10
    },
    row: {
        '& td:last-child': {
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center'
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

export default function TabRecapRequest({ visitors, onDelete, handleBack, setSelectVisitor }) {
    const classes = useStyles();

    const rows = visitors.reduce((acc, vis) => {
        acc.push(createData(vis));
        return acc;
    }, []);
    const columns = createColumns(visitors);

    const [toDeleteID, setToDeleteID] = useState();

    // const [page, setPage] = React.useState(0);
    // const [rowsPerPage, setRowsPerPage] = React.useState(10);

    // const handleChangePage = (event, newPage) => {
    //   setPage(newPage);
    // };

    // const handleChangeRowsPerPage = event => {
    //   setRowsPerPage(+event.target.value);
    //   setPage(0);
    // };

    const handleUpdate = (index) => {
        setSelectVisitor(visitors[index]);
        handleBack();
    };

    const handleDeleteConfirm = (id) => {
        onDelete(id);
    };

    return (
        <>
            <TableContainer height={62}>
                <Table stickyHeader aria-label="sticky table" className={classes.table}>
                    <TableHead>
                        <TableRow>
                            {columns.map((column) => (
                                <CustomTableCellHeader key={column.id}>
                                    {column.label}
                                </CustomTableCellHeader>
                            ))}
                        </TableRow>
                    </TableHead>
                    {rows.map((row, index) => (
                        <TableBody key={row.id}>
                            <TableRow className={classes.row}>
                                <TableCell>{row.visiteur}</TableCell>
                                <TableCell>{row.unite}</TableCell>
                                <TableCell>{row.type}</TableCell>
                                <TableCell>
                                    <IconButton
                                        aria-label="details"
                                        onClick={() => handleUpdate(index)}
                                        classes={{ root: classes.icon }}>
                                        <DescriptionOutlinedIcon />
                                    </IconButton>
                                    <IconButton
                                        aria-label="delete"
                                        onClick={() => setToDeleteID(row)}
                                        classes={{ root: classes.icon }}>
                                        <DeleteOutlineIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    ))}
                </Table>
            </TableContainer>
            <DeleteModal
                isOpen={toDeleteID ? toDeleteID.visiteur : null}
                title="Supression Visiteur"
                onClose={(confirm) => {
                    if (confirm) handleDeleteConfirm(toDeleteID.id);
                    setToDeleteID(null);
                }}
            />
        </>
    );
}

TabRecapRequest.propTypes = {
    visitors: PropTypes.arrayOf(PropTypes.shape).isRequired,
    onDelete: PropTypes.func.isRequired,
    handleBack: PropTypes.func.isRequired,
    setSelectVisitor: PropTypes.func.isRequired
};
