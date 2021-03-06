import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import { Typography } from '@material-ui/core';
import WarningIcon from '@material-ui/icons/Warning';
import { ADMIN_CAMPUS_PLACES_EDITION } from '../../../utils/constants/appUrls';
import { useRouter } from 'next/router';
import { makeStyles } from '@material-ui/core/styles';
import RoundButton from '../../styled/common/roundButton';
import SelectedBadge from '../../styled/common/TabBadge';
import ItemCard from '../../styled/itemCard';

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
            <Grid container sm={9} md={10} lg={11}>
                <Grid container>
                    {!listPlaces.list.length && <WarningIcon className={classes.warningIcon} />}
                    <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                        Lieux
                    </Typography>
                    <SelectedBadge small>{listPlaces.meta.total}</SelectedBadge>
                    <Grid container>
                        {listPlaces.list.map((place) => (
                            <Grid item key={place.id}>
                                <ItemCard
                                    style={{
                                        justifyContent: 'center'
                                    }}>
                                    <Grid container justify="center">
                                        <Typography variant="body1">{place.label}</Typography>
                                    </Grid>
                                </ItemCard>
                            </Grid>
                        ))}
                    </Grid>
                </Grid>
            </Grid>
            <Grid container sm={3} md={2} lg={1}>
                <RoundButton
                    onClick={() => router.push(ADMIN_CAMPUS_PLACES_EDITION(campusId))}
                    variant="outlined"
                    color="primary">
                    Modifier
                </RoundButton>
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
