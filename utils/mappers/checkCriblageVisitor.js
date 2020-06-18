import { ROLES } from '../constants/enums';

export const REFUSED_STATUS = 'refused';
export const ACCEPTED_STATUS = 'accepted';
export const PROGRESS_STEP_STATUS = 'inProgress';

export default function checkCriblageVisitor(status, activeRole) {
  const statu = status.find((item) => item.label === activeRole.unitLabel);

  const screening = statu.steps.find((step) => step.role === ROLES.ROLE_SCREENING.role);

  return !screening.done ? PROGRESS_STEP_STATUS : screening.status;
}
