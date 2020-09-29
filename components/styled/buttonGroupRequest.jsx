import React, { useState } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Grid from '@material-ui/core/Grid';
import { gql, useLazyQuery } from '@apollo/client';

const useStyles = makeStyles((theme) => ({
  popUp: {
    width: '300px',
    height: '66px',
    transition: 'width 1500ms, height 1500ms',
  },
  popUpOpen: {
    width: '500px',
    height: '200px',
    border: `2px solid ${theme.palette.secondary.main}`,
    borderRadius: '8px',
  },
  popUpAbsolute: {
    position: 'absolute',
  },
  button: {
    width: '300px',
  },
  buttonPop: {
    width: '150px',
    textTransform: 'none',
  },
  message: {
    width: '350px',
  },
  pageTitle: {
    margin: '16px 8px',
  },
  text: {
    margin: 0,
    visibility: 'hidden',
    opacity: 0,
    transitionProperty: 'opacity',
    transitionDuration: '1s',
    transitionDelay: '1500ms',
  },
  textOpen: {
    margin: '16px 8px',
    visibility: 'visible',
    opacity: 1,
  },
}));

const VISITOR_TEMPLATE = gql`
query getTemplate($campusId: String!){
 campusId @client @export(as: "campusId")
    getCampus(id: $campusId) {
      id
      getVisitorsTemplate{
        link
      }
    }
}
`;


export default function GroupRequestButton() {
  const classes = useStyles();
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('md'));
  const [open, setOpen] = useState(false);

  const [getTemplate] = useLazyQuery(VISITOR_TEMPLATE);

  return (
    <div>
      <div
        className={`${classes.popUp} ${open ? classes.popUpOpen : ''} ${
          matches ? classes.popUpAbsolute : ''
        } `}
      >
        <Button
          variant="contained"
          color={open ? 'secondary' : 'primary'}
          onClick={() => setOpen(!open)}
          className={classes.button}
        >
          Nouvelle demande de groupe
        </Button>
        <Typography
          variant="body2"
          color="primary"
          className={`${classes.message} ${classes.pageTitle}`}
        >
          Conseillée pour les groupes importants avec référent.
        </Typography>

        <div className={`${classes.text} ${open ? classes.textOpen : ''}`}>
          <Grid container>
            <Grid item sm={8}>
              <Typography variant="body2" color="primary" className={classes.pageTitle}>
                1. Recuperer la fiche information
              </Typography>
            </Grid>
            <Grid item sm={4}>
              <Button
                size="small"
                variant="contained"
                color="primary"
                className={classes.buttonPop}
                onClick={() => getTemplate()}
              >
                Fiche visiteurs
              </Button>
            </Grid>
            <Grid item sm={8}>
              <Typography variant="body2" color="primary" className={classes.pageTitle}>
                2. Créér la demande et importer le document rempli
              </Typography>
            </Grid>
            <Grid item sm={4}>
              <Button
                size="small"
                variant="contained"
                color="primary"
                className={classes.buttonPop}
              >
                Créer demande
              </Button>
            </Grid>
          </Grid>
        </div>
      </div>
    </div>
  );
}
