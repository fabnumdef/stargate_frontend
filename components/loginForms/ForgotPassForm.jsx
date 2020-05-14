import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import Button from '@material-ui/core/Button';
import { useSnackBar } from '../../lib/ui-providers/snackbar';
import { CssTextField } from './LoginForm';

const useStyles = makeStyles(() => ({
  formPasswordContainer: {
    marginTop: '22%',
    maxWidth: '80%',
    margin: 'auto',
    '& p': {
      textAlign: 'justify',
    },
  },
  submitButton: {
    marginTop: '5%',
    width: '50%',
  },
}));

export const RESET_PASSWORD = gql`
    mutation resetPassword($email: EmailAddress!) {
        resetPassword(email: $email)
    }
`;

export default function ForgotPassForm() {
  const [email, setEmail] = useState();
  const [resetPassword] = useMutation(RESET_PASSWORD);
  const { addAlert } = useSnackBar();

  const classes = useStyles();

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    if (!email) {
      addAlert({ message: "Merci d'entrer un identifiant", severity: 'warning' });
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
      <form onSubmit={handleSubmit}>
        <CssTextField
          type="email"
          label="Email"
          value={email}
          onChange={(evt) => setEmail(evt.target.value)}
        />
        <p>
          Merci d&apos;entrer votre identifiant. S&apos;il est enregistré dans notre base de
          données, vous recevrez un e-mail pour réinitialiser votre mot de passe.
        </p>
        <Button variant="contained" color="primary" type="submit" className={classes.submitButton}>
          Envoyer
        </Button>
      </form>
    </div>
  );
}
