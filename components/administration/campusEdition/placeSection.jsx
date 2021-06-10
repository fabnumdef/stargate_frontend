import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import { Typography } from '@material-ui/core';
import WarningIcon from '@material-ui/icons/Warning';
import { ADMIN_CAMPUS_PLACES_EDITION } from '../../../utils/constants/appUrls';
import { useRouter } from 'next/router';
import { makeStyles } from '@material-ui/core/styles';
import RoundedIconButton, { ROUNDED_BUTTON_TYPE } from '../../styled/RoundedIconButton';
import SelectedBadge from '../../styled/common/TabBadge';

const useStyles = makeStyles((theme) => ({
    root: {
        padding: `20px 10px 23px 50px`,
        backgroundColor: theme.palette.background.layout,
        borderRadius: 4
    },
    warningIcon: {
        width: 30
    }
}));

function PlaceSection({ listPlaces, campusId }) {
    const router = useRouter();
    const classes = useStyles();

    return (
        <Grid container alignItems="center" justify="space-between" className={classes.root}>
            <Grid item container sm={11}>
                <Grid item>
                    {!listPlaces.list.length && <WarningIcon className={classes.warningIcon} />}
                </Grid>
                <Grid container>
                    <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                        Lieux
                    </Typography>
                    <SelectedBadge small>{listPlaces.meta.total}</SelectedBadge>
                </Grid>
            </Grid>
            <Grid>
                <RoundedIconButton
                    onClick={() => router.push(ADMIN_CAMPUS_PLACES_EDITION(campusId))}
                    type={ROUNDED_BUTTON_TYPE.EDIT}
                />
            </Grid>
        </Grid>
    );
}

PlaceSection.propTypes = {
    campusId: PropTypes.string.isRequired,
    listPlaces: PropTypes.shape({
        meta: PropTypes.object.isRequired,
        list: PropTypes.array.isRequired
    }).isRequired
};

export default PlaceSection;
