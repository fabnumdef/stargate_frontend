import { ROLES } from '../constants/enums';
import { activeRoleCacheVar } from '../../lib/apollo/cache';

export default function getDecisions(units) {
    const steps = [];

    const indexPreviousStep = units.map(
        (u) => u.steps.findIndex((step) => step.role === activeRoleCacheVar().role) - 1
    );

    units.forEach((u) => {
        u.steps[indexPreviousStep]?.role !== ROLES.ROLE_SCREENING.role
            ? steps.push({
                  label: u.steps[indexPreviousStep]?.role,
                  unit: u.label,
                  value: u.steps[indexPreviousStep]?.state
              })
            : steps.push({
                  label: u.steps[indexPreviousStep]?.role,
                  value: u.steps[indexPreviousStep]?.state
              });
    });
    return steps;
}
