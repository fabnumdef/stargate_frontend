import React, { useState } from 'react';

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
import CustomTableCellHeader from '../styled/customTableCellHeader';

const columns = [
  { id: 'nDemande', label: 'N° demande' },
  { id: 'dateDem', label: 'Date demande' },
  { id: 'demandeur', label: 'Demandeur' },
  { id: 'periode', label: 'Période' },
  { id: 'motification', label: 'Motif' },
  { id: 'etape', label: 'Étape' },
];

function createData({
  numDemande, dateDemande, demandeur, periode, motif, etapeDemande,
}) {
  return {
    nDemande: numDemande,
    dateDem: dateDemande,
    demandeur: `
          ${demandeur.gradeDemandeur} ${demandeur.nomDemandeur} ${demandeur.prenomDemandeur}
          ${demandeur.uniteDemandeur}`,
    periode: `${periode.dateDebut} au ${periode.dateFin}`,
    motification: motif,
    etape: etapeDemande,
  };
}

/*
function formattedDate(d) {
let day = String(d.getDate());
let month = String(d.getMonth() + 1);
const year = String(d.getFullYear());

if (month.length < 2) month = `0${ month}`;
if (day.length < 2) day = `0${ day}`;

return `${day}/${month}/${year}`;
}
*/

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

export default function TabMesDemandes({ tabData }) {
  const classes = useStyles();

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

  return (
    <Table>
      <TableHead>
        <TableRow>
          {columns.map((column) => (
            <CustomTableCellHeader key={column.id} align={column.align}>
              {column.label}
            </CustomTableCellHeader>
          ))}
          <CustomTableCellHeader key="actions" style={{ minWidth: '150px' }}>
            Actions
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
                </Typography>
              </TableRow>
            );
          }

          return (
            <TableRow
              hover
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
                    {column.format && typeof value === 'number' ? column.format(value) : value}
                  </TableCell>
                );
              })}
              <TableCell key="modif">
                {hover[index] && (
                  <>
                    <Link href="/demandes/1">
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
  );
}
