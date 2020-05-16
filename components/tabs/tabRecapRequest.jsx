import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import Table from '@material-ui/core/Table';
import Grid from '@material-ui/core/Grid';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import DoneIcon from '@material-ui/icons/Done';
import CloseIcon from '@material-ui/icons/Close';
import AddIcon from '@material-ui/icons/Add';

import CustomTableCell from '../styled/customTableCellHeader';

const columns = [
  { id: 'visiteur', label: 'Visiteur', minWidth: 150 },
  {
    id: 'unite',
    label: 'Unité/Société',
    minWidth: 150,
  },
];

function createData({
  id,
  firstname,
  birthLastname,
  rank,
  company,
  type,
}) {
  if (!rank) {
    return {
      id,
      visiteur: `${birthLastname.toUpperCase()} ${firstname}`,
      unite: company,
      type,
    };
  }
  return {
    id,
    visiteur: `${rank} ${birthLastname.toUpperCase()} ${firstname}`,
    unite: company,
    type,
  };
}

const useStyles = makeStyles({
  container: {
    maxHeight: 440,
  },
  icon: {
    marginBottom: '-20px',
    marginTop: '-20px',
  },
});

export default function TabRecapRequest({
  visitors, onUpdate, onDelete, handleBack,
}) {
  const classes = useStyles();

  const rows = visitors.reduce((acc, vis) => {
    acc.push(createData(vis));
    return acc;
  }, []);

  const [hover, setHover] = useState({});
  const [del, setDel] = useState({});

  // const [page, setPage] = React.useState(0);
  // const [rowsPerPage, setRowsPerPage] = React.useState(10);

  // const handleChangePage = (event, newPage) => {
  //   setPage(newPage);
  // };

  // const handleChangeRowsPerPage = event => {
  //   setRowsPerPage(+event.target.value);
  //   setPage(0);
  // };

  const handleAjouterVisiteurs = () => {
    handleBack();
  };

  const handleMouseEnter = (index) => {
    setHover((prevState) => ({ ...prevState, [index]: true }));
  };

  const handleUpdate = (index) => {
    onUpdate(visitors[index]);
    handleBack();
  };

  const handleDelete = (index) => {
    setDel((prevState) => ({ ...prevState, [index]: true }));
  };

  const handleDeleteConfirm = (id) => {
    onDelete(id);
    setDel({});
  };

  const handleDeleteAvorted = () => {
    setDel({});
  };

  const handleMouseLeave = (index) => {
    setTimeout(() => {}, 2000);
    setHover((prevState) => ({ ...prevState, [index]: false }));
  };

  return (
    <Table stickyHeader aria-label="sticky table">
      <TableHead>
        <TableRow>
          {columns.map((column) => (
            <CustomTableCell key={column.id} align={column.align}>
              {column.label}
            </CustomTableCell>
          ))}
          <CustomTableCell>
            <Button
              size="small"
              variant="outlined"
              color="primary"
              onClick={handleAjouterVisiteurs}
              startIcon={<AddIcon />}
              className={classes.icon}
            >
              Ajouter
            </Button>
          </CustomTableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {rows
        // .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
          .map((row, index) => {
            if (del[index]) {
              return (
                <TableRow tabIndex={-1} key={row.emailVisiteur}>
                  <TableCell key="delete" align="justify" colspan={columns.length + 1}>
                    <Grid container>
                      <Grid item sm={10}>
                        <Typography variant="body1">
                          Êtes-vous sûr de vouloir supprimer ce visiteur de la demande ?
                        </Typography>
                      </Grid>
                      <Grid item sm={2}>
                        <IconButton
                          aria-label="valide"
                          className={classes.icon}
                          onClick={() => handleDeleteConfirm(row.id)}
                        >
                          <DoneIcon />
                        </IconButton>

                        <IconButton
                          aria-label="cancel"
                          className={classes.icon}
                          onClick={() => handleDeleteAvorted(index)}
                        >
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
                key={row.emailVisiteur}
              >
                {columns.map((column) => {
                  const value = row[column.id];
                  return (
                    <TableCell key={column.id} align={column.align}>
                      {column.format && typeof value === 'number' ? column.format(value) : value}
                    </TableCell>
                  );
                })}
                <TableCell key="actions">
                  {hover[index] && (
                    <>
                      <IconButton
                        aria-label="edit"
                        className={classes.icon}
                        color="primary"
                        onClick={() => handleUpdate(index)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="primary"
                        aria-label="delete"
                        className={classes.icon}
                        onClick={() => handleDelete(index)}
                      >
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

TabRecapRequest.propTypes = {
  visitors: PropTypes.objectOf(PropTypes.array).isRequired,
  onUpdate: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  handleBack: PropTypes.func.isRequired,
};
