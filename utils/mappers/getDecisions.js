import { ROLES } from '../constants/enums';
import { activeRoleCacheVar } from '../../lib/apollo/cache';

export default function getDecisions() {
    /**
     * Get the index of the logged user in the unit workflow
     * @param {*} unit
     * @returns index
     */
    const getMyStepIndex = (unit) => {
        return unit.steps.findIndex((step) => step.role === activeRoleCacheVar().role);
    };

    /**
     * get the decision of the logged user.
     * @param {*} units
     * @returns array of my decision
     */
    const getMyDecision = (units) => {
        let unit;
        // if the user has an unit find the unit
        //else use the first unit of the array
        activeRoleCacheVar().unitLabel
            ? (unit = units.find((u) => u.label === activeRoleCacheVar().unitLabel))
            : (unit = units[0]);
        const myStepIndex = getMyStepIndex(unit);
        const myStep = {
            label: unit.steps[myStepIndex]?.role,
            unit: unit.label,
            value: unit.steps[myStepIndex]?.state
        };

        return myStep;
    };

    /**
     * get the decision(s) of the previous step for each unit
     * @returns array of steps
     */
    const getPreviousStep = (units) => {
        const steps = [];
        units.forEach((u) => {
            //for each unit check what is the previous step before the logged user
            const indexPreviousStep = getMyStepIndex(u) - 1;

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
    };
    return { getPreviousStep, getMyDecision };
}
