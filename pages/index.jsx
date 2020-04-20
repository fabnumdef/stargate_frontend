import React from 'react';
import { Home } from '../containers';
import { withApollo } from '../lib/apollo';

function IndexPage() {
  // TODO switch dinamicaly containers for good profiles
  return <Home />;
}

export default withApollo()(IndexPage);
