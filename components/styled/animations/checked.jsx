import React from 'react';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  checkmark: {
    width: '26px',
    height: '26px',
    borderRadius: '50%',
    display: 'block',
    strokeWidth: 2,
    stroke: '#fff',
    strokeMiterlimit: 10,
    boxShadow: 'inset 0px 0px 0px #28a745',
    animation: '$fill 0.5s ease-in-out 0.4s forwards, scale 0.3s ease-in-out 0.9s both',
  },
  checkmark__circle: {
    strokeDasharray: 166,
    strokeDashoffset: 166,
    strokeWidth: 2,
    strokeMiterlimit: 10,
    stroke: '#28a745',
    fill: 'none',
    animation: '$stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards',
  },
  checkmark__check: {
    transformOrigin: '50% 50%',
    strokeDasharray: 48,
    strokeDashoffset: 48,
    animation: '$stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards',
  },
  '@keyframes scale': {
    '0%': { transform: 'none' },
    '100%': { transform: 'none' },
    '50%': { transform: 'scale3d(1.1, 1.1, 1)' },
  },
  '@keyframes fill': {
    '100%': { boxShadow: 'inset 0px 0px 0px 30px #28a745' },
  },
  '@keyframes stroke': {
    '100%': { strokeDashoffset: 0 },
  },
}));

export default function CheckAnimation() {
  const classes = useStyles();
  return (
    <svg className={classes.checkmark} viewBox="0 0 52 52">
      <circle className={classes.checkmark__circle} cx="26" cy="26" r="25" fill="none" />
      <path className={classes.checkmark__check} fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
    </svg>
  );
}
