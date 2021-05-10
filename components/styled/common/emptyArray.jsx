import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import EmptyArrayLogo from '../animations/empty';
const useStyles = makeStyles({
    svgContent: {
        textAlign: 'center',
        padding: '16px',
        color: '#5AA0FF',
        '&:first-child': {
            fontSize: '3rem'
        }
    },
    textContent: {
        maxWidth: '460px',
        margin: '0 auto',
        padding: '16px'
    },
    icon: {
        fontSize: '5rem'
    }
});

export default function EmptyArray({ type }) {
    const classes = useStyles();

    function getText() {
        switch (type) {
            case 'en cours':
                return 'demande en cours';
            case 'terminée':
                return 'demande finalisée';
            case 'à traiter':
                return 'demande à traiter';
            case 'à exporter':
                return 'traitement à exporter';
            case 'finalisé':
                return 'traitement finalisé';
            default:
                break;
        }
    }

    return (
        <div>
            <div className={classes.svgContent}>
                <EmptyArrayLogo />
            </div>
            <div className={classes.textContent}>
                <Typography variant="h6" style={{ textAlign: 'center' }}>
                    {`Vous n'avez pas de ${getText()} pour le moment !`}
                </Typography>
            </div>
        </div>
    );
}

EmptyArray.propTypes = {
    type: PropTypes.string.isRequired
};
