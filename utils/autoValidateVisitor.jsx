import { ROLES } from './constants/enums';

const autoValidate = async (visitors, shiftVisitor, requestId) => {
  const roleToValidate = [ROLES.ROLE_SCREENING.role, ROLES.ROLE_ACCESS_OFFICE.role];

  roleToValidate.forEach((role) => {
    const isAlreadyValidate = visitors.find(
      (visitor) => visitor.status.filter(
        (s) => s.steps.find(
          (step) => step.role === role && step.done,
        ),
      ),
    );

    if (!isAlreadyValidate) {
      return null;
    }

    const isAnotherActualStep = [];
    let statusDone = '';

    visitors.forEach(
      (visitor) => {
        visitor.status.forEach(
          (s) => s.steps.forEach(
            (step, index) => {
              if (step.role === role && !step.done && (index === 0 || s.steps[index - 1].done)) {
                isAnotherActualStep.push({
                  id: visitor.id,
                  unit: s.unitId,
                });
              }
              if (step.role === role && step.done) {
                statusDone = step.status;
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
          transition: statusDone,
          as: { role, unit: visitor.unit },
        },
      });
    });
    return null;
  });
  return null;
};

export default autoValidate;
