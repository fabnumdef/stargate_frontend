import React from 'react';
import dynamic from 'next/dynamic';

import { ROLES } from '../utils/constants/enums';
import { useLogin } from '../lib/loginContext';

const MyTreatments = dynamic(() => import('../containers/myTreatments'));
const MyAccessRequest = dynamic(() => import('../containers/myAccessRequests'));
const ScreeningManagement = dynamic(() => import('../containers/screeningManagement'));
const UserAdministration = dynamic(() => import('../containers/administration/userAdministration'));
const GatekeeperManagement = dynamic(() => import('../containers/gatekeeperManagement'));

// @todo : dynamic import

function selectLandingComponent(role) {
    switch (role) {
        case ROLES.ROLE_SCREENING.role:
            return <ScreeningManagement />;
        case ROLES.ROLE_GATEKEEPER.role:
            return <GatekeeperManagement />;
        case ROLES.ROLE_HOST.role:
            return <MyAccessRequest />;
        case ROLES.ROLE_ADMIN.role:
        case ROLES.ROLE_SUPERADMIN.role:
            return <UserAdministration />;
        case ROLES.ROLE_ACCESS_OFFICE.role:
        case ROLES.ROLE_SECURITY_OFFICER.role:
        case ROLES.ROLE_UNIT_CORRESPONDENT.role:
            return <MyTreatments />;
        default:
            return 'NO ACCESS';
    }
}

export default function Home() {
    const { activeRole } = useLogin();

    return selectLandingComponent(activeRole.role);
}
