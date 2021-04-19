import { ROLES } from './constants/enums';

export const tokenDuration = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : false;
    if (!token) {
        return {
            expiredToken: true
        };
    }
    const payload = token.split('.')[1];
    const { exp, iat } = JSON.parse(window.atob(payload));
    const cur = Math.floor(Date.now() / 1000);
    const duration = exp - iat;
    const renewTrigger = duration / 2;
    const expIn = exp - cur;
    const expiredToken = expIn <= 0;

    return {
        renewTrigger,
        expIn,
        expiredToken
    };
};

export const REFUSED_STATUS = 'NEGATIVE';
export const ACCEPTED_STATUS = 'POSITIVE';
export const PROGRESS_STEP_STATUS = 'IN_PROGRESS';

export function checkScreenedVisitor(units) {
    const isScreeningDone = units.find((u) =>
        u.steps.find((step) => step.role === ROLES.ROLE_SCREENING.role && step.state.value)
    );
    return isScreeningDone
        ? isScreeningDone.steps.find((s) => s.role === ROLES.ROLE_SCREENING.role).state.value
        : PROGRESS_STEP_STATUS;
}

export function findVisitorStatus(units) {
    const status = units
        .find((u) => u.steps.find((s) => s.role === ROLES.ROLE_ACCESS_OFFICE.role))
        .steps.find((s) => s.role === ROLES.ROLE_ACCESS_OFFICE.role).state.tags;
    return status ? status.join(', ').toString() : '';
}
