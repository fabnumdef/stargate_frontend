import { ROLES } from '../constants/enums';

export default function getDecisions(units) {
  const steps = [];
  // search screening in workflow and add screening status
  const screeningValue = units.map(
    (u) => u.workflow.steps.find((step) => step.role === ROLES.ROLE_SCREENING.role),
  );
  if (screeningValue.length) {
    steps.push({
      label: 'Criblage',
      value: screeningValue.find((step) => step.state.value)
        ? screeningValue.find((step) => step.state.value)
        : { status: null },
    });
  }

  // for each unit get os decision
  units.forEach((u) => {
    u.workflow.steps.forEach((step) => {
      if (step.role === ROLES.ROLE_SECURITY_OFFICER.role) {
        steps.push({ label: `Décision ${ROLES[step.role].shortLabel} ${u.label}`, value: step });
      }
    });
  });
  return steps;
}
