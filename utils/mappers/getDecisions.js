import { ROLES } from '../constants/enums';
import { activeRoleCacheVar } from '../../lib/apollo/cache';

export default function getDecisions(units) {
    const steps = [];

    //find the previous step and feed the steps
    units.forEach((u) => {
        //for each unit check what is the previous step before the logged user
        const indexPreviousStep =
            u.steps.findIndex((step) => step.role === activeRoleCacheVar().role) - 1;

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
