import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
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
import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import TableContainer from '@material-ui/core/TableContainer';
import EmptyArray from '../../styled/emptyArray';
import CustomTableCellHeader from '../../styled/customTableCellHeader';
import { useSnackBar } from '../../../lib/hooks/snackbar';

const CANCEL_REQUEST = gql`
  mutation cancelRequest(
      $requestId: String!
      $campusId: String!
      $transition: RequestTransition!
  ) {
      campusId @client @export(as: "campusId")
      mutateCampus(id: $campusId) {
            shiftRequest(id: $requestId, transition: $transition ) {
                id
            }
      }
  }
`;

const columns = [
  { id: 'id', label: 'N° demande', width: '220px' },
  {
    id: 'periode', label: 'Période', width: '100px', style: { textAlign: 'center' },
  },
  { id: 'owner', label: 'Demandeur' },
  { id: 'places', label: 'Lieu' },
  { id: 'reason', label: 'Motif' },
];

function createData({
  id, from, to, owner, places, reason,
}) {
  return {
    id,
    periode: `${format(new Date(from), 'dd/MM/yyyy')}
          au
          ${format(new Date(to), 'dd/MM/yyyy')}`,
    owner: owner
      ? `
          ${owner.rank || ''} ${owner.lastname.toUpperCase()} ${owner.firstname} -
          ${owner.unit.label}`
      : '',
    places: places.map((place, index) => {
      if (index === places.length - 1) return `${place.label}.`;
      return `${place.label}, `;
    }),
    reason,
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

export default function TabMyRequestToTreat({ request, queries, emptyLabel }) {
  const classes = useStyles();
  const { addAlert } = useSnackBar();
  const router = useRouter();

  const rows = React.useMemo(() => request.reduce((acc, dem) => {
    acc.push(createData(dem));
    return acc;
  }, []), [request]);

  const [hover, setHover] = useState({});
  const [del, setDel] = useState({});

  const [cancelRequest] = useMutation(CANCEL_REQUEST);

  const handleMouseEnter = (index) => {
    setHover((prevState) => ({ ...prevState, [index]: true }));
  };

  const handleMouseLeave = (index) => {
    setTimeout(() => {}, 2000);
    setHover((prevState) => ({ ...prevState, [index]: false }));
  };

  const handleDelete = (index) => {
    setHover({});
    setDel(({ [index]: true }));
  };

  const handleDeleteConfirm = async (id) => {
    try {
      const { data } = await cancelRequest({
        variables: { requestId: id, transition: 'CANCEL' },
        refetchQueries: queries,
      });
      if (data) {
        addAlert({ message: 'La demande a bien été supprimée', severity: 'Success' });
      }
    } catch (e) {
      addAlert({ message: e.message, severity: 'error' });
    }
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
    <TableContainer>
      <Table aria-label="sticky table">
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <CustomTableCellHeader key={column.id} style={{ width: column.width }}>
                {column.label}
              </CustomTableCellHeader>
            ))}
            <CustomTableCellHeader style={{ minWidth: '120px', width: '130px' }} />
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
                            onClick={() => handleDeleteAvorted(index)}
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
                hover
                onMouseOver={() => handleMouseEnter(index)}
                onFocus={() => handleMouseEnter(index)}
                onMouseLeave={() => handleMouseLeave(index)}
                key={row.code}
              >
                {columns.map((column) => {
                  const value = row[column.id];
                  return (
                    <TableCell key={column.id} align={column.align} component="td" scope="row" style={column.style}>
                      {column.format && typeof value === 'number' ? column.format(value) : value}
                    </TableCell>
                  );
                })}
                <TableCell key="actions">
                  {hover[index] && (
                  <div style={{ float: 'right' }}>
                    <IconButton
                      color="primary"
                      aria-label="link"
                      className={classes.icon}
                      onClick={() => router.push(`/demandes/en-cours/${row.id}`)}
                    >
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
                  </div>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  ) : (
    <EmptyArray type={emptyLabel} />
  );
}

TabMyRequestToTreat.propTypes = {
  request: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  queries: PropTypes.arrayOf(PropTypes.object).isRequired,
  emptyLabel: PropTypes.string.isRequired,
};
