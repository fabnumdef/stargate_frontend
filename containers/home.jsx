import React from 'react';

import { ROLES } from '../utils/constants/enums';
import { useLogin } from '../lib/loginContext';

import MenuRequest from './menuRequest';
import ScreeningRequest from './screeningManagement';

function selectLandingComponent(role) {
  switch (role) {
    case ROLES.ROLE_SCREENING.role:
      return <ScreeningRequest />;
    default:
      return <MenuRequest />;
  }
}

export default function Home() {
  const { activeRole } = useLogin();
  return selectLandingComponent(activeRole.role);
}
