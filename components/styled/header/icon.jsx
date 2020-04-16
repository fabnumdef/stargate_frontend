import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

const useStyles = makeStyles((theme) => ({
  large: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
  style: {
    color: theme.palette.primary.main,
  },
}));

export default function AvatarIcone() {
  const classes = useStyles();
  return <AccountCircleIcon className={`${classes.large} ${classes.style}`} />;
}
