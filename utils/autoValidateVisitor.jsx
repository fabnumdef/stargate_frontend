// TODO delete this function when back will treat autoValidate Screening and Acces Office
import { ROLES } from './constants/enums';

const autoValidate = async (visitors, shiftVisitor, readRequest, requestId) => {
  const isAnotherActualStep = {
    [ROLES.ROLE_SCREENING.role]: [],
    [ROLES.ROLE_ACCESS_OFFICE.role]: [],
  };
  const statusDone = [];

  const filterRejected = visitors.map((visitor) => ({
    ...visitor,
    status: visitor.status.filter((s) => !s.steps.find((step) => step.behavior === 'Validation' && step.status === 'reject')),
  }));

  Object.keys(isAnotherActualStep).forEach(((role) => {
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
                isAnotherActualStep[role].push({
                  id: visitor.id,
                  unit: s.unitId,
                  tags: visitor.vip ? [...visitor.tags, 'VIP'] : visitor.tags,
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

  if (isAnotherActualStep[ROLES.ROLE_ACCESS_OFFICE.role].length) {
    const sendChainShiftVisitor = async (sortVisitors, count) => {
      await shiftVisitor({
        variables: {
          requestId,
          visitorId: sortVisitors[count].id,
          transition: statusDone.find(
            (status) => status.visitor === sortVisitors[count].id
              && status.role === sortVisitors[count].stepRole,
          ).status,
          tags: sortVisitors[count].tags,
          as: { role: ROLES.ROLE_ACCESS_OFFICE.role, unit: sortVisitors[count].unit },
        },
      }).then(() => {
        if (count < sortVisitors.length - 1) {
          return sendChainShiftVisitor(sortVisitors, count + 1);
        }
        return readRequest();
      });
    };
    sendChainShiftVisitor(isAnotherActualStep[ROLES.ROLE_ACCESS_OFFICE.role], 0);
  }


  if (isAnotherActualStep[ROLES.ROLE_SCREENING.role].length) {
    await Promise.all(isAnotherActualStep[ROLES.ROLE_SCREENING.role].map(async (visitor) => {
      const { data } = await shiftVisitor({
        variables: {
          requestId,
          visitorId: visitor.id,
          transition: statusDone.find(
            (status) => status.visitor === visitor.id && status.role === visitor.stepRole,
          ).status,
          tags: visitor.tags,
          as: { role: visitor.stepRole, unit: visitor.unit },
        },
      });
      await setTimeout(() => {}, 1000);
      return data;
    }));
    return readRequest();
  }
  return null;
};

export default autoValidate;
