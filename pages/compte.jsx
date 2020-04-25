import React from 'react';
import { Account } from '../containers';
import { withApollo } from '../lib/apollo';

function AccountPage() {
  return <Account />;
}

export default withApollo({ ssr: true })(AccountPage);
