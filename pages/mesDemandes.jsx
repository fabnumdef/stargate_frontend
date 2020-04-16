import React from 'react';
import GestionDemande from '../containers/gestionDemande';
import { withApollo } from '../lib/apollo';

function MesDemandes() {
  return (
    <>
      <GestionDemande />
    </>
  );
}

export default withApollo()(MesDemandes);
