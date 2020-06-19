export const INACTIVE_STEP_STATUS = 'inactiveSteps';
export const ACTIVE_STEP_STATUS = 'activeSteps';
export const HIDDEN_STEP_STATUS = 'hiddenSteps';

export default function ckeckStatusVisitor(status, activeRole) {
  const statu = status.find((item) => item.label === activeRole.unitLabel);
  const userIndex = statu.steps.findIndex((step) => step.role === activeRole.role);

  if (statu && statu.steps[userIndex].done) {
    return HIDDEN_STEP_STATUS;
  }

  if (statu && !statu.steps[userIndex].done) {
    if (userIndex === 0 || statu.steps[userIndex - 1].done) {
      return ACTIVE_STEP_STATUS;
    }
    return INACTIVE_STEP_STATUS;
  }
  return null;
}
