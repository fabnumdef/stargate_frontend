import React from 'react';
import classNames from 'classnames';
import { makeStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import { Controller, useForm } from 'react-hook-form';
import TextField from '@material-ui/core/TextField';
import FormHelperText from '@material-ui/core/FormHelperText';
import Button from '@material-ui/core/Button';
import { useSnackBar } from '../lib/snackbar';
import Template from './template';

const useStyles = makeStyles((theme) => ({
  account: {
    width: '100%',
    height: '75vh',
    minWidth: 300,
    display: 'block',
  },
  pageTitle: {
    margin: '16px 0',
    color: '#0d40a0',
    fontWeight: theme.typography.fontWeightBold,
  },
  pageTitleHolder: {
    borderBottom: '1px solid #e5e5e5',
    alignSelf: 'start',
  },
  formPassword: {
    padding: 8,
  },
  instruction: {
    fontStyle: 'italic',
    fontSize: '0.65rem',
  },
  instructionError: {
    color: 'red',
  },
  submitButton: {
    height: '50px',
  },
}));

export const EDIT_PASSWORD = gql`
    mutation editPassword($user: UserInput!) {
        editMe(user: $user) {
            id
        }
    }
`;

export default function Account() {
  const classes = useStyles();
  const [submitEditPassword] = useMutation(EDIT_PASSWORD);
  const { addAlert } = useSnackBar();
  const {
    handleSubmit, errors, control, reset,
  } = useForm({
    defaultValues: {
      password: '',
    },
  });

  const onSubmit = async ({ password }) => {
    try {
      await submitEditPassword({ variables: { user: { password } } });
      return addAlert({ message: 'Votre mot de passe a bien été modifié', severity: 'success' });
    } catch (e) {
      return e;
    }
  };

  return (
    <Template>
      <Grid container spacing={2} className={classes.account}>
        <Grid item sm={12} xs={12}>
          <Box display="flex" alignItems="center" className={classes.pageTitleHolder}>
            <Typography variant="h5" className={classes.pageTitle}>
              Mon Compte
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={3} sm={3}>
          <Typography variant="subtitle2" gutterBottom>
            Changement de mot de passe:
          </Typography>
        </Grid>
        <form onSubmit={handleSubmit(onSubmit)} className={classes.formPassword}>
          <Grid container spacing={2}>
            <Grid item md={6} sm={6} xs={12}>
              <Controller
                as={(
                  <TextField
                    label="Nouveau mot de passe"
                    inputProps={{ 'data-testid': 'form-password', type: 'password' }}
                    error={Object.prototype.hasOwnProperty.call(errors, 'password')}
                    helperText={errors.password && errors.password.message}
                    fullWidth
                  />
                )}
                rules={{ minLength: 8 }}
                control={control}
                name="password"
                defaultValue=""
              />
              <FormHelperText className={classNames(
                classes.instruction,
                { [classes.instructionError]: errors.password },
              )}
              >
                8 caractères minimum
              </FormHelperText>
            </Grid>
            <Button type="submit" variant="contained" color="primary" onClick={() => reset({ password: '' })} className={classes.submitButton}>
              Envoyer
            </Button>
          </Grid>
        </form>

      </Grid>

    </Template>
  );
}
