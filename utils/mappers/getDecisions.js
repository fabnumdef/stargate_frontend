import { ROLES } from '../constants/enums';

export default function getDecisions(units) {
    const steps = [];
    // search screening in workflow and add screening status
    const screeningValue = units.map((u) =>
        u.steps.find((step) => step.role === ROLES.ROLE_SCREENING.role)
    );
    if (screeningValue.length) {
        steps.push({
            label: ROLES.ROLE_SCREENING.label,
            value: screeningValue[0].state
        });
    }

    // for each unit get os decision
    units.forEach((u) => {
        u.steps.forEach((step) => {
            if (step.role === ROLES.ROLE_SECURITY_OFFICER.role) {
                steps.push({
                    label: ROLES.ROLE_SECURITY_OFFICER.label,
                    unit: u.label,
                    value: step.state
                });
            }
        });
    });
    return steps;
}
