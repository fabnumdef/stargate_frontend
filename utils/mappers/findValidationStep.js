import { ROLES, WORKFLOW_BEHAVIOR } from '../constants/enums';

const findValidationStep = (units) => {
  const actualSteps = [];
  units.map((u) => {
    const actualStep = u.steps.find(
      (s) => s.state.isOK === null || s.state.value === WORKFLOW_BEHAVIOR.VALIDATION.RESPONSE.negative,
    );
    if (actualStep) {
      actualSteps.push(
        `${
          actualStep.state.value === WORKFLOW_BEHAVIOR.VALIDATION.RESPONSE.negative
            ? 'Refusé par'
            : ''
        } ${ROLES[actualStep.role].label} - ${u.label}`,
      );
    }
    return u;
  });
  return actualSteps.join(', ').toString();
};

export default findValidationStep;
