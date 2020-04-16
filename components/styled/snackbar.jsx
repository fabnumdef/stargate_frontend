import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import Fade from '@material-ui/core/Fade';

export default function TransitionsSnackbar(props) {
  const {
    message, open,
  } = props;

  return (
    <Snackbar
      TransitionComponent={Fade}
      autoHideDuration={5000}
      message={message}
      open={open}
    />
  );
}
