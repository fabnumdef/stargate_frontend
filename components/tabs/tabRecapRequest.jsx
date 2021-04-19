import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';

import { EMPLOYEE_TYPE } from '../../utils/constants/enums';
import TableContainer from '@material-ui/core/TableContainer';
import SquareButton from '../styled/common/squareButton';
import DescriptionOutlinedIcon from '@material-ui/icons/DescriptionOutlined';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import DeleteModal from '../styled/common/DeleteDialogs';

const createColumns = (visitors) => [
    {
        id: 'visiteur',
        label: `Visiteur(s) (${visitors.length})`
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
    root: {
        border: '1px solid #F3F3F3',
        maxHeight: '440px',
        overflowX: 'hidden'
    },
    header: {
        border: `1px solid ${theme.palette.background.layout}`,
        '&:first-child': { paddingLeft: '30px' }
    },
    headerContent: {
        fontWeight: 'bold',
        width: 330
    },
    row: {
        '& > td': {
            borderTop: `20px solid ${theme.palette.background.layout}`,
            borderBottom: `20px solid ${theme.palette.background.layout}`
        },
        width: 330
    },
    firstCell: {
        borderLeft: `30px solid ${theme.palette.background.layout}`
    },
    lastCell: {
        borderRight: `30px solid ${theme.palette.background.layout}`,
        textAlign: 'right'
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

    const handleAddVisitor = () => {
        setSelectVisitor({});
        handleBack();
    };

    const handleUpdate = (index) => {
        setSelectVisitor(visitors[index]);
        handleBack();
    };

    const handleDeleteConfirm = (id) => {
        onDelete(id);
    };

    return (
        <TableContainer className={classes.root}>
            <Table>
                <TableHead>
                    <TableRow className={classes.header}>
                        {columns.map((column) => (
                            <TableCell key={column.id} className={classes.headerContent}>
                                {column.id === 'action' ? (
                                    <Button
                                        size="small"
                                        variant="outlined"
                                        color="primary"
                                        onClick={handleAddVisitor}
                                        startIcon={<AddIcon />}
                                        style={{ float: 'right' }}>
                                        Ajouter
                                    </Button>
                                ) : (
                                    column.label
                                )}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row, index) => (
                        <TableRow key={row.id} className={classes.row}>
                            <TableCell className={classes.firstCell}>{row.visiteur}</TableCell>
                            <TableCell>{row.unite}</TableCell>
                            <TableCell>{row.type}</TableCell>
                            <TableCell className={classes.lastCell}>
                                <SquareButton
                                    aria-label="details"
                                    onClick={() => handleUpdate(index)}
                                    classes={{ root: classes.icon }}>
                                    <DescriptionOutlinedIcon />
                                </SquareButton>
                                <SquareButton
                                    aria-label="delete"
                                    onClick={() => setToDeleteID(row.id)}
                                    classes={{ root: classes.icon }}>
                                    <DeleteOutlineIcon />
                                </SquareButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <DeleteModal
                isOpen={toDeleteID}
                title="Supression Visiteur"
                onClose={(confirm) => {
                    if (confirm) handleDeleteConfirm(toDeleteID);
                    setToDeleteID(null);
                }}
            />
        </TableContainer>
    );
}

TabRecapRequest.propTypes = {
    visitors: PropTypes.arrayOf(PropTypes.shape).isRequired,
    onDelete: PropTypes.func.isRequired,
    handleBack: PropTypes.func.isRequired,
    setSelectVisitor: PropTypes.func.isRequired
};
