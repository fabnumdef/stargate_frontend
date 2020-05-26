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

import { format } from 'date-fns';
import EmptyArray from '../../styled/emptyArray';
import CustomTableCellHeader from '../../styled/customTableCellHeader';


const columns = [
  { id: 'id', label: 'N° demande' },
  { id: 'periode', label: 'Période' },
  { id: 'reason', label: 'Motif' },
  { id: 'visitors', label: 'Visiteur', minWidth: '20%' },
];

function createData({
  id, from, to, reason, company, visitors,
}) {
  return {
    id,
    periode: `${format(new Date(from), 'dd/MM/yyyy')}
          au
          ${format(new Date(to), 'dd/MM/yyyy')}`,
    reason,
    company,
    visitors,
  };
}

const useStyles = makeStyles({
  root: {
    width: '100%',
  },
  icon: {
    margin: '-20px',
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


  const handleMouseEnter = (indexRow, indexVisitor) => {
    const index = `${indexRow},${indexVisitor}`;
    setHover((prevState) => ({ ...prevState, [index]: true }));
  };

  const handleMouseLeave = (indexRow, indexVisitor) => {
    setTimeout(() => {}, 2000);
    const index = `${indexRow},${indexVisitor}`;
    setHover((prevState) => ({ ...prevState, [index]: false }));
  };

  const handleDelete = (indexRow, indexVisitor) => {
    const index = `${indexRow},${indexVisitor}`;
    setDel((prevState) => ({ ...prevState, [index]: true }));
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
          <CustomTableCellHeader
            key="company"
            style={{ width: '16%' }}
          >
            Unité/Société

          </CustomTableCellHeader>
          <CustomTableCellHeader
            key="validation"
            style={{ width: '20%' }}
          >
            Étape Validation

          </CustomTableCellHeader>
          <CustomTableCellHeader
            key="actions"
          />
        </TableRow>
      </TableHead>

      <TableBody>
        {rows.map((row, indexRow) => (
          <TableRow hover key={row.code}>
            {columns.map((column) => {
              const value = row[column.id];
              switch (column.id) {
                case 'visitors':
                  return (
                    <TableCell key={column.id} colSpan={4} component="td" scope="row">
                      <Table style={{ marginLeft: '-15px' }} size="small">
                        <TableBody>
                          {value.map((visitor, indexVisitor) => {
                            if (del[`${indexRow},${indexVisitor}`]) {
                              return (
                                <TableRow tabIndex={-1} key={row.email}>
                                  <TableCell
                                    key="delete"
                                    align="justify"
                                    className={classes.cellVisitors}
                                    colSpan={4}
                                  >
                                    <Grid container>
                                      <Grid item sm={9}>
                                        <Typography variant="body1">
                                          Êtes-vous sûr de vouloir supprimer
                                          {' '}
                                          {visitor.rank}
                                          {' '}
                                          {visitor.firstname}
                                          {' '}
                                          {visitor.birthLastname}
                                          {' '}
                                          ?
                                        </Typography>
                                      </Grid>
                                      <Grid item sm={2}>
                                        <IconButton
                                          aria-label="valide"
                                          size="small"
                                          className={classes.deleteIcon}
                                        >
                                          <DoneIcon />
                                        </IconButton>

                                        <IconButton
                                          aria-label="cancel"
                                          size="small"
                                          className={classes.deleteIcon}
                                          onClick={() => handleDeleteAvorted(indexRow, indexVisitor)}
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
                                key={`visitor ${visitor.birthLastname}`}
                                onMouseOver={() => handleMouseEnter(indexRow, indexVisitor)}
                                onFocus={() => handleMouseEnter(indexRow, indexVisitor)}
                                onMouseLeave={() => handleMouseLeave(indexRow, indexVisitor)}
                              >
                                <TableCell
                                  key="name"
                                  className={classes.cellVisitors}
                                  style={{ width: '35%' }}
                                >
                                  {`${visitor.rank} ${visitor.firstname} ${visitor.birthLastname}`}
                                </TableCell>
                                <TableCell
                                  key="company"
                                  className={classes.cellVisitors}
                                  style={{ width: '30%' }}
                                >
                                  {visitor.company}
                                </TableCell>
                                <TableCell
                                  key="validation"
                                  className={classes.cellVisitors}
                                  style={{ width: '20%' }}
                                >
                                  toComplete
                                </TableCell>
                                <TableCell key="action" className={classes.cellVisitors}>
                                  {hover[`${indexRow},${indexVisitor}`] && (
                                    <IconButton
                                      color="primary"
                                      aria-label="delete"
                                      className={classes.icon}
                                      onClick={() => handleDelete(indexRow, indexVisitor)}
                                    >
                                      <DeleteIcon />
                                    </IconButton>
                                  )}
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </TableCell>
                  );
                default:
                  return (
                    <TableCell key={column.id} align={column.align} component="td" scope="row">
                      {column.format && typeof value === 'number' ? column.format(value) : value}
                    </TableCell>
                  );
              }
            })}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ) : (
    <EmptyArray />
  );
}

TabMyRequestToTreat.propTypes = {
  request: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};
