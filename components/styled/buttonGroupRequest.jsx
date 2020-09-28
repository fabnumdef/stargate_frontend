import React, { useState } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import useMediaQuery from '@material-ui/core/useMediaQuery';

const useStyles = makeStyles((theme) => ({
  popUp: {
    width: '300px',
    height: '66px',
    transition: 'width 1500ms, height 1500ms',
  },
  popUpOpen: {
    width: '500px',
    height: '180px',
    border: `2px solid ${theme.palette.secondary.main}`,
    borderRadius: '10px',
  },
  popUpAbsolute: {
    position: 'absolute',
  },
  button: {
    width: '300px',
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


export default function GroupRequestButton() {
  const classes = useStyles();
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('md'));
  const [open, setOpen] = useState(false);

  return (
    <div>
      <div className={`${classes.popUp} ${open ? classes.popUpOpen : ''} ${matches ? classes.popUpAbsolute : ''} `}>
        <Button
          variant="contained"
          color={open ? 'secondary' : 'primary'}
          onClick={() => setOpen(!open)}
          className={classes.button}
        >
          Nouvelle demande de groupe
        </Button>
        <Typography variant="body2" color="primary" className={`${classes.message} ${classes.pageTitle}`}>
          Conseillée pour les groupes importants avec référent.
        </Typography>
        <div className={`${classes.text} ${open ? classes.textOpen : ''}`}>
          <Typography
            variant="body2"
            color="primary"
            className={classes.pageTitle}
          >
            1. Recuperer la fiche information
          </Typography>
          <Typography
            variant="body2"
            color="primary"
            className={classes.pageTitle}
          >
            2. Créér la demande et importer le document rempli
          </Typography>
        </div>
      </div>
    </div>
  );
}
