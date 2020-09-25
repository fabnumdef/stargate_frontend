import React from 'react';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(() => ({
  divBorder: {
    border: '1px solid yellow',
    transition: '2s',
  },
}));

export default function GroupRequestButton({ open }) {
  const classes = useStyles;

  return (
    <div style={classes.divBorder}>
      <Button variant='contained' color='primary' className={classes.button}>
        Nouvelle demande groupe
      </Button>
      {open && (
        <>
          <Typography variant='h6'>Nouvelle Demande groupe</Typography>
          <Typography variant='body2'>
            Nouvelle Demande groupeNouvelle Demande groupeNouvelle Demande groupe Nouvelle Demande
            groupeNouvelle Demande groupe
          </Typography>
        </>
      )}
    </div>
  );
}
