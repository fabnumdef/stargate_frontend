export const INACTIF_STEP_STATUS = 'inactiveSteps';
export const ACTIF_STEP_STATUS = 'activeSteps';
export const HIDDEN_STEP_STATUS = 'hiddenSteps';

export default function ckeckStatusVisitor(status, activeRole) {
  const statu = status.find((item) => item.label === activeRole.unit);
  const userIndex = statu.steps.findIndex((step) => step.role === activeRole.role);

  if (statu && statu.steps[userIndex].done) {
    return HIDDEN_STEP_STATUS;
  }

  if (statu && !statu.steps[userIndex].done) {
    if (userIndex === 0 || statu.steps[userIndex - 1].done) {
      return ACTIF_STEP_STATUS;
    }
    return INACTIF_STEP_STATUS;
  }



/*  // checks if object is corretly set
  if (statu && statu.steps) {
    let state = HIDEN_STEP_STATUS;
    let activeStep = {};

    // Iterate over steps
    statu.steps.every((step) => {
      if (!step.done) {
        activeStep = step;
      }
      // Check if first steps are done
      if (step.role !== activeRole.role && !step.done) {
        state = INACTIF_STEP_STATUS;
        return false;
      }

      // Check if current steps are not done
      if (step.role === activeRole.role && !step.done) {
        state = ACTIF_STEP_STATUS;
        return false;
      }

      // Check if current steps is already done
      if (step.role === activeRole.role && step.done) {
        state = HIDEN_STEP_STATUS;
        return false;
      }

      return true;
    });
    return { activeStep, state };
  }*/

  return { };
}
