import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    marginBottom: '2vh',
  },
  subtitle: {
    marginBottom: '2vh',
    marginLeft: '1vw',
  },
  myTextField: {
    marginBottom: '2vh',
    marginLeft: '1vw',
    minWidth: '30vw',
  },
  buttons: {
    display: 'flex',
    justifyContent: 'space-around',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

export default function TransitionsModal() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Refuser
      </Button>
      <Modal
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div className={classes.paper}>
            <Typography className={classes.title}>
              Refuser la demande:
            </Typography>
            <Typography className={classes.subtitle}>Raison:</Typography>
            <TextField
              className={classes.myTextField}
              name="raisonRefus"
              variant="outlined"
              fullWidth
              multiline
            />
            <div className={classes.buttons}>
              <Button variant="outlined" color="primary" onClick={handleClose}>
                Annuler
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                onClick={handleClose}
              >
                Soumettre
              </Button>
            </div>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}
