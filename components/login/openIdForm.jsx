import React from 'react';
import { Button } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import { MINDEF_CONNECT_REDIRECT_PAGE } from '../../utils/constants/appUrls';
import Typography from '@material-ui/core/Typography';

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
    },
    mindefLogo: {
        height: 50,
        marginRight: 10
    },
    mindefBtn: {
        width: '100%',
        padding: '10px 15px',
        boxShadow: '0 0 10px 2px rgba(93, 119, 255, 0.1)'
    },
    textBtn: {
        fontWeight: 'bold',
        textTransform: 'none',
        fontSize: '1.2rem'
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
            <Button variant="outlined" onClick={() => connectId()} className={classes.mindefBtn}>
                <img
                    src="/img/logomindef.png"
                    alt="logo mindef connect"
                    className={classes.mindefLogo}
                />
                <Typography variant="body1" className={classes.textBtn}>
                    MindefConnect
                </Typography>
            </Button>
        </Grid>
    );
};

export default OpenIdForm;
