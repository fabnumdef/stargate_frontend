import React from 'react';
import GestionDemande from '../containers';
import { withApollo } from '../lib/apollo';

function MyRequestsPage() {
  // TODO check profile and load the good container
  return (
    <>
      <GestionDemande />
    </>
  );
}

export default withApollo()(MyRequestsPage);
