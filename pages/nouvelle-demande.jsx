import React from 'react';
import { RequestAcces } from '../containers';
import { withApollo } from '../lib/apollo';

function NewRequestPage() {
  return <RequestAcces />;
}

export default withApollo()(NewRequestPage);
