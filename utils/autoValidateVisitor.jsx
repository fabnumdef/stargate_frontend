// TODO delete this function when back will treat autoValidate Screening and Acces Office
import { ROLES } from './constants/enums';

function autoValidate(visitors, shiftVisitor, requestId) {
  const roleToValidate = [ROLES.ROLE_SCREENING.role, ROLES.ROLE_ACCESS_OFFICE.role];

  const isAlreadyValidate = visitors.find(
    (visitor) => visitor.status.find(
      (s) => s.steps.find(
        (step) => roleToValidate.includes(step.role) && step.done,
      ),
    ),
  );
  if (!isAlreadyValidate) {
    return null;
  }

  const isAnotherActualStep = [];
  const statusDone = [];

  visitors.forEach(
    (visitor) => {
      visitor.status.forEach(
        (s) => s.steps.forEach(
          (step, index) => {
            if (
              roleToValidate.includes(step.role)
              && !step.done
              && (index === 0 || s.steps[index - 1].done)
            ) {
              isAnotherActualStep.push({
                id: visitor.id,
                unit: s.unitId,
                stepRole: step.role,
              });
            }
            if (roleToValidate.includes(step.role) && step.done) {
              statusDone.push({ status: step.status, visitor: visitor.id, role: step.role });
            }
          },
        ),
      );
    },
  );
  if (!isAnotherActualStep.length) {
    return null;
  }
  isAnotherActualStep.forEach((visitor) => {
    shiftVisitor({
      variables: {
        requestId,
        visitorId: visitor.id,
        transition: statusDone.find(
          (status) => status.visitor === visitor.id && status.role === visitor.stepRole
        ).status,
        as: { role: visitor.stepRole, unit: visitor.unit },
      },
    });
  });
  return null;
}

export default autoValidate;
