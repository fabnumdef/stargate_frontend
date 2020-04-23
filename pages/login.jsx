// @flow
import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { LoginForm, ForgotPassForm } from '../components';
import { withApollo } from '../lib/apollo';

const useStyles = makeStyles(() => ({
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
    margin: 'auto',
    borderRadius: '50%',
    border: '1.2rem solid rgba(255, 255, 255, .2)',
    boxShadow: '5px 5px 6px 0 rgba(0, 0, 0, 0.16)',
    position: 'relative',
    '& form': {
      textAlign: 'center',
      '& input': {
        display: 'block',
        backgroundColor: 'transparent',
        color: 'white',
        border: 'none',
        borderBottom: '1px solid white',
        margin: '35px auto 0',
        fontSize: '1.1rem',
        maxWidth: '188px',
      },
    },
  },
  switchButton: {
    position: 'absolute',
    color: 'white',
    cursor: 'pointer',
    bottom: '12%',
    width: '100%',
    fontSize: '1rem',
    backgroundColor: 'transparent',
    border: 'none',
  },
  logo: {
    height: '10vh',
  },
  submitButton: {
    margin: '30px auto 0',
    fontSize: '1rem',
    color: 'rgba(247, 249, 252, 0.99)',
    width: '188px',
    height: '31px',
    border: 'none',
    borderRadius: '2px',
    boxShadow: '5px 3px 6px 0 rgba(0, 0, 0, 0.16)',
    backgroundColor: '#0e4194',
    cursor: 'pointer',
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
        <img className={classes.logo} src="/img/logo/stargate.png" alt="logo" />
      </div>
      <div className={classes.subLoginForm}>
        {forgottenPass
          ? <ForgotPassForm Button={SubmitButton} />
          : <LoginForm Button={SubmitButton} />}
        <button className={classes.switchButton} type="button" onClick={switchForms}>{forgottenPass ? 'Retour' : 'Mot de passe perdu ?'}</button>
      </div>
    </div>
  );
}

SubmitButton.propTypes = {
  text: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
};

export default withApollo()(LoginPage);
