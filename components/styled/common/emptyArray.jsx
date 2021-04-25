import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import MyRequestsIcon from '../../icons/MyRequestsIcon';
import MyTreatmentsIcon from '../../icons/MyTreatmentsIcon';

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
        fontSize: '3rem'
    }
});

export default function EmptyArray({ type }) {
    const classes = useStyles();

    function getIcon() {
        switch (type) {
            case 'en cours':
            case 'terminée':
                return <MyRequestsIcon className={classes.icon} />;
            case 'à traiter':
            case 'à exporter':
            case 'finalisé':
                return <MyTreatmentsIcon className={classes.icon} />;
            default:
                break;
        }
    }

    function getTest() {
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
            <div className={classes.svgContent}>{getIcon()}</div>
            <div className={classes.textContent}>
                <Typography variant="subtitle2" style={{ textAlign: 'center' }}>
                    {`Vous n'avez pas de ${getTest()} pour le moment !`}
                </Typography>
            </div>
        </div>
    );
}

EmptyArray.propTypes = {
    type: PropTypes.string.isRequired
};
