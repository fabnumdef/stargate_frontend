import React from 'react';
import { Button } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import { MINDEF_CONNECT_REDIRECT_PAGE } from '../../utils/constants/appUrls';

const OPEN_ID_REQUEST = gql`
    mutation openIDRequest($redirectURI: String!) {
        openIDRequest(redirectURI: $redirectURI) {
            state
            redirectURI
            clientID
            responseType
            URL
            openIDServer
        }
    }
`;

const useStyles = makeStyles(() => ({
    root: {
        height: '100%'
    }
}));

const OpenIdForm = () => {
    const classes = useStyles();
    const [connectId] = useMutation(OPEN_ID_REQUEST, {
        variables: {
            redirectURI: `${window.location.origin.toString()}${MINDEF_CONNECT_REDIRECT_PAGE}`
        },
        onCompleted: ({ openIDRequest }) => {
            window.location.assign(openIDRequest.URL);
        }
    });
    return (
        <Grid container className={classes.root} justify="center" alignContent="center">
            <Button variant="outlined" onClick={() => connectId()}>
                Mindef Connect Logo
            </Button>
        </Grid>
    );
};

export default OpenIdForm;
