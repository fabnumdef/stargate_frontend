import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { fade } from '@material-ui/core/styles/colorManipulator';
import { LoginForm, ForgotPassForm } from '../components';

const useStyles = makeStyles((theme) => ({
  mainLoginForm: {
    marginTop: '10vh',
  },
  logoContainer: {
    textAlign: 'center',
  },
  subLoginForm: {
    backgroundColor: 'rgba(14, 65, 148, 0.90)',
    color: 'white',
    height: '40vh',
    width: '40vh',
    minWidth: '450px',
    minHeight: '450px',
    margin: '30px auto',
    borderRadius: '50%',
    border: '1.2rem solid rgba(255, 255, 255, .2)',
    boxShadow: '5px 5px 6px 0 rgba(0, 0, 0, 0.16)',
    position: 'relative',
    '& form': {
      marginTop: '20%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
  },
  switchButton: {
    position: 'absolute',
    marginTop: '5%',
    textAlign: 'center',
    cursor: 'pointer',
    width: '100%',
    fontSize: '1rem',
  },
  star: {
    fontSize: '2.8em',
    lineHeight: '1.34',
    letterSpacing: '0.4px',
    color: fade(theme.palette.primary.main, 0.65),
  },
  gate: {
    fontSize: '2.8em',
    lineHeight: '1.34',
    letterSpacing: '0.4px',
    color: theme.palette.secondary.main,
  },
  buttonStyle: {
    outline: 'none',
  },
}));

const SubmitButton = ({ text, label }) => {
  const classes = useStyles();
  return <button className={classes.submitButton} type="submit" aria-label={label}>{text}</button>;
};

function LoginPage() {
  const [forgottenPass, setForgottenPass] = useState(false);
  const classes = useStyles();

  const switchForms = () => {
    setForgottenPass(!forgottenPass);
  };

  return (
    <div className={classes.mainLoginForm}>
      <div className={classes.logoContainer}>
        <span className={classes.star}>STAR</span>
        <span className={classes.gate}>GATE</span>
      </div>
      <div className={classes.subLoginForm}>
        {forgottenPass ? <ForgotPassForm switchForms={switchForms} /> : <LoginForm />}
        <div className={classes.switchButton} role="button" onClick={switchForms} onKeyDown={switchForms} aria-hidden>
          {forgottenPass ? 'Retour' : 'Mot de passe perdu ?'}
        </div>
      </div>
    </div>
  );
}

SubmitButton.propTypes = {
  text: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
};

export default LoginPage;
