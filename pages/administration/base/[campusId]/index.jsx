import React from 'react';
import {
    CampusSectionContainer,
    PlaceSectionContainer,
    UnitSectionContainer,
    AdminSectionContainer
} from '../../../../containers';
import { useRouter } from 'next/router';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
    root: {
        '& > *': {
            marginBottom: 10
        }
    }
}));

function CampusEditionPage() {
    const router = useRouter();
    const { campusId } = router.query;
    const classes = useStyles();

    if (!campusId) {
        return null;
    }

    return (
        <Grid className={classes.root}>
            <CampusSectionContainer campusId={campusId} />
            <PlaceSectionContainer campusId={campusId} />
            <UnitSectionContainer campusId={campusId} />
            <AdminSectionContainer campusId={campusId} />
        </Grid>
    );
}

export default CampusEditionPage;
