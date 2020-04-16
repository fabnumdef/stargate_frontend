import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';


import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import DoneIcon from '@material-ui/icons/Done';
import CloseIcon from '@material-ui/icons/Close';
import CustomTableCellHeader from '../styled/customTableCellHeader';

const columns = [
  { id: 'nDemande', label: 'N° demande' },
  { id: 'dateDem', label: 'Date demande' },
  { id: 'demandeur', label: 'Demandeur' },
  { id: 'periode', label: 'Période' },
  { id: 'motification', label: 'Motif' },
  { id: 'decision', label: 'Décision' },
  { id: 'space', label: '' },
  { id: 'modif', label: '' },
];

function createData({
  numDemande, dateDemande, demandeur, periode, motif,
}) {
  return {
    nDemande: numDemande,
    dateDem: dateDemande,
    demandeur: `${demandeur.gradeDemandeur} ${demandeur.nomDemandeur} ${demandeur.prenomDemandeur} ${demandeur.uniteDemandeur}`,
    periode: `${periode.dateDebut} au ${periode.dateFin}`,
    motification: motif,
  };
}

const useStyles = makeStyles({
  root: {
    width: '100%',
  },
  container: {
    maxHeight: 440,
  },
  pagination: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
});

export default function TabDemandesTraitees({ tabData }) {
  const classes = useStyles();

  const rows = tabData.demandes.reduce((acc, dem) => {
    acc.push(createData(dem));
    return acc;
  }, []);

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Grid container spacing={0}>
      <Grid item sm={12}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <CustomTableCellHeader
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </CustomTableCellHeader>
              ))}
              <CustomTableCellHeader key="actions" />
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
              <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                {columns.map((column) => {
                  const value = row[column.id];
                  return column.id === 'decision' ? (
                    <CustomTableCellHeader key={column.id} align={column.align}>
                      {value ? <DoneIcon style={{ color: '#4CAF50' }} /> : <CloseIcon />}
                    </CustomTableCellHeader>
                  ) : (
                    <CustomTableCellHeader key={column.id} align={column.align}>
                      {column.format && typeof value === 'number' ? column.format(value) : value}
                    </CustomTableCellHeader>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          className={classes.pagination}
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Grid>
    </Grid>
  );
}
