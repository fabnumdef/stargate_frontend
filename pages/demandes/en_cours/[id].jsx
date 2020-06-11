import React from 'react';
import { useRouter } from 'next/router';
// import { useQuery } from '@apollo/react-hooks';
// import gql from 'graphql-tag';
import { withApollo } from '../../../lib/apollo';
import { RequestDetailProgress } from '../../../containers';


// const GET_ACTIVE_ROLE = gql`
//   query activeRole {
//     activeRole @client
//   }
// `;

function RequestDetailPage() {
  // TODO check profile and load the good container
  const router = useRouter();
  const { id } = router.query;

  // control if permission to see request
  // const { loading, data } = useQuery(GET_ACTIVE_ROLE);

  // @todo loading anim
  // if (loading) return <p>Loading ...</p>;

  return (
    <>
      <RequestDetailProgress requestId={id} />
    </>
  );
}

export default withApollo()(RequestDetailPage);
