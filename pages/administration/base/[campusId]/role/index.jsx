import React from 'react';
import { useRouter } from 'next/router';
import { ValidatorConfiguration } from '../../../../../containers';

function RoleEditionPage() {
    const router = useRouter();
    const { campusId } = router.query;

    if (!campusId) {
        return null;
    }

    return <ValidatorConfiguration campusId={campusId} />;
}

export default RoleEditionPage;
