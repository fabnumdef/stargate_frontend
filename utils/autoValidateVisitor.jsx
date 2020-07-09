// TODO delete this function when back will treat autoValidate Screening and Acces Office
import { ROLES } from './constants/enums';

const autoValidate = async (visitors, shiftVisitor, readRequest, requestId) => {
  const rolesToValidate = [ROLES.ROLE_SCREENING.role, ROLES.ROLE_ACCESS_OFFICE.role];
  const isAnotherActualStep = [];
  const statusDone = [];

  const filterRejected = visitors.map((visitor) => ({
    ...visitor,
    status: visitor.status.filter((s) => !s.steps.find((step) => step.behavior === 'Validation' && step.status === 'reject')),
  }));

  rolesToValidate.forEach(((role) => {
    filterRejected.forEach(
      (visitor) => {
        const isVisitorAlreadyValidate = visitor.status.find(
          (s) => s.steps.find(
            (step) => role === step.role && step.done,
          ),
        );
        if (!isVisitorAlreadyValidate) {
          return null;
        }
        visitor.status.forEach(
          (s) => s.steps.forEach(
            (step, index) => {
              if (
                role === step.role
                && !step.done
                && (index === 0 || s.steps[index - 1].done)
              ) {
                isAnotherActualStep.push({
                  id: visitor.id,
                  unit: s.unitId,
                  stepRole: step.role,
                });
              }
              if (role === step.role && step.done) {
                statusDone.push({ status: step.status, visitor: visitor.id, role: step.role });
              }
            },
          ),
        );
        return null;
      },
    );
    return null;
  }));

  if (!isAnotherActualStep.length) {
    return null;
  }
  await Promise.all(isAnotherActualStep.map(async (visitor) => {
    await shiftVisitor({
      variables: {
        requestId,
        visitorId: visitor.id,
        transition: statusDone.find(
          (status) => status.visitor === visitor.id && status.role === visitor.stepRole,
        ).status,
        as: { role: visitor.stepRole, unit: visitor.unit },
      },
    });
  }));
  return readRequest();
};

export default autoValidate;
