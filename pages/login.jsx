import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { LoginForm, ForgotPassForm } from '../components';
import { withApollo } from '../lib/apollo';

const useStyles = makeStyles((theme) => ({
  mainLoginForm: {
    marginTop: '15vh',
  },
  logoContainer: {
    textAlign: 'center',
  },
  subLoginForm: {
    backgroundColor: theme.palette.primary.main,
    color: 'white',
    height: '40vh',
    width: '40vh',
    minWidth: '300px',
    minHeight: '300px',
    margin: 'auto',
    borderRadius: '50%',
    border: '1.2rem solid rgba(255, 255, 255, .2)',
    boxShadow: '5px 5px 6px 0 rgba(0, 0, 0, 0.16)',
    position: 'relative',
    '& form': {
      marginTop: '22%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      '& button': {
        display: 'none',
      },
    },
    '& button': {
      position: 'absolute',
      color: 'white',
      cursor: 'pointer',
      bottom: '15%',
      width: '100%',
      fontSize: '1rem',
      backgroundColor: 'transparent',
      border: 'none',
    },
  },
  logo: {
    height: '10vh',
  },
  buttonStyle: {
    outline: 'none',
  },
}));

function LoginPage() {
  const [forgottenPass, setForgottenPass] = useState(false);
  const classes = useStyles();

  const switchForms = () => {
    setForgottenPass(!forgottenPass);
  };


  return (
    <div className={classes.mainLoginForm}>
      <div className={classes.logoContainer}>
        <img className={classes.logo} src="/img/logo/stargate.png" alt="logo" />
      </div>
      <div className={classes.subLoginForm}>
        {forgottenPass
          ? <ForgotPassForm />
          : <LoginForm />}
        <button className={classes.buttonStyle} type="button" onClick={switchForms}>{forgottenPass ? 'Retour' : 'Mot de passe perdu ?'}</button>
      </div>
    </div>
  );
}

export default withApollo()(LoginPage);
