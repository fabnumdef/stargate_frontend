/* eslint-disable max-len */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import DoneIcon from '@material-ui/icons/Done';
import CloseIcon from '@material-ui/icons/Close';
import DescriptionIcon from '@material-ui/icons/Description';

import { format } from 'date-fns';
import EmptyArray from '../../styled/emptyArray';
import CustomTableCellHeader from '../../styled/customTableCellHeader';


const columns = [
  { id: 'id', label: 'N° demande' },
  { id: 'periode', label: 'Période' },
  { id: 'reason', label: 'Motif' },
  { id: 'type', label: 'Type de demande' },
];

function createData({
  id, from, to, reason, visitors,
}) {
  return {
    id,
    periode: `${format(new Date(from), 'dd/MM/yyyy')}
          au
          ${format(new Date(to), 'dd/MM/yyyy')}`,
    reason,
    type: (visitors.length > 5) ? 'Groupe' : 'Simple',
  };
}

const useStyles = makeStyles({
  root: {
    width: '100%',
  },
  icon: {
    marginBottom: '-20px',
    marginTop: '-20px',
  },
  deleteIcon: {
    marginTop: '-20px',
    marginLeft: '10px',
    marginBottom: '-20px',
  },
  cellVisitors: {
    border: 'none',
  },
});

export default function TabMyRequestToTreat({ request }) {
  const classes = useStyles();

  const rows = request.reduce((acc, dem) => {
    acc.push(createData(dem));
    return acc;
  }, []);

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

  const handleDeleteConfirm = () => {
    // todo
  };

  // @todo : Cancel or delete visitor
  // const handleDeleteConfirm = (id) => {
  //   setDel({});
  //   delete method
  // };

  const handleDeleteAvorted = () => {
    setDel({});
  };

  return request.length > 0 ? (
    <Table aria-label="sticky table">
      <TableHead>
        <TableRow>
          {columns.map((column) => (
            <CustomTableCellHeader key={column.id} style={{ width: column.minWidth }}>
              {column.label}
            </CustomTableCellHeader>
          ))}
          <CustomTableCellHeader key="actions" style={{ minWidth: '150px' }} />
        </TableRow>
      </TableHead>

      <TableBody>
        {rows.map((row, index) => {
          if (del[index]) {
            return (
              <TableRow tabIndex={-1} key={row.emailVisiteur}>
                <TableCell key="delete" align="justify" colspan={columns.length + 1}>
                  <Grid container>
                    <Grid item sm={10}>
                      <Typography variant="body1">
                        Êtes-vous sûr de vouloir supprimer la demande
                        {' '}
                        {row.id}
                        {' '}
                        ?
                      </Typography>
                      {rows.length === 1 && (
                        <Typography variant="body1" color="error">
                          Si il n&apos;y a plus de visiteur, la demande va être supprimée.
                        </Typography>
                      )}
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
              hover
              onMouseOver={() => handleMouseEnter(index)}
              onFocus={() => handleMouseEnter(index)}
              onMouseLeave={() => handleMouseLeave(index)}
              key={row.code}
            >
              {columns.map((column) => {
                const value = row[column.id];
                return (
                  <TableCell key={column.id} align={column.align} component="td" scope="row">
                    {column.format && typeof value === 'number' ? column.format(value) : value}
                  </TableCell>
                );
              })}
              <TableCell key="actions">
                {hover[index] && (
                  <>
                    <IconButton color="primary" aria-label="link" className={classes.icon}>
                      <DescriptionIcon />
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
  ) : (
    <EmptyArray />
  );
}

TabMyRequestToTreat.propTypes = {
  request: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};
