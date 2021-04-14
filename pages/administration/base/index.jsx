import React from 'react';
import { CampusAdministration } from '../../../containers';
import { activeRoleCacheVar, campusIdVar } from '../../../lib/apollo/cache';
import { useRouter } from 'next/router';
import { ROLES } from '../../../utils/constants/enums';

function CampusAdministrationIndex() {
    const router = useRouter();
    if (activeRoleCacheVar().role === ROLES.ROLE_ADMIN.role) {
        router.push(`/administration/base/${campusIdVar()}`);
        return <></>;
    }
    return <CampusAdministration />;
}

export default CampusAdministrationIndex;
