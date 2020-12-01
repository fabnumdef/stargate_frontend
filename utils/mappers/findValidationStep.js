import { ROLES } from '../constants/enums';

const findValidationStep = (units) => {
  const actualSteps = [];
  units.map((u) => {
    const actualStep = u.steps.find((s) => s.state.isOK === null);
    if (actualStep) {
      actualSteps.push(`${ROLES[actualStep.role].label} - ${u.label}`);
    }
    return u;
  });
  return actualSteps.join(', ').toString();
};

export default findValidationStep;
