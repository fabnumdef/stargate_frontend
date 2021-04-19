import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import { format } from 'date-fns';

const useStyles = makeStyles(() => ({
    root: {
        maxWidth: '300px'
    },
    categorie: {
        fontWeight: 'bold'
    },
    row: {
        display: 'block'
    }
}));

export default function DetailsInfosRequest({ request }) {
    const classes = useStyles();

    if (!request) {
        return '';
    }

    return (
        <div className={classes.root}>
            <Typography variant="subtitle2" color="primary" className={classes.categorie}>
                {request.id}
            </Typography>
            <div className={classes.row}>
                <Typography variant="body1" display="inline" className={classes.categorie}>
                    Demandeur :{' '}
                </Typography>
                <Typography variant="body2" display="inline">
                    {request?.owner?.lastname ?? ''} {request.owner?.firstname ?? ''}
                </Typography>
            </div>

            <div className={classes.row}>
                <Typography variant="body1" display="inline" className={classes.categorie}>
                    Période :{' '}
                </Typography>
                <Typography variant="body2" display="inline">
                    {format(new Date(request.from), 'dd/MM/yyyy')} au{' '}
                    {format(new Date(request.to), 'dd/MM/yyyy')}
                </Typography>
            </div>

            <div className={classes.row}>
                <Typography variant="body1" display="inline" className={classes.categorie}>
                    Lieux :{' '}
                </Typography>
                <Typography variant="body2" display="inline">
                    {' '}
                    {request.places.map((lieu, index) => {
                        if (index === request.places.length - 1) return `${lieu.label}.`;
                        return `${lieu.label}, `;
                    })}
                </Typography>
            </div>

            <div className={classes.row}>
                <Typography variant="body1" display="inline" className={classes.categorie}>
                    Motif :{' '}
                </Typography>
                <Typography variant="body2" display="inline">
                    {request.reason}
                </Typography>
            </div>
        </div>
    );
}

DetailsInfosRequest.propTypes = {
    request: PropTypes.object
};
