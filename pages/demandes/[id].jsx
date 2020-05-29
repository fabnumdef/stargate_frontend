import React from 'react';
import { useRouter } from 'next/router';
import { withApollo } from '../../lib/apollo';
import { RequestDetail } from '../../containers';

function RequestDetailPage() {
  // TODO check profile and load the good container
  const router = useRouter();
  const { id } = router.query;

  return (
    <>
      <RequestDetail request={id} />
    </>
  );
}

export default withApollo()(RequestDetailPage);
