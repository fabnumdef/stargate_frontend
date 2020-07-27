import React from 'react';
import { withApollo } from '../../../lib/apollo';
import Template from '../../../containers/template';

function CreateUnit() {
  return (
    <Template />
  );
}

export default withApollo()(CreateUnit);
