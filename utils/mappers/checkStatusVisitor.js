import { WORKFLOW_BEHAVIOR } from '../constants/enums';

export const INACTIVE_STEP_STATUS = 'inactiveSteps';
export const ACTIVE_STEP_STATUS = 'activeSteps';
export const HIDDEN_STEP_STATUS = 'hiddenSteps';

const checkWithUnit = (units, activeRole) => {
  const unit = units.find((item) => item.id === activeRole.unit);
  if (unit) {
    const userIndex = unit.steps.findIndex((step) => step.role === activeRole.role);
    const previousSteps = unit.steps.slice(0, userIndex);

    if ((unit.steps[userIndex].state.value
      || previousSteps.find(
        (s) => s.behavior === WORKFLOW_BEHAVIOR.VALIDATION.value
          && s.state.value === WORKFLOW_BEHAVIOR.VALIDATION.RESPONSE.negative,
      ))
    ) {
      return { step: HIDDEN_STEP_STATUS };
    }

    if (!unit.steps[userIndex].state.value) {
      if (userIndex === 0 || previousSteps.every((step) => step.state.value)) {
        return { step: ACTIVE_STEP_STATUS, unit: activeRole.unit };
      }
      return { step: INACTIVE_STEP_STATUS };
    }
  }

  return null;
};

const checkWithoutUnit = (units, activeRole) => {
  const sortRejected = units
    .filter((u) => u.steps.every(
      (step) => (step.behavior === WORKFLOW_BEHAVIOR.VALIDATION.value
      && step.state.value !== WORKFLOW_BEHAVIOR.VALIDATION.RESPONSE.negative)
      || step.behavior !== WORKFLOW_BEHAVIOR.VALIDATION.value,
    ));

  // check if visitor was rejected by each unit
  if (!sortRejected.length) {
    return { step: HIDDEN_STEP_STATUS };
  }

  const isActiveStep = units.find((u) => u.steps.find(
    (step, index) => step.role === activeRole.role
      && (index === 0
      || (u.steps[index - 1].state.value
          && u.steps[index - 1].state.value !== WORKFLOW_BEHAVIOR.VALIDATION.RESPONSE.negative)),
  ));
  if (isActiveStep) {
    return { step: ACTIVE_STEP_STATUS };
  }
  return { step: INACTIVE_STEP_STATUS };
};

export default function ckeckStatusVisitor(units, activeRole) {
  if (activeRole.unitLabel) {
    return checkWithUnit(units, activeRole);
  }
  return checkWithoutUnit(units, activeRole);
}
