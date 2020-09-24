import React from 'react';

import { ROLES } from '../utils/constants/enums';
import { useLogin } from '../lib/loginContext';

import MenuRequest from './menuRequest';
import ScreeningManagement from './screeningManagement';
import GatekeeperManagement from './gatekeeperManagement';

function selectLandingComponent(role) {
  switch (role) {
    case ROLES.ROLE_SCREENING.role:
      return <ScreeningManagement />;
    case ROLES.ROLE_GATEKEEPER.role:
      return <GatekeeperManagement />;
    default:
      return <MenuRequest />;
  }
}

export default function Home() {
  const { activeRole } = useLogin();
  return selectLandingComponent(activeRole.role);
}
