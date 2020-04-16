import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Link from 'next/link';
import { fade } from '@material-ui/core/styles/colorManipulator';


import VpnKeyIcon from '@material-ui/icons/VpnKey';
import ListAltIcon from '@material-ui/icons/ListAlt';
import Template from './template';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    width: '100%',
    height: '75vh',
    minWidth: 300,
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  buttonLink: {
    background: fade(theme.palette.primary.main, 0.1),
    color: theme.palette.primary.main,
    border: `3px solid ${theme.palette.primary.main}`,
    minWidth: '300px',
    minHeight: '150px',
    maxWidth: '300px',
    maxHeight: '150px',
    borderRadius: '5%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
  },
  img: {
    maxWidth: '100px',
  },
  icon: {
    fontSize: 80,
  },
  typo: {
    marginRight: '8%',
  },
}));

export default function Accueil() {
  const classes = useStyles();

  return (
    <Template>
      <div className={classes.root}>
        <div>
          <Link href="/formulaire">
            <div className={classes.buttonLink}>
              <Typography variant="h5" className={classes.typo}>
                <Box m={1}>Nouvelle</Box>
                <Box m={1}>Demande</Box>
              </Typography>
              <VpnKeyIcon className={classes.icon} />
            </div>
          </Link>
        </div>

        <div>
          <Link href="/mesDemandes">
            <div className={classes.buttonLink}>
              <Typography variant="h5" className={classes.typo}>
                <Box m={1}>Mes</Box>
                <Box m={1}>Demandes</Box>
              </Typography>
              <ListAltIcon className={classes.icon} />
            </div>
          </Link>
        </div>
      </div>
    </Template>
  );
}
