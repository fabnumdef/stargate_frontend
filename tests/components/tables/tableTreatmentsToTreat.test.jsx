import { InMemoryCache } from '@apollo/client/core';
import userEvent from '@testing-library/user-event';

import TableTreatments from '../../../components/tables/TableTreatmentsToTreat';
import { activeRoleCacheVar, typePolicies } from '../../../lib/apollo/cache';
import { GET_ACTIVE_ROLE } from '../../../lib/apollo/queries';
import { ACCEPTED_STATUS } from '../../../utils';
import { EMPLOYEE_TYPE, ROLES } from '../../../utils/constants/enums';
import { render, screen } from '../../../utils/tests/renderApollo';

const mockUpdate = jest.fn();

jest.mock('../../../lib/hooks/useDecisions', () => ({
    useDecisions: () => ({
        decisions: {
            '000_0001_000_00V1': {
                id: '000_00V1',
                request: { id: '000_0001' },
                choice: {
                    label: '',
                    validation: '',
                    tags: []
                }
            }
        },
        addDecision: mockUpdate
    })
}));
let mockRequest;

const mocks = [
    {
        request: {
            query: GET_ACTIVE_ROLE
        },
        result: {
            data: {
                activeRoleCache: {}
            }
        }
    }
];

describe('Component: tableTreatmentsToTreat', () => {
    let cache;

    beforeEach(() => {
        cache = new InMemoryCache({
            typePolicies
        });
    });

    it('display correctly for Unit Correspondent', () => {
        activeRoleCacheVar({
            role: ROLES.ROLE_UNIT_CORRESPONDENT.role,
            unit: ''
        });
        mockRequest = [
            {
                id: 'visitor_1',
                firstname: 'Michel',
                birthLastname: 'Jospin',
                isInternal: true,
                isScreened: ACCEPTED_STATUS,
                company: 'Pastiche',
                employeeType: EMPLOYEE_TYPE.TYPE_ACTIVE_MILITARY,
                request: {
                    id: '000_0001',
                    from: '2021-02-11T23:00:00.000Z',
                    to: '2021-02-15T23:00:00.000Z',
                    reason: 'Famille',
                    owner: {
                        rank: 'SGT',
                        lastname: 'Jean',
                        firstname: 'Marc',
                        unit: {
                            label: 'La compta'
                        }
                    },
                    places: [{ label: 'MESSE' }, { label: 'Bar PMU de la base' }]
                }
            }
        ];

        render(<TableTreatments requests={mockRequest} />, { mocks, cache });
        expect(screen.getByText(/Michel Jospin/)).toBeInTheDocument();
        expect(screen.getByText(/000_0001/)).toBeInTheDocument();
        expect(screen.getByText(/ACCEPTER/)).toBeInTheDocument();
        expect(screen.getByText(/Famille/)).toBeInTheDocument();

        //check if column's name is correct for Unit correspondant
        expect(
            screen.getByRole('columnheader', {
                name: /motif/i
            })
        );
    });

    it('update correctly', () => {
        activeRoleCacheVar({
            role: ROLES.ROLE_SECURITY_OFFICER.role,
            unit: ''
        });
        mockRequest = [
            {
                id: 'visitor_1',
                firstname: 'Michel',
                birthLastname: 'Jospin',
                isInternal: true,
                isCribled: ACCEPTED_STATUS,
                company: 'Pastiche',
                employeeType: EMPLOYEE_TYPE.TYPE_ACTIVE_MILITARY,
                units: [
                    {
                        label: 'centerParks',
                        steps: [
                            {
                                behavior: 'VALIDATION',
                                role: 'ROLE_UNIT_CORRESPONDENT',
                                state: {
                                    isOK: true,
                                    value: 'ACCEPTED'
                                }
                            },
                            {
                                behavior: 'ADVISEMENT',
                                role: 'ROLE_SCREENING',
                                state: {
                                    isOK: true,
                                    value: 'POSITIVE'
                                }
                            },
                            {
                                behavior: 'VALIDATION',
                                role: 'ROLE_SECURITY_OFFICER',
                                state: {
                                    isOK: null,
                                    value: 'null'
                                }
                            },
                            {
                                behavior: 'VALIDATION',
                                role: 'ROLE_ACCESS_OFFICE',
                                state: {
                                    isOK: null,
                                    value: null
                                }
                            }
                        ]
                    }
                ],
                request: {
                    id: '000_0001',
                    from: '2021-02-11T23:00:00.000Z',
                    to: '2021-02-15T23:00:00.000Z',
                    reason: 'Famille',
                    owner: {
                        rank: 'SGT',
                        lastname: 'Jean',
                        firstname: 'Marc',
                        unit: {
                            label: 'La compta'
                        }
                    },
                    places: [{ label: 'MESSE' }, { label: 'Bar PMU de la base' }]
                }
            }
        ];

        render(<TableTreatments requests={mockRequest} />, { mocks, cache });

        //check if column's name is correct for SECURITY OFFICER
        expect(
            screen.getByRole('columnheader', {
                name: /Criblage/i
            })
        );

        //check if Actions choices are correct for SECURITY OFFICER
        userEvent.click(screen.getByLabelText('VA'));

        expect(mockUpdate).toHaveBeenCalled();
    });
});
