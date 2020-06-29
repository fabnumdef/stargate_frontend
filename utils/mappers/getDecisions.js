import { ROLES } from '../constants/enums';

export default function getDecisions(status) {
  const steps = [];

  // add first criblage state

  const value = status[0].steps.find((step) => step.role === ROLES.ROLE_SCREENING.role);
  steps.push({ label: 'Criblage', value });

  // for each unit get os or cu decisions
  status.forEach((unit) => {
    const index = unit.steps.findIndex((step) => step.role === ROLES.ROLE_SCREENING.role);
    steps.push({ label: `Décision ${unit.label}`, value: unit.steps[index - 1] });
  });

  return steps;
}
