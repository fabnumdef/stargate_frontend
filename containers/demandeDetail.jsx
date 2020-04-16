import React, { useContext } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Link from 'next/link';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import Button from '@material-ui/core/Button';
import Stepper from '../components/styled/stepper';
import { SnackBarContext } from '../lib/snackbar';

import { TabVisiteur } from '../components';

const useStyles = makeStyles(() => ({
  root: {
    height: '100vh',
  },
  infos: {
    margin: '40px',
  },
  categorie: {
    fontWeight: 'bold',
  },
  restricTitle: {
    marginLeft: '4vw;',
  },
  restricZone: {
    paddingLeft: '6vw',
    paddingRight: '2vw',
  },
  buttons: {
    marginTop: '20vh',
  },
  fixedButton: {
    position: 'fixed',
    bottom: '10vh',
    right: '10vw',
  },
}));

function getDemande() {
  return {
    numDemande: 'CSD02020-1',
    dateDemande: '13/02/2020',
    demandeur: {
      nomDemandeur: 'Durand',
      prenomDemandeur: 'Henri',
      gradeDemandeur: 'MP',
      uniteDemandeur: 'Etat Major',
    },
    periode: {
      dateDebut: '02/03/2020',
      dateFin: '04/03/2020',
    },
    motif: 'Visite des lieux',
  };
}

function getVisiteurs() {
  return [
    {
      visiteur: {
        nomVisiteur: 'Latour',
        prenomVisiteur: 'Robert',
        gradeVisiteur: 'ASC1',
        uniteVisiteur: 'CDBD Toulon',
        status: true,
        typeVisiteur: 'Civil de la Defense',
      },
    },
    {
      visiteur: {
        nomVisiteur: 'Labouille',
        prenomVisiteur: 'Robin',
        gradeVisiteur: 'MP',
        uniteVisiteur: 'CDBD Toulon',
        status: true,
        typeVisiteur: 'Militaire actif',
      },
    },
    {
      visiteur: {
        nomVisiteur: 'Pichon',
        prenomVisiteur: 'Frédérique',
        uniteVisiteur: 'Société Informatique Toulonnaise',
        gradeVisiteur: 'Mr',
        status: true,
        typeVisiteur: 'Militaire actif',
      },
    },
  ];
}

export default function ContainerDetail() {
  const demande = getDemande();
  const classes = useStyles();

  const { addAlert } = useContext(SnackBarContext);

  const handleClickEnvoyer = () => {
    addAlert('La demande a été envoyé pour criblage');
  };

  return (
    <Paper className={classes.root}>
      <Grid container spacing={2}>
        <Grid item sm={12} className={classes.infos}>
          <Grid container spacing={2}>
            <Grid item sm={6}>
              <Typography variant="body1" className={classes.categorie}>
                N° Demande:
              </Typography>
              <Typography variant="body2">{demande.numDemande}</Typography>
            </Grid>
            <Grid item sm={6}>
              <Typography variant="body1" className={classes.categorie}>
                Motif:
              </Typography>
              <Typography variant="body2">{demande.motif}</Typography>
            </Grid>
            <Grid item sm={6}>
              <Typography variant="body1" className={classes.categorie}>
                Création:
              </Typography>
              <Typography variant="body2">{demande.dateDemande}</Typography>
            </Grid>
            <Grid item sm={6}>
              <Typography variant="body1" className={classes.categorie}>
                Période:
                {' '}
              </Typography>
              <Typography variant="body2">
                {demande.periode.dateDebut}
                {' '}
                au
                {demande.periode.dateFin}
              </Typography>
            </Grid>
            <Grid item sm={6}>
              <Typography variant="body1" className={classes.categorie}>
                Demandeur:
                {' '}
              </Typography>
              <Typography variant="body2">
                {demande.demandeur.gradeDemandeur}
                {' '}
                {demande.demandeur.nomDemandeur.toUpperCase()}
                {' '}
                {demande.demandeur.prenomDemandeur}
              </Typography>
            </Grid>
            <Grid item sm={6}>
              <Typography variant="body1" className={classes.categorie}>
                Lieux:
                {' '}
              </Typography>
              <Typography variant="body2">Base navale, HOMLET, Mess</Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item sm={12}>
          <Stepper />
        </Grid>
        <Grid item sm={12}>
          <TabVisiteur tabData={getVisiteurs()} />
        </Grid>
      </Grid>

      <div className={classes.fixedButton}>
        <Link href="/mesDemandes">
          <Button variant="outlined" color="primary">
            Retour
          </Button>
        </Link>

        <Button variant="outlined" color="primary">
          Refuser
        </Button>
        <Link href="/mesDemandes">
          <Button variant="contained" color="primary" onClick={handleClickEnvoyer}>
            Envoyer
          </Button>
        </Link>
      </div>
      {/* <Visiteurs/> */}

      {/* <Commentaire/> */}
    </Paper>
  );
}
