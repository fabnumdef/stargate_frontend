import React from 'react';
import { Home } from '../containers';
import { withApollo } from '../lib/apollo';

function MyRequestsPage() {
  // TODO check profile and load the good container

  return (
    <>
      <Home />
    </>
  );
}

export default withApollo()(MyRequestsPage);
