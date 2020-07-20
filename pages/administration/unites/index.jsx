import React from 'react';
import { withApollo } from '../../../lib/apollo';
import { UnitAdministration } from '../../../containers';

function UnitAdministrationIndex() {
  return <UnitAdministration />;
}

export default withApollo()(UnitAdministrationIndex);
