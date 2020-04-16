// @flow
import React from 'react';
import { DemandeAcces } from '../containers';
import { withApollo } from '../lib/apollo';

function FormulairePage() {
  return <DemandeAcces />;
}

export default withApollo({ ssr: true })(FormulairePage);
