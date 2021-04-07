import React from 'react';
import { CampusAdministration } from '../../../containers';
import { activeRoleCacheVar, campusIdVar } from '../../../lib/apollo/cache';
import { useRouter } from 'next/router';
import { ROLES } from '../../../utils/constants/enums';

function CampusAdministrationIndex() {
    const router = useRouter();
    if (activeRoleCacheVar().role === ROLES.ROLE_ADMIN.role) {
        return router.push(`/administration/base/${campusIdVar()}`);
    }
    return <CampusAdministration />;
}

export default CampusAdministrationIndex;
