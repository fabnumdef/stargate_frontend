import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  statusLegend: {
    float: 'right',
  },
  list: {
    right: 0,
    listStyle: 'none',
    color: theme.palette.primary.main,
    fontSize: '10px',
  },
}));

export default function StatusLegend() {
  const classes = useStyles();

  const statusLegend = [
    { label: 'VA', fullLabel: 'Visiteur Accompagné' },
    { label: 'VL', fullLabel: 'Visiteur Libre' },
    { label: 'L', fullLabel: 'Libre' },
    { label: 'VIP', fullLabel: 'Autorité' },
  ];

  return (
    <div className={classes.statusLegend}>
      <ul className={classes.list}>
        { statusLegend.map((item) => (
          item.fullLabel && <li>{ `${item.label} : ${item.fullLabel}` }</li>
        )) }
      </ul>
    </div>
  );
}
