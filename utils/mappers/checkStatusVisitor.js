export const INACTIVE_STEP_STATUS = 'inactiveSteps';
export const ACTIVE_STEP_STATUS = 'activeSteps';
export const HIDDEN_STEP_STATUS = 'hiddenSteps';

const checkWithUnit = (status, activeRole) => {
  const statu = status.find((item) => item.label === activeRole.unitLabel);
  const userIndex = statu.steps.findIndex((step) => step.role === activeRole.role);

  if (statu && (statu.steps[userIndex].done || statu.steps.find((s) => s.behavior === 'Validation' && s.status === 'reject'))) {
    return { step: HIDDEN_STEP_STATUS };
  }

  if (statu && !statu.steps[userIndex].done) {
    if (userIndex === 0 || statu.steps[userIndex - 1].done) {
      return { step: ACTIVE_STEP_STATUS, unit: activeRole.unit };
    }
    return { step: INACTIVE_STEP_STATUS };
  }
  return null;
};

const checkWithoutUnit = (status, activeRole) => {
  const sortRejected = status.filter((s) => s.steps.every((step) => (step.behavior === 'validation' && step.status !== 'reject') || step.behavior !== 'validation'));

  // check if Screening or Acces office are already done for a visitor
  // or if visitor was rejected by each unit
  if (status.find((s) => s.steps.find((step) => step.role === activeRole.role && step.done))
    || !sortRejected.length) {
    return { step: HIDDEN_STEP_STATUS };
  }

  const isActiveStep = status.find(
    (s) => s.steps.find(
      (step, index) => step.role === activeRole.role
        && (index === 0 || s.steps[index - 1].done),
    ),
  );
  if (isActiveStep) {
    return { step: ACTIVE_STEP_STATUS, unit: isActiveStep.unitId };
  }
  return { step: INACTIVE_STEP_STATUS };
};

export default function ckeckStatusVisitor(status, activeRole) {
  if (activeRole.unitLabel) {
    return checkWithUnit(status, activeRole);
  }
  console.log('checkStatus result: ', checkWithoutUnit(status, activeRole));
  return checkWithoutUnit(status, activeRole);
}
