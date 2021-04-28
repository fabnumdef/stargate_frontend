import { WORKFLOW_BEHAVIOR, ROLES } from '../constants/enums';
import { activeRoleCacheVar } from '../../lib/apollo/cache';

export default function getDecisions() {
    /**
     * Get the index of the logged user in the unit workflow.
     * @param {*} unit
     * @returns index
     */
    const getMyStepIndex = (unit) => {
        return unit.steps.findIndex((step) => step.role === activeRoleCacheVar().role);
    };

    /**
     * Get the decision of the logged user.
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
     * Check if one step of this unit has a rejected value.
     * @param {*} unit
     * @returns label of unit if rejected
     */
    const isRejected = (unit) => {
        let unitLabel;
        unit.steps.find(
            (step) =>
                step.state.value === WORKFLOW_BEHAVIOR.VALIDATION.RESPONSE.negative &&
                (unitLabel = unit.label)
        );
        return unitLabel;
    };

    /**
     * Get the decision of the screening role
     * @param {*} units
     * @returns POSITIVE or NEGATIVE
     */
    const getScreeningDecision = (units) => {
        let screeningDecision;
        units[0].steps.find(
            (step) =>
                step.role === ROLES.ROLE_SCREENING.role && (screeningDecision = step.state.value)
        );
        return screeningDecision;
    };

    /**
     * Get the decision of the previous step.
     * @param {*} unit
     * @returns role and value of the previous step
     */
    const getPreviousStep = (unit) => {
        //for each unit check what is the previous step before the logged user
        const indexPreviousStep = getMyStepIndex(unit) - 1;

        const myStep = {
            role: unit.steps[indexPreviousStep]?.role,
            value: unit.steps[indexPreviousStep]?.state
        };
        return myStep;
    };
    return { getPreviousStep, getMyDecision, isRejected, getScreeningDecision };
}
