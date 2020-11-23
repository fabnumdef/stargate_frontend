import { ROLES } from '../constants/enums';

export default function findVisitorStatus(units) {
  const status = units.find((u) => u.steps.find((s) => s.role === ROLES.ROLE_ACCESS_OFFICE.role))
    .steps.find((s) => s.role === ROLES.ROLE_ACCESS_OFFICE.role).state.tags;
  return status ? status.join(', ').toString() : '';
}
