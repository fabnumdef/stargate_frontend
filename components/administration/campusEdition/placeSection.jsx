import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { Typography } from '@material-ui/core';
import WarningIcon from '@material-ui/icons/Warning';
import { ADMIN_CAMPUS_PLACES_EDITION } from '../../../utils/constants/appUrls';
import { useRouter } from 'next/router';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    globalContainer: {
        paddingLeft: theme.spacing(4)
    },
    warningIcon: {
        width: 30
    }
}));

function PlaceSection({ listPlaces, campusId }) {
    const router = useRouter();
    const classes = useStyles();

    return (
        <Grid container alignItems="center">
            <Grid container item md={2} className={classes.globalContainer}>
                <Grid item className={classes.warningIcon}>
                    {!listPlaces.list.length && <WarningIcon />}
                </Grid>
                <Grid>
                    <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                        Lieux ({listPlaces.meta.total})
                    </Typography>
                </Grid>
            </Grid>
            <Grid item sm={12} md={2}>
                <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => router.push(ADMIN_CAMPUS_PLACES_EDITION(campusId))}>
                    Modifier
                </Button>
            </Grid>
        </Grid>
    );
}

PlaceSection.propTypes = {
    campusId: PropTypes.string.isRequired,
    listPlaces: PropTypes.objectOf({
        meta: PropTypes.objectOf(PropTypes.string).isRequired,
        list: PropTypes.array.isRequired
    }).isRequired
};

export default PlaceSection;
