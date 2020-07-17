import { ROLES } from '../constants/enums';

export const REFUSED_STATUS = 'negative';
export const ACCEPTED_STATUS = 'positive';
export const PROGRESS_STEP_STATUS = 'inProgress';

export default function checkCriblageVisitor(status) {
  const isScreeningDone = status.find(
    (s) => s.steps.find((step) => step.role === ROLES.ROLE_SCREENING.role && step.done),
  );
  return isScreeningDone
    ? isScreeningDone.steps.find((s) => s.role === ROLES.ROLE_SCREENING.role).status
    : PROGRESS_STEP_STATUS;
}
