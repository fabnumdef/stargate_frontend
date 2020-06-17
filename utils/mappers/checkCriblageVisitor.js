import { ROLES } from '../constants/enums';

export const REFUSED_STATUS = 'refused';
export const ACCEPTED_STATUS = 'accepted';
export const ACTIF_STEP_STATUS = 'inProgress';

export default function checkCriblageVisitor(status, activeRole) {
  const statu = status.find((item) => item.label === activeRole.unit);

  const screening = statu.steps.find((step) => step.role === ROLES.ROLE_SCREENING.role);

  // check if screening in progress
  return !screening.done ? ACTIF_STEP_STATUS : screening.status;
}
