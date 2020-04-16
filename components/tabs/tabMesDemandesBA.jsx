import React, { useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Link from 'next/link';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import DoneIcon from '@material-ui/icons/Done';
import ErrorIcon from '@material-ui/icons/Error';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';

import { CSVLink } from 'react-csv';

const columns = [
  { id: 'nDemande', label: 'N° demande' },
  { id: 'dateDem', label: 'Date demande' },
  { id: 'demandeur', label: 'Demandeur' },
  { id: 'periode', label: 'Période' },
  { id: 'motification', label: 'Motif' },
  { id: 'criblage', label: 'Criblage' },
];

function createData({
  numDemande, dateDemande, periode, motif,
}) {
  return {
    nDemande: numDemande,
    dateDem: dateDemande,
    demandeur: (demandeur) => (
      <div>
        <span>
          $
          {demandeur.gradeDemandeur}
          {' '}
          $
          {demandeur.nomDemandeur}
          {' '}
          $
          {demandeur.prenomDemandeur}
        </span>
        <Typography variant="body2" color="textSecondary">
          $
          {demandeur.uniteDemandeur}
          `
        </Typography>
      </div>
    ),
    periode: `${periode.dateDebut} au ${periode.dateFin}`,
    motification: motif,
  };
}

const date = new Date();

function formattedDate(d) {
  let day = String(d.getDate());
  let month = String(d.getMonth() + 1);
  const year = String(d.getFullYear());

  if (month.length < 2) month = `0 ${month}`;
  if (day.length < 2) day = `0 ${day}`;

  return `${day}/${month}/${year}`;
}

const now = formattedDate(date);

const useStyles = makeStyles({
  root: {
    width: '100%',
  },
  container: {
    maxHeight: 440,
  },
  icon: {
    marginBottom: '-10px',
    marginTop: '-10px',
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

export default function TabMesDemandes({ tabData }) {
  const classes = useStyles();

  const csvData = [
    ['Numéro demande', 'Date demande', 'demandeur', 'période', 'motif'],
    [
      'CSD02020-1',
      '02/01/2020',
      'MP Henri Durant',
      '07/02/2020 au 20/02/2020',
      'signature contrat',
    ],
    ['CSD02020-2', '02/01/2020', 'AV1 Jean Paul', '07/02/2020 au 20/02/2020', 'signature contrat'],
    // `${rows.forEach(row => [row.nDemande.toString])}`
  ];

  const [rows, setRows] = useState(tabData.demandes.reduce((acc, dem) => {
    acc.push(createData(dem));
    return acc;
  }, []));

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

  const [clicked, setClicked] = React.useState(false);

  const onClicked = () => {
    setClicked(true);
  };

  return (
    <Grid container spacing={4}>
      <Grid item sm={12}>
        <Paper className={classes.root}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell key={column.id} align={column.align}>
                    {column.label}
                  </TableCell>
                ))}
                <TableCell key="actions" style={{ minWidth: '150px' }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, index) => {
                if (del[index]) {
                  return (
                    <TableRow tabIndex={-1} key={row.code}>
                      <TableCell key="delete" colspan={columns.length + 1}>
                        <Grid container>
                          <Grid item sm={9}>
                            <Typography variant="body1">
                              Êtes-vous sûr de vouloir supprimer cette demande ?
                            </Typography>
                          </Grid>
                          <Grid item sm={3}>
                            <IconButton
                              aria-label="valide"
                              className={classes.icon}
                              onClick={() => handleDeleteConfirm(index)}
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
                    key={row.code}
                  >
                    {columns.map((column) => {
                      const value = row[column.id];
                      return column.id === 'criblage' ? (
                        <TableCell key={column.id} align={column.align}>
                          {value ? <DoneIcon style={{ color: '#4CAF50' }} /> : <ErrorIcon />}
                        </TableCell>
                      ) : (
                        <TableCell key={column.id} align={column.align}>
                          {column.format && typeof value === 'number'
                            ? column.format(value)
                            : value}
                        </TableCell>
                      );
                    })}
                    <TableCell key="modif">
                      {hover[index] && (
                        <>
                          <Link href="/demandes/1" color="inherit">
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
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          <div className={classes.exportContainer}>
            <Button className={classes.buttons} color="primary" disabled={!clicked}>
              Marquer comme traité
            </Button>
            <Button
              className={classes.buttons}
              variant="contained"
              color="primary"
              onClick={onClicked}
            >
              <CSVLink
                filename={`'mesDemandes ${now}.csv'`}
                data={csvData}
                className={classes.export}
              >
                Export csv
              </CSVLink>
            </Button>
          </div>
        </Paper>
      </Grid>
    </Grid>
  );
}
