import { ROLES } from '../constants/enums';

export const REFUSED_STATUS = 'refused';
export const ACCEPTED_STATUS = 'accepted';
export const PROGRESS_STEP_STATUS = 'inProgress';

export default function checkCriblageVisitor(status) {
  const isScreeningDone = status.find(
    (s) => s.steps.find((step) => step.role === ROLES.ROLE_SCREENING.role && step.done),
  );

  return isScreeningDone ? isScreeningDone.status : PROGRESS_STEP_STATUS;
}
