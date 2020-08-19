import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import FaceIcon from '@material-ui/icons/Face';

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
  return <FaceIcon className={`${classes.large} ${classes.style}`} />;
}
