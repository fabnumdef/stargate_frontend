import React from 'react';
import { useRouter } from 'next/router';
import { RequestDetailTreated } from '../../../containers';

function RequestDetailPageTreated() {
    const router = useRouter();
    const { id } = router.query;

    return (
        <>
            <RequestDetailTreated requestId={id} />
        </>
    );
}

export default RequestDetailPageTreated;
