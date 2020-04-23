import React from 'react';
import { Account } from '../containers';
import { withApollo } from '../lib/apollo';

function AccountPage() {
  return <Account />;
}

AccountPage.getInitialProps = async (ctx) => {
  console.log(ctx);
};

export default withApollo({ ssr: true })(AccountPage);
