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
import { useLogin } from '../../../../lib/loginContext';
import HeaderPageBackBtn from '../../../../components/styled/headerPageBackBtn';
import { ROLES } from '../../../../utils/constants/enums';
import PageTitle from '../../../../components/styled/common/pageTitle';
import { ADMIN_CAMPUS_ADMINISTRATION } from '../../../../utils/constants/appUrls';

const useStyles = makeStyles(() => ({
    root: {
        '& > *': {
            marginBottom: 10
        }
    }
}));

function CampusEditionPage() {
    const router = useRouter();
    const { activeRole } = useLogin();
    const { campusId } = router.query;
    const classes = useStyles();

    if (!campusId) {
        return '';
    }

    return (
        <Grid className={classes.root}>
            {activeRole.role === ROLES.ROLE_SUPERADMIN.role && (
                <HeaderPageBackBtn to={ADMIN_CAMPUS_ADMINISTRATION}>Retour bases</HeaderPageBackBtn>
            )}
            <PageTitle>Administration Base</PageTitle>
            <CampusSectionContainer campusId={campusId} />
            <PlaceSectionContainer campusId={campusId} />
            <UnitSectionContainer campusId={campusId} />
            <AdminSectionContainer campusId={campusId} />
        </Grid>
    );
}

export default CampusEditionPage;
