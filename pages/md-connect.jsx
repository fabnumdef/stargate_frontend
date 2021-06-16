import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';

import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';

import LoginLayout from '../components/loginForms/loginLayout';
import Fade from '@material-ui/core/Fade';
import { useLogin } from '../lib/loginContext';

const AUTHENTICATION_SUCCESS = 'AUTHENTICATION_SUCCESS';
const AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR';

const OPEN_ID_LOGIN = gql`
    mutation openIDLogin($redirectURI: String!, $state: String!, $authorizationCode: String) {
        openIDLogin(
            redirectURI: $redirectURI
            state: $state
            authorizationCode: $authorizationCode
        ) {
            jwt
        }
    }
`;

const useStyles = makeStyles(() => ({
    root: {
        height: '100%',
        marginTop: '10vw'
    },
    loadingProgress: {
        marginBottom: 30
    },
    authenticationMessage: {
        fontWeight: 'bold',
        textTransform: 'uppercase',
        fontSize: '1.2rem'
    },
    authenticationIcon: {
        fontSize: 100,
        marginBottom: 30
    }
}));

function MdConnect() {
    const router = useRouter();
    const classes = useStyles();
    const setUserConnection = useLogin();

    const redirect = () =>
        setTimeout(() => {
            router.push('/');
        }, 2000);

    const [authenticationResult, setAuthenticationResult] = useState(null);
    const [openIDLogin, { data, error }] = useMutation(OPEN_ID_LOGIN, {
        variables: {
            redirectURI: 'http://localhost/md-connect',
            state: router.query.state,
            authorizationCode: router.query.code
        },
        onCompleted: async ({ jwt }) => {
            setAuthenticationResult(AUTHENTICATION_SUCCESS);
            await setUserConnection(jwt);
            redirect();
        },
        onError: () => {
            setAuthenticationResult(AUTHENTICATION_ERROR);
            redirect();
        }
    });

    if (!router.query.state || !router.query.code) {
        router.push('/');
        return '';
    }

    useEffect(() => {
        if (!data || !error) {
            openIDLogin();
        }
    }, [data]);
    return (
        <LoginLayout>
            <Grid container justify="center" className={classes.root}>
                {authenticationResult ? (
                    <Fade in={!!authenticationResult} timeout={1000}>
                        <div>
                            <Grid container justify="center">
                                {authenticationResult === AUTHENTICATION_SUCCESS ? (
                                    <CheckCircleOutlineIcon
                                        color="success"
                                        className={classes.authenticationIcon}
                                    />
                                ) : (
                                    <ErrorOutlineIcon
                                        color="error"
                                        className={classes.authenticationIcon}
                                    />
                                )}
                            </Grid>
                            <Typography className={classes.authenticationMessage}>
                                {authenticationResult === AUTHENTICATION_SUCCESS
                                    ? 'Authentification réussie'
                                    : "Erreur d'authentification"}
                            </Typography>
                            <Typography>(Redirection en cours)</Typography>
                        </div>
                    </Fade>
                ) : (
                    <div>
                        <Grid container justify="center" className={classes.loadingProgress}>
                            <CircularProgress size={100} />
                        </Grid>
                        <Typography className={classes.authenticationMessage}>
                            Authentification en cours
                        </Typography>
                    </div>
                )}
            </Grid>
        </LoginLayout>
    );
}

export default MdConnect;
