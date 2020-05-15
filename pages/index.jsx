import React from 'react';
import { MenuRequest } from '../containers';
import { withApollo } from '../lib/apollo';

function MyRequestsPage() {
  // TODO check profile and load the good container

  return (
    <>
      <MenuRequest />
    </>
  );
}

export default withApollo()(MyRequestsPage);
