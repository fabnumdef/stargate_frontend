import { ROLES, WORKFLOW_BEHAVIOR } from '../constants/enums';

export default function getDecisions(units) {
  const steps = [];
  // search screening in workflow and add screening status
  const screeningValue = units.map(
    (u) => u.steps.find((step) => step.role === ROLES.ROLE_SCREENING.role),
  );
  if (screeningValue.length) {
    steps.push({
      label: 'Criblage',
      value: screeningValue[0].state,
    });
  }

  // for each unit get os decision
  units.forEach((u) => {
    const isRejected = u.steps.find(
      (s) => s.behavior === WORKFLOW_BEHAVIOR.VALIDATION.value && s.state.isOK === false,
    );
    if (isRejected) {
      steps.push({ label: `Décision ${ROLES.ROLE_SECURITY_OFFICER.shortLabel} ${u.label}`, value: isRejected.state });
    } else {
      u.steps.forEach((step) => {
        if (step.role === ROLES.ROLE_SECURITY_OFFICER.role) {
          steps.push({ label: `Décision ${ROLES[step.role].shortLabel} ${u.label}`, value: step.state });
        }
      });
    }
  });
  return steps;
}
