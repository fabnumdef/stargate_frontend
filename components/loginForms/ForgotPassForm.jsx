import React from 'react';
import { useForm } from 'react-hook-form';
import { makeStyles } from '@material-ui/core/styles';
import { gql, useMutation } from '@apollo/client';
import { useSnackBar } from '../../lib/hooks/snackbar';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import RoundButton from '../styled/common/roundButton';

const useStyles = makeStyles((theme) => ({
    submitButton: {
        margin: theme.spacing(3, 0, 2),
        padding: '6px 35px'
    }
}));

export const RESET_PASSWORD = gql`
    mutation resetPassword($email: EmailAddress!) {
        resetPassword(email: $email)
    }
`;

export default function ForgotPassForm() {
    const { register, handleSubmit, errors } = useForm();

    const [resetPassword] = useMutation(RESET_PASSWORD);
    const { addAlert } = useSnackBar();

    const classes = useStyles();

    const onSubmit = ({ email }) => {
        try {
            resetPassword({ variables: { email } });
            addAlert({ message: 'Demande enregistrée', severity: 'success' });
        } catch (e) {
            addAlert({ message: 'Une erreur est survenue', severity: 'warning' });
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
                fullWidth
                variant="outlined"
                type="email"
                label="Email"
                name="email"
                inputRef={register({
                    required: "L'adresse mail est obligatoire."
                    // validate: (value) => validator.isEmail(value) || 'Format invalide',
                })}
                error={Object.prototype.hasOwnProperty.call(errors, 'email')}
                helperText={errors.email && errors.email.message}
            />
            <Typography variant="body1">
                Merci d&apos;entrer votre identifiant. S&apos;il est enregistré dans notre base de
                données, vous recevrez un e-mail pour réinitialiser votre mot de passe.
            </Typography>
            <RoundButton
                className={classes.submitButton}
                variant="contained"
                color="primary"
                type="submit">
                Envoyer
            </RoundButton>
        </form>
    );
}
