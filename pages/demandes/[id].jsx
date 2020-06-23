import React from 'react';
import { useRouter } from 'next/router';
import { withApollo } from '../../lib/apollo';
import { RequestDetailToTreat } from '../../containers';

function RequestDetailPage() {
  // TODO check profile and load the good container
  const router = useRouter();
  const { id } = router.query;

  return (
    <>
      <RequestDetailToTreat requestId={id} />
    </>
  );
}

export default withApollo()(RequestDetailPage);
