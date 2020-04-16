// @flow
import React from 'react';
import { Accueil } from '../containers';
import { withApollo } from '../lib/apollo';

function IndexPage() {
  return <Accueil />;
}

export default withApollo({ ssr: true })(IndexPage);
