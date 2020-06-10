import { ROLES } from '../constants/enums';

export const REFUSED_STATUS = 'refused';
export const ACCEPTED_STATUS = 'accepted';
export const ACTIF_STEP_STATUS = 'inProgress';

export default function checkCriblageVisitor(status, activeRole) {
  const statu = status.find((item) => item.unit === activeRole.unit);

  const screening = statu.steps.find((step) => step.role === ROLES.ROLE_SCREENING.role);

  switch (screening) {
    // check if screening in progress
    case !screening.done:
      return ACTIF_STEP_STATUS;
    // check if screening is ok
    case screening.status === ACCEPTED_STATUS:
      return ACCEPTED_STATUS;
    // check if screening is ko
    case screening.status === REFUSED_STATUS:
      return REFUSED_STATUS;
    default:
      return null;
  }
}
