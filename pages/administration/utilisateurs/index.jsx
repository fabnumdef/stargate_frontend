import React from 'react';
import { withApollo } from '../../../lib/apollo';
import { UserAdministration } from '../../../containers';

function UserAdministrationIndex() {
  return <UserAdministration />;
}

export default withApollo()(UserAdministrationIndex);
