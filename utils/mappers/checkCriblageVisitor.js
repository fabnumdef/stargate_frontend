import { ROLES } from '../constants/enums';

export const REFUSED_STATUS = 'NEGATIVE';
export const ACCEPTED_STATUS = 'POSITIVE';
export const PROGRESS_STEP_STATUS = 'IN_PROGRESS';

export default function checkCriblageVisitor(units) {
  const isScreeningDone = units.find(
    (u) => u.steps.find((step) => step.role === ROLES.ROLE_SCREENING.role && step.state.value),
  );
  return isScreeningDone
    ? isScreeningDone.steps.find((s) => s.role === ROLES.ROLE_SCREENING.role).state.value
    : PROGRESS_STEP_STATUS;
}
