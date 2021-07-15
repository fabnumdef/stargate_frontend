import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { makeStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/client';
import { Controller, useForm } from 'react-hook-form';
import TextField from '@material-ui/core/TextField';
import FormHelperText from '@material-ui/core/FormHelperText';
import { useSnackBar } from '../../lib/hooks/snackbar';
import { useRouter } from 'next/router';
import RoundButton from '../styled/common/roundButton';

const useStyles = makeStyles(() => ({
    account: {
        width: '100%',
        height: '75vh',
        minWidth: 300,
        display: 'block'
    },
    pageTitle: {
        margin: '16px 0',
        fontWeight: 'bold',
        textTransform: 'uppercase'
    },
    pageTitleHolder: {
        borderBottom: '1px solid #e5e5e5',
        alignSelf: 'start'
    },
    subtitleContainer: {
        marginTop: '50px'
    },
    formPassword: {
        padding: 8
    },
    instruction: {
        fontStyle: 'italic',
        fontSize: '0.65rem'
    },
    instructionError: {
        color: 'red'
    },
    submitButton: {
        marginTop: '20px'
    }
}));

export const RESET_PASSWORD = gql`
    mutation resetPassword($email: EmailAddress!, $token: String!, $password: String!) {
        resetPassword(email: $email, token: $token, password: $password)
    }
`;

const ResetPassForm = ({ resetPass, setResetPass }) => {
    const classes = useStyles();
    const router = useRouter();
    const [submitResetPassword] = useMutation(RESET_PASSWORD);
    const { addAlert } = useSnackBar();

    const { handleSubmit, errors, control, reset, watch } = useForm({
        defaultValues: {
            password: '',
            confirmPassword: ''
        }
    });

    const resetPasswordReq = async (password) => {
        try {
            await submitResetPassword({
                variables: { email: resetPass.email, token: resetPass.token, password }
            });
            reset({ password: '', confirmPassword: '' });
            setResetPass(null);
            addAlert({
                message: 'Votre mot de passe a bien été enregistré',
                severity: 'success'
            });
            return router.push('/');
        } catch (e) {
            console.log({ e });
            switch (e.message) {
                case 'Expired link':
                    addAlert({
                        message: 'Lien expiré, merci de refaire une demande de réinitialisation',
                        severity: 'warning'
                    });
                    return router.push('/');
                default:
                    return addAlert({
                        message: 'Erreur réseau',
                        severity: 'warning'
                    });
            }
        }
    };

    const onSubmit = async ({ password }) => {
        return resetPasswordReq(password);
    };

    return (
        <>
            <Grid container spacing={2} className={classes.account}>
                <Grid item sm={12} xs={12}>
                    <Box display="flex" alignItems="center" className={classes.pageTitleHolder}>
                        <Typography variant="h5" className={classes.pageTitle}>
                            Réinitialisation du mot de passe Stargate
                        </Typography>
                    </Box>
                </Grid>
                <form onSubmit={handleSubmit(onSubmit)} className={classes.formPassword}>
                    <Grid container spacing={2}>
                        <Grid item md={6} sm={6} xs={12}>
                            <Controller
                                as={
                                    <TextField
                                        label="Nouveau mot de passe"
                                        inputProps={{
                                            'data-testid': 'form-password',
                                            type: 'password'
                                        }}
                                        error={Object.prototype.hasOwnProperty.call(
                                            errors,
                                            'password'
                                        )}
                                        helperText={errors.password && errors.password.message}
                                        fullWidth
                                    />
                                }
                                rules={{ minLength: 8, required: true }}
                                control={control}
                                name="password"
                                defaultValue=""
                            />
                            <FormHelperText
                                className={classNames(classes.instruction, {
                                    [classes.instructionError]: errors.password
                                })}>
                                8 caractères minimum
                            </FormHelperText>
                            <Controller
                                as={
                                    <TextField
                                        label="Confirmation du mot de passe"
                                        inputProps={{
                                            'data-testid': 'form-password-confirmation',
                                            type: 'password'
                                        }}
                                        error={Object.prototype.hasOwnProperty.call(
                                            errors,
                                            'confirmPassword'
                                        )}
                                        helperText={
                                            errors.confirmPassword && errors.confirmPassword.message
                                        }
                                        fullWidth
                                    />
                                }
                                rules={{ validate: (value) => value === watch('password') }}
                                control={control}
                                name="confirmPassword"
                                defaultValue=""
                            />
                            {errors.confirmPassword && (
                                <FormHelperText
                                    className={classNames(classes.instruction, {
                                        [classes.instructionError]: errors.confirmPassword
                                    })}>
                                    Vos mots de passe ne correspondent pas
                                </FormHelperText>
                            )}
                        </Grid>
                    </Grid>
                    <RoundButton
                        type="submit"
                        variant="contained"
                        color="primary"
                        className={classes.submitButton}>
                        Envoyer
                    </RoundButton>
                </form>
            </Grid>
        </>
    );
};

ResetPassForm.propTypes = {
    resetPass: PropTypes.objectOf(PropTypes.string),
    setResetPass: PropTypes.func.isRequired
};

export default ResetPassForm;
