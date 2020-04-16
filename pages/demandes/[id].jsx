import React from 'react';
import { useRouter } from 'next/router';
import DetailDemande from '../../containers/demandeDetail';

export default function PageDemandeDetails() {
  const router = useRouter();
  const { id } = router.query;

  return <DetailDemande id={id} />;
}
