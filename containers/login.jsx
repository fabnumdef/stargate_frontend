import React, { useState } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { LoginForm, ForgotPassForm } from '../components';
import Grid from '@material-ui/core/Grid';
import CssBaseline from '@material-ui/core/CssBaseline';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import PageTitle from '../components/styled/common/pageTitle';
import useMediaQuery from '@material-ui/core/useMediaQuery';

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
    fieldsStyle: {
        maxWidth: '70%'
    },
    minArmLogo: {
        width: '97px',
        height: '86px'
    },
    gridLogos: {
        bottom: 40,
        position: 'absolute',
        display: 'flex',
        alignItems: 'center'
    },
    forgotPassword: {
        color: theme.palette.primary.main,
        cursor: 'pointer',
        '&:hover': {
            color: theme.palette.primary.dark
        }
    }
}));

const SubmitButton = ({ text, label }) => {
    const classes = useStyles();
    return (
        <button className={classes.submitButton} type="submit" aria-label={label}>
            {text}
        </button>
    );
};

function LoginPage() {
    const classes = useStyles();

    return (
        <Grid container component="main" className={classes.root}>
            <CssBaseline />
            <Grid item xs={false} sm={3} md={4} lg={6} className={classes.gateStyle} />
            <Grid item xs={12} sm={9} md={8} lg={6} component={Paper} elevation={6} square>
                <div className={classes.paper}>
                    <img src="/img/logo.svg" alt="STARGATE" className={classes.appName} />
                    <PageTitle className={classes.connection}>Connexion</PageTitle>
                    <RenderLogin />
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
function RenderLogin() {
    const [forgottenPass, setForgottenPass] = useState(false);
    const classes = useStyles();
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.up('lg'));

    const switchForms = () => {
        setForgottenPass(!forgottenPass);
    };
    return (
        <div className={matches ? classes.fieldsStyle : ''}>
            {forgottenPass ? <ForgotPassForm switchForms={switchForms} /> : <LoginForm />}
            <Typography
                onClick={switchForms}
                onKeyDown={switchForms}
                className={classes.forgotPassword}>
                {forgottenPass ? 'Retour' : 'Mot de passe perdu ?'}
            </Typography>
        </div>
    );
}
SubmitButton.propTypes = {
    text: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired
};

export default LoginPage;
