import React from 'react';
import { useRouter } from 'next/router';
import { RequestDetailProgress } from '../../../containers';

function RequestDetailPageProgress() {
    const router = useRouter();
    const { id } = router.query;

    return (
        <>
            <RequestDetailProgress requestId={id} />
        </>
    );
}

export default RequestDetailPageProgress;
