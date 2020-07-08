import React from 'react';

import { ROLES } from '../utils/constants/enums';
import { useLogin } from '../lib/loginContext';

import MenuRequest from './menuRequest';
import ScreeningRequest from './screeningManagement';


export default function Home() {
  const { activeRole } = useLogin();
  return (
    <>
      { activeRole.role
        !== ROLES.ROLE_SCREENING.role
        ? <MenuRequest />
        : <ScreeningRequest />}
    </>
  );
}
