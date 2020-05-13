import React from 'react';
import Link from 'next/link';
import { withApollo } from '../../../lib/apollo';
import Template from '../../../containers/template';
import PageTitle from '../../../components/styled/pageTitle';

function UserAdministration() {
  return (
    <Template>
      <PageTitle title="Administration" subtitles={['Utilisateur']} />
      <Link href="/administration/utilisateurs/creation"><button type="button">Ajouter un utilisateur</button></Link>
    </Template>
  );
}

export default withApollo({ ssr: true })(UserAdministration);
