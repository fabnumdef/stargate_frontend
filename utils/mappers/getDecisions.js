import { ROLES } from '../constants/enums';

export default function getDecisions(status) {
  const steps = [];

  // search screening in workflow and add screening status
  const screeningValue = status.map(
    (s) => s.steps.find((step) => step.role === ROLES.ROLE_SCREENING.role)
  );
  if (screeningValue.length) {
    steps.push({
      label: 'Criblage',
      value: screeningValue ? screeningValue.find((step) => step.done) : { status: null },
    });
  }

  // for each unit get os or cu decisions
  status.forEach((unit) => {
    unit.steps.forEach((step) => {
      if ((step.role === ROLES.ROLE_SECURITY_OFFICER.role
          || step.role === ROLES.ROLE_UNIT_CORRESPONDENT.role)) {
        steps.push({ label: `Décision ${ROLES[step.role].shortLabel} ${unit.label}`, value: step });
      }
    });
  });
  return steps;
}
