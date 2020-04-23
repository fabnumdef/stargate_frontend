import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import { useSnackBar } from '../../lib/snackbar';

const useStyles = makeStyles(() => ({
  formPasswordContainer: {
    marginTop: '25%',
    maxWidth: '80%',
    margin: 'auto',
    '& p': {
      textAlign: 'justify',
    },
  },
}));

export const RESET_PASSWORD = gql`
    mutation resetPassword($email: EmailAddress!) {
        resetPassword(email: $email)
    }
`;

export default function ForgotPassForm({ Button }) {
  const [email, setEmail] = useState();
  const [resetPassword] = useMutation(RESET_PASSWORD);
  const { addAlert } = useSnackBar();

  const classes = useStyles();

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    if (!email) {
      addAlert({ message: 'Merci d\'entrer un identifiant', severity: 'warning' });
      return;
    }
    try {
      await resetPassword({ variables: { email } });
      addAlert({ message: 'Demande enregistrée', severity: 'success' });
      setEmail('');
    } catch (e) {
      addAlert({ message: 'Une erreur est survenue', severity: 'warning' });
    }
  };

  return (
    <div className={classes.formPasswordContainer}>
      <form onSubmit={handleSubmit} className={classes.formPassword}>
        <label htmlFor="email">
          <input type="email" name="email" placeholder="Identifiant" value={email} onChange={(evt) => setEmail(evt.target.value)} />
        </label>
        <p>
          Merci d&apos;entrer votre identifiant.
          S&apos;il est enregistré dans notre base de données,
          vous recevrez un e-mail pour réinitialiser votre mot de passe.
        </p>
        <Button text="Envoyer" label="submit-form-password" />
      </form>
    </div>
  );
}

ForgotPassForm.propTypes = {
  Button: PropTypes.element.isRequired,
};
