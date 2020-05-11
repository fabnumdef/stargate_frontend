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
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import CustomTableCellHeader from '../styled/customTableCellHeader';

const useStyles = makeStyles({
  root: {
    width: '100%',
  },
  container: {
    maxHeight: 440,
  },
  icon: {
    marginBottom: '-20px',
    marginTop: '-20px',
  },
  buttons: {
    marginTop: '1vh',
    marginBottom: '1vh',
  },
  export: {
    color: 'white',
  },
  exportContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
});

export default function TabAdminUsers({
  rows,
  columns,
  deleteItem,
  tabData,
}) {
  const classes = useStyles();

  const [del, setDel] = useState({});

  const handleDelete = (index) => {
    setDel((prevState) => ({ ...prevState, [index]: true }));
  };

  const handleDeleteConfirm = (id) => {
    deleteItem(id);
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
            <CustomTableCellHeader key={column.id} align={column.align}>
              {column.label}
            </CustomTableCellHeader>
          ))}
          <CustomTableCellHeader key="actions">
            <Link href={tabData.createUserPath}><Button type="button" variant="contained" color="primary">Ajouter</Button></Link>
          </CustomTableCellHeader>
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map((row, index) => {
          if (del[index]) {
            return (
              <TableRow tabIndex={-1} key={row.id}>
                <Typography variant="body2">
                  <TableCell key="delete" colspan={columns.length + 1}>
                    <Grid container>
                      <Grid item sm={9}>
                        <Typography variant="body1">
                          { tabData.deleteText }
                        </Typography>
                      </Grid>
                      <Grid item sm={3}>
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
                </Typography>
              </TableRow>
            );
          }

          return (
            <TableRow
              hover
              role="checkbox"
              tabIndex={-1}
              key={row.id}
            >
              {columns.map((column) => {
                const value = row[column.id];
                return column.id === 'criblage' ? (
                  <TableCell key={column.id} align={column.align}>
                    {value ? <DoneIcon style={{ color: '#4CAF50' }} /> : <ErrorIcon />}
                  </TableCell>
                ) : (
                  <TableCell key={column.id} align={column.align}>
                    {column.format && typeof value === 'number' ? column.format(value) : value}
                  </TableCell>
                );
              })}
              <TableCell key="modif">
                <Link href="/administration/utilisateurs">
                  <IconButton aria-label="modifier" className={classes.icon}>
                    <EditIcon />
                  </IconButton>
                </Link>
                <IconButton
                  aria-label="supprimer"
                  className={classes.icon}
                  onClick={() => handleDelete(index)}
                >
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

TabAdminUsers.propTypes = {
  rows: PropTypes.arrayOf(PropTypes.object).isRequired,
  columns: PropTypes.arrayOf(PropTypes.object).isRequired,
  deleteItem: PropTypes.func.isRequired,
  tabData: PropTypes.shape({
    createUserPath: PropTypes.string.isRequired,
    deleteText: PropTypes.string.isRequired,
  }).isRequired,
};
