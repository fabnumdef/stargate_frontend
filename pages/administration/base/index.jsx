import React from 'react';
import { CampusesAdministration } from '../../../containers';
import { activeRoleCacheVar, campusIdVar } from '../../../lib/apollo/cache';
import { useRouter } from 'next/router';
import { ROLES } from '../../../utils/constants/enums';
import { ADMIN_CAMPUS_MANAGEMENT } from '../../../utils/constants/appUrls';

function CampusesAdministrationIndex() {
    const router = useRouter();
    if (activeRoleCacheVar().role === ROLES.ROLE_ADMIN.role) {
        router.push(ADMIN_CAMPUS_MANAGEMENT(campusIdVar()));
        return <></>;
    }
    return <CampusesAdministration />;
}

export default CampusesAdministrationIndex;
