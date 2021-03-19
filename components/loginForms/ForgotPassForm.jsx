import React from 'react';
import { useForm } from 'react-hook-form';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { gql, useMutation } from '@apollo/client';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { useSnackBar } from '../../lib/hooks/snackbar';

const useStyles = makeStyles(() => ({
    formPasswordContainer: {
        marginTop: '22%',
        maxWidth: '80%',
        margin: 'auto',
        '& p': {
            textAlign: 'justify'
        }
    },
    submitButton: {
        marginTop: '5%',
        width: '50%'
    }
}));

export const RESET_PASSWORD = gql`
    mutation resetPassword($email: EmailAddress!) {
        resetPassword(email: $email)
    }
`;

const CssTextField = withStyles({
    root: {
        '& label.Mui-focused': {
            color: 'white'
        },
        '& .MuiFormLabel-root': {
            color: 'white'
        },
        '& .MuiInput-underline:before': {
            borderBottomColor: 'grey'
        },
        '& .MuiInput-underline:after': {
            borderBottomColor: 'white'
        },
        '& label.Mui-root': {
            color: 'white'
        },
        '& .MuiInputBase-input': {
            color: 'white'
        },
        width: '60%'
    }
})(TextField);

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
        <div className={classes.formPasswordContainer}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <CssTextField
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
                <p>
                    Merci d&apos;entrer votre identifiant. S&apos;il est enregistré dans notre base
                    de données, vous recevrez un e-mail pour réinitialiser votre mot de passe.
                </p>
                <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    className={classes.submitButton}>
                    Envoyer
                </Button>
            </form>
        </div>
    );
}
