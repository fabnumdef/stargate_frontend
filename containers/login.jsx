import React, { useState } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { LoginForm, ForgotPassForm, OpenIdForm } from '../components';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import PageTitle from '../components/styled/common/pageTitle';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import LoginLayout from '../components/loginForms/loginLayout';

const useStyles = makeStyles((theme) => ({
    fieldsStyle: {
        maxWidth: '70%'
    },
    forgotPassword: {
        color: theme.palette.primary.main,
        cursor: 'pointer',
        '&:hover': {
            color: theme.palette.primary.dark
        }
    },
    openIdSection: {
        marginTop: 60,
        height: 100,
        width: 250
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
        <LoginLayout>
            <PageTitle className={classes.connection}>Connexion</PageTitle>
            <RenderLogin />
            <Paper className={classes.openIdSection}>
                <OpenIdForm />
            </Paper>
        </LoginLayout>
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
