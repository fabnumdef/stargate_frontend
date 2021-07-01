import React, { useState } from 'react';
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
import Button from '@material-ui/core/Button';
import { useRouter } from 'next/router';
import { useSnackBar } from '../lib/hooks/snackbar';

const useStyles = makeStyles(() => ({
    account: {
        width: '100%',
        height: '75vh',
        minWidth: 300,
        display: 'block'
    },
    pageTitle: {
        margin: '16px 0',
        color: '#0d40a0',
        fontWeight: 'bold'
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
        height: '50px',
        marginTop: '20px'
    }
}));

export const RESET_PASSWORD = gql`
    mutation resetPassword($email: EmailAddress!, $token: String!, $password: String!) {
        resetPassword(email: $email, token: $token, password: $password)
    }
`;

export const EDIT_PASSWORD = gql`
    mutation editPassword($user: OwnUserInput!, $currentPassword: String!) {
        editMe(user: $user, currentPassword: $currentPassword) {
            id
        }
    }
`;

export default function Account() {
    const classes = useStyles();
    const router = useRouter();
    const [submitEditPassword] = useMutation(EDIT_PASSWORD);
    const [submitResetPassword] = useMutation(RESET_PASSWORD);
    const { addAlert } = useSnackBar();
    const [resetPass, setResetPass] = useState(() => {
        if (router.query.token && router.query.email) {
            return {
                email: router.query.email,
                token: router.query.token
            };
        }
        return null;
    });
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
            return addAlert({
                message: 'Votre mot de passe a bien été enregistré',
                severity: 'success'
            });
        } catch (e) {
            console.log({ e });
            return addAlert({
                message: 'Erreur réseau',
                severity: 'warning'
            });
        }
    };

    const changePasswordReq = async (password, currentPassword) => {
        try {
            await submitEditPassword({ variables: { user: { password }, currentPassword } });
            reset({ password: '', confirmPassword: '' });
            if (resetPass) {
                setResetPass(null);
            }
            return addAlert({
                message: 'Votre mot de passe a bien été enregistré',
                severity: 'success'
            });
        } catch (e) {
            switch (e.message) {
                case 'Invalid password':
                    return addAlert({
                        message: 'Merci de vérifier votre mot de passe actuel',
                        severity: 'warning'
                    });
                default:
                    return addAlert({
                        message: 'Erreur réseau',
                        severity: 'warning'
                    });
            }
        }
    };

    const onSubmit = async ({ password, currentPassword }) => {
        if (resetPass) {
            return resetPasswordReq(password);
        }
        return changePasswordReq(password, currentPassword);
    };

    return (
        <>
            <Grid container spacing={2} className={classes.account}>
                <Grid item sm={12} xs={12}>
                    <Box display="flex" alignItems="center" className={classes.pageTitleHolder}>
                        <Typography variant="h5" className={classes.pageTitle}>
                            Mon Compte
                        </Typography>
                    </Box>
                </Grid>
                <Grid item xs={3} sm={3} className={classes.subtitleContainer}>
                    <Typography variant="subtitle2" gutterBottom>
                        {resetPass
                            ? 'Réinitialisation du mot de passe:'
                            : 'Changement de mot de passe:'}
                    </Typography>
                </Grid>
                <form onSubmit={handleSubmit(onSubmit)} className={classes.formPassword}>
                    <Grid container spacing={2}>
                        <Grid item md={6} sm={6} xs={12}>
                            {!resetPass && (
                                <Controller
                                    as={
                                        <TextField
                                            label="Mot de passe actuel"
                                            inputProps={{
                                                'data-testid': 'form-old-password',
                                                type: 'password'
                                            }}
                                            error={Object.prototype.hasOwnProperty.call(
                                                errors,
                                                'currentPassword'
                                            )}
                                            helperText={errors.password && errors.password.message}
                                            fullWidth
                                        />
                                    }
                                    rules={{ minLength: 8, required: true }}
                                    control={control}
                                    name="currentPassword"
                                    defaultValue=""
                                />
                            )}
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
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        className={classes.submitButton}>
                        Envoyer
                    </Button>
                </form>
            </Grid>
        </>
    );
}
