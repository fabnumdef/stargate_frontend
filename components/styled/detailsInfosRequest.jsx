import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import { format } from 'date-fns';

const useStyles = makeStyles(() => ({
    categorie: {
        fontWeight: 'bold'
    }
}));

export default function DetailsInfosRequest({ request }) {
    const classes = useStyles();

    return (
        <Grid container spacing={2}>
            <Grid item sm={6}>
                <Typography variant="body1" className={classes.categorie}>
                    Demandeur :{' '}
                </Typography>
                <Typography variant="body2" color="primary">
                    {request.owner.lastname.toUpperCase()} {request.owner.firstname}
                </Typography>
            </Grid>
            <Grid item sm={6}>
                <Typography variant="body1" className={classes.categorie}>
                    Période :{' '}
                </Typography>
                <Typography variant="body2" color="primary">
                    {format(new Date(request.from), 'dd/MM/yyyy')} au{' '}
                    {format(new Date(request.to), 'dd/MM/yyyy')}
                </Typography>
            </Grid>
            <Grid item sm={6}>
                <Typography variant="body1" className={classes.categorie}>
                    Lieux :{' '}
                </Typography>
                <Typography variant="body2" color="primary">
                    {' '}
                    {request.places.map((lieu, index) => {
                        if (index === request.places.length - 1) return `${lieu.label}.`;
                        return `${lieu.label}, `;
                    })}
                </Typography>
            </Grid>
            <Grid item sm={6}>
                <Typography variant="body1" className={classes.categorie}>
                    Motif :
                </Typography>
                <Typography variant="body2" color="primary">
                    {request.reason}
                </Typography>
            </Grid>
        </Grid>
    );
}

DetailsInfosRequest.propTypes = {
    request: PropTypes.shape({
        owner: PropTypes.shape({
            rank: PropTypes.string,
            lastname: PropTypes.string,
            firstname: PropTypes.string
        }),
        places: PropTypes.arrayOf(
            PropTypes.shape({
                label: PropTypes.string
            })
        ),
        from: PropTypes.string,
        to: PropTypes.string,
        reason: PropTypes.string
    })
};

DetailsInfosRequest.defaultProps = {
    request: {}
};
