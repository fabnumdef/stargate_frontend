// @flow
import React from 'react';
import Header from '../components/styled/header';
import { withApollo } from '../lib/apollo';

function PageIndex() {
  return (
    <>
      <Header userLogged />
    </>
  );
}

export default withApollo({ ssr: true })(PageIndex);
