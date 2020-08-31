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
import DeleteIcon from '@material-ui/icons/Delete';
import DoneIcon from '@material-ui/icons/Done';
import CloseIcon from '@material-ui/icons/Close';
import TableContainer from '@material-ui/core/TableContainer';

import CustomTableCell from '../../styled/customTableCellHeader';

import { EMPLOYEE_TYPE } from '../../../utils/constants/enums';
import findValidationStep from '../../../utils/mappers/findValidationStep';

const useStyles = makeStyles({
  container: {
    maxHeight: 440,
  },
  icon: {
    marginTop: '-20px',
    marginBottom: '-20px',
  },
});

function createData({
  id, firstname, birthLastname, rank, company, employeeType, units,
}) {
  return {
    id,
    visitor: rank
      ? `${rank} ${birthLastname.toUpperCase()} ${firstname}`
      : `${birthLastname.toUpperCase()} ${firstname}`,
    company,
    type: EMPLOYEE_TYPE[employeeType],
    actualStep: findValidationStep(units),
  };
}

const columns = [
  { id: 'visitor', label: 'Visiteur(s)' },
  { id: 'company', label: 'Unité/Société' },
  { id: 'type', label: 'Type' },
  { id: 'step', label: 'Etape de validation' },
];

export default function TabRequestVisitors({ visitors, onDelete }) {
  const classes = useStyles();

  const rows = visitors.reduce((acc, vis) => {
    acc.push(createData(vis));
    return acc;
  }, []);

  const [hover, setHover] = useState({});
  const [del, setDel] = useState({});

  const handleMouseEnter = (index) => {
    setHover((prevState) => ({ ...prevState, [index]: true }));
  };

  const handleDelete = (index) => {
    setHover({});
    setDel({ [index]: true });
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
    <TableContainer>
      <Table stickyHeader aria-label="sticky table">
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <CustomTableCell key={column.id} align={column.align}>
                {column.label}
              </CustomTableCell>
            ))}
            <CustomTableCell key="actions" style={{ minWidth: '80px' }} />
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
                          {`Êtes-vous sûr de vouloir supprimer ${row.visiteur}
                         de la demande ?`}
                        </Typography>
                        {rows.length === 1 && (
                        <Typography variant="body1" color="error">
                          Si il n&apos;y a plus de visiteur, la demande va être supprimée.
                        </Typography>
                        )}
                      </Grid>
                      <Grid item sm={2}>
                        <div style={{ float: 'right' }}>
                          <IconButton
                            aria-label="valide"
                            color="secondary"
                            className={classes.icon}
                            onClick={() => handleDeleteConfirm(row.id)}
                          >
                            <DoneIcon />
                          </IconButton>

                          <IconButton
                            aria-label="cancel"
                            className={classes.icon}
                            onClick={() => handleDeleteAvorted()}
                          >
                            <CloseIcon />
                          </IconButton>
                        </div>
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
                key={row.id}
              >
                {columns.map((column) => {
                  const value = row[column.id];
                  switch (column.id) {
                    case 'step':
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {row.actualStep}
                        </TableCell>
                      );
                    default:
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.format && typeof value === 'number' ? column.format(value) : value}
                        </TableCell>
                      );
                  }
                })}
                <TableCell key="actions">
                  {hover[index] && (
                  <div style={{ float: 'right' }}>
                    <IconButton
                      color="primary"
                      aria-label="delete"
                      className={classes.icon}
                      onClick={() => handleDelete(index)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </div>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

TabRequestVisitors.propTypes = {
  visitors: PropTypes.arrayOf(
    PropTypes.shape({
      firstname: PropTypes.string,
    }),
  ),
  onDelete: PropTypes.func.isRequired,
};

TabRequestVisitors.defaultProps = {
  visitors: [],
};
