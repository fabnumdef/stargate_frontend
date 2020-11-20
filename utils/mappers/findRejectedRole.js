import { WORKFLOW_BEHAVIOR, ROLES } from '../constants/enums';

export default function findRejectedRole(units) {
  const sortRole = units.map((u) => `${ROLES[u.steps.find(
    (step) => step.state.value === WORKFLOW_BEHAVIOR.VALIDATION.RESPONSE.negative,
  ).role].shortLabel} - ${u.label}`);
  return sortRole.join(', ').toString();
}
