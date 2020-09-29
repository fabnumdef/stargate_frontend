import React, { useState } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Grid from '@material-ui/core/Grid';
import { gql, useLazyQuery } from '@apollo/client';

import { fade } from '@material-ui/core/styles/colorManipulator';

const useStyles = makeStyles((theme) => ({
  popUp: {
    width: '300px',
    height: '66px',
    transition: 'width 1500ms, height 1500ms',
  },
  popUpOpen: {
    width: '495px',
    height: '235px',
    border: `2px solid ${fade(theme.palette.primary.main, 0.1)}`,
    borderRadius: '8px',
  },
  popUpAbsolute: {
    position: 'absolute',
  },
  button: {
    width: '300px',
    textTransform: 'none',
    fontSize: '1.1rem',
  },
  buttonOpen: {
    color: theme.palette.primary.main,
    backgroundColor: fade(theme.palette.primary.main, 0.1),
    '&:hover': {
      backgroundColor: fade(theme.palette.primary.main, 0.2),
    },
  },
  buttonPop: {
    width: '150px',
    textTransform: 'none',
  },
  message: {
    margin: '16px 8px 0 10px',
    width: '350px',
    fontStyle: 'italic',
    maxWidth: '300px',
  },
  pageTitle: {
    margin: '8px 8px',
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
    margin: '6px 8px',
    visibility: 'visible',
    opacity: 1,
  },
  marginTop: {
    marginTop: '2%',
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

  const [getTemplate] = useLazyQuery(VISITOR_TEMPLATE, {
    onCompleted: (d) => {
      const link = document.createElement('a');
      link.href = d.getCampus.getVisitorsTemplate.link;
      link.setAttribute('download', 'template.csv');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    },
  });

  return (
    <div>
      <div
        className={`${classes.popUp} ${open ? classes.popUpOpen : ''} ${
          matches ? classes.popUpAbsolute : ''
        } `}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpen(!open)}
          className={`${classes.button} ${open ? classes.buttonOpen : ''}`}
        >
          Nouvelle demande de groupe
        </Button>
        <Typography
          variant="body2"
          color="primary"
          className={`${classes.message}`}
        >
          Conseillée pour les groupes importants avec référent.
        </Typography>

        <div className={`${classes.text} ${open ? classes.textOpen : ''}`}>
          <Grid container spacing={0}>
            <Grid item sm={12}>
              <Typography variant="body2" color="primary" className={classes.pageTitle}>
                1. Saisir la fiche visiteurs
              </Typography>
            </Grid>

            <Grid item sm={12}>
              <Typography variant="body2" color="primary" className={classes.pageTitle}>
                2. Créer la demande et importer le document rempli
              </Typography>
            </Grid>
            <Grid container justify="space-around" spacing={0}>
              <Grid item sm={4} className={classes.marginTop}>
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
              <Grid item sm={4} className={classes.marginTop}>
                <Button
                  size="small"
                  variant="contained"
                  color="primary"
                  className={classes.buttonPop}
                >
                  Créer la demande
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </div>
      </div>
    </div>
  );
}
