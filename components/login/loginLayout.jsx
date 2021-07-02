import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import CssBaseline from '@material-ui/core/CssBaseline';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles((theme) => ({
    root: {
        height: '100vh'
    },
    gateStyle: {
        backgroundImage: "url('/img/portail.jpg')",
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'bottom'
    },
    paper: {
        padding: theme.spacing(9, 12),
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        position: 'relative'
    },
    appName: {
        marginBottom: '10vh',
        width: 350
    },
    gridLogos: {
        bottom: 40,
        position: 'absolute',
        display: 'flex',
        alignItems: 'center'
    }
}));

function LoginLayout({ children }) {
    const classes = useStyles();

    return (
        <Grid container component="main" className={classes.root}>
            <CssBaseline />
            <Grid item xs={false} sm={3} md={4} lg={6} className={classes.gateStyle} />
            <Grid item xs={12} sm={9} md={8} lg={6} component={Paper} elevation={6} square>
                <div className={classes.paper}>
                    <img src="/img/logo.svg" alt="STARGATE" className={classes.appName} />
                    {children}
                    <div className={classes.gridLogos}>
                        <img
                            src="/img/logo-fabrique-numerique.svg"
                            alt="Logo de la fabrique numérique"
                        />
                    </div>
                </div>
            </Grid>
        </Grid>
    );
}

LoginLayout.propTypes = {
    children: PropTypes.node.isRequired
};

export default LoginLayout;
