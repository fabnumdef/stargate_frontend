import React from 'react';
import Link from 'next/link';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import remove from 'lodash';

import { format } from 'date-fns';

import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';

import TabRecapDemande from '../tabs/tabRecapDemande';

const useStyles = makeStyles({
  root: {
    width: '100%',
  },
  container: {
    maxHeight: 440,
  },
});

export default function InfosRecapDemande({ dataToProps }) {
  const { formData, setForm, handleBack } = dataToProps;
  const classes = useStyles();

  const listLieux = React.useMemo(() => [...formData.zone1, ...formData.zone2], [
    formData.zone1,
    formData.zone2,
  ]);

  // const [page, setPage] = React.useState(0);
  // const [rowsPerPage, setRowsPerPage] = React.useState(10);

  // const handleChangePage = (event, newPage) => {
  //   setPage(newPage);
  // };

  // const handleChangeRowsPerPage = event => {
  //   setRowsPerPage(+event.target.value);
  //   setPage(0);
  // };

  return (
    <Grid container spacing={4}>
      <Grid item sm={11}>
        <Typography variant="body1">
          Visite du
          {' '}
          {format(formData.dateStartVisite, 'dd/MM/yyyy')}
          {' '}
          au
          {' '}
          {''}
          {format(formData.dateEndVisite, 'dd/MM/yyyy')}
        </Typography>
        <Typography variant="body1">
          à :
          {' '}
          {listLieux.map((lieu, index) => {
            if (index === listLieux.length - 1) return `${lieu.value}.`;
            return `${lieu.value}, `;
          })}
        </Typography>
        <Typography variant="body1">
          Motif:
          {' '}
          {formData.motifVisite}
        </Typography>
      </Grid>
      <Grid item sm={12}>
        <Paper className={classes.root}>
          <TabRecapDemande
            listVisiteurs={formData.listVisiteurs}
            onUpdate={(visiteur) => {
              setForm({ ...formData, visiteur });
            }}
            onDelete={(mail) => {
              let visiteurs = [...formData.listVisiteurs];
              visiteurs = remove(visiteurs, (visiteur) => visiteur.emailVisiteur === mail);
              setForm({ ...formData, listVisiteurs: visiteurs });
            }}
            handleBack={handleBack}
          />
        </Paper>
      </Grid>
      <Grid item xs={12} sm={12}>
        <Grid container justify="flex-end">
          <Link href="/">
            <Button variant="contained" color="primary" startIcon={<SaveIcon />}>
              Valider
            </Button>
          </Link>
        </Grid>
      </Grid>
    </Grid>
  );
}
