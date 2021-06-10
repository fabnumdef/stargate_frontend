import { InMemoryCache } from '@apollo/client';

import MyAccessRequests from '../../containers/myAccessRequests';
import { campusIdVar, typePolicies } from '../../lib/apollo/cache';
import { cleanup, render, screen, waitFor } from '../../utils/tests/renderApollo';
import { LIST_MY_REQUESTS } from '../../lib/apollo/queries';
import { CANCEL_REQUEST } from '../../lib/apollo/mutations';
import userEvent from '@testing-library/user-event';

const mockedPush = jest.fn();

jest.mock('next/router', () => ({
    useRouter: () => ({
        push: mockedPush
    })
}));

describe('Container: MyAccessRequests', () => {
    let cache;

    let mocks = [
        {
            request: {
                query: LIST_MY_REQUESTS,
                variables: {
                    cursor: { first: 50, offset: 0 },
                    campusId: 'NAVAL-BASE',
                    filtersP: { status: 'CREATED' },
                    filtersT: {
                        status: ['CANCELED', 'ACCEPTED', 'MIXED', 'REJECTED']
                    }
                }
            },
            result: {
                data: {
                    getCampus: {
                        id: 'NAVAL-BASE',
                        progress: {
                            list: [
                                {
                                    id: 'NAVAL-BASE20210318-1',
                                    from: '2021-03-25T09:30:00.000Z',
                                    to: '2021-03-27T09:30:00.000Z',
                                    reason: 'visite importante',
                                    status: 'CREATED',
                                    places: [
                                        {
                                            id: '604f54128442131c485dab2c',
                                            label: 'Lieu CIRI',
                                            __typename: 'Place'
                                        }
                                    ],
                                    owner: {
                                        firstname: 'CU',
                                        lastname: 'CIRI',
                                        unit: { label: 'CIRI', __typename: 'RequestOwnerUnit' },
                                        __typename: 'RequestOwner'
                                    },
                                    __typename: 'Request'
                                }
                            ],
                            meta: { total: 1, __typename: 'OffsetPaginatorMeta' },
                            __typename: 'RequestsList'
                        },
                        treated: {
                            list: [
                                {
                                    id: 'NAVAL-BASE20210316-21',
                                    from: '2021-03-19T14:39:37.633Z',
                                    to: '2021-03-19T14:39:37.633Z',
                                    reason: 'hbj',
                                    status: 'CANCELED',
                                    places: [
                                        {
                                            id: '604f54128442131c485dab2c',
                                            label: 'Lieu CIRI',
                                            __typename: 'Place'
                                        }
                                    ],
                                    owner: {
                                        firstname: 'CU',
                                        lastname: 'CIRI',
                                        unit: { label: 'CIRI', __typename: 'RequestOwnerUnit' },
                                        __typename: 'RequestOwner'
                                    },
                                    __typename: 'Request'
                                }
                            ],
                            meta: { total: 1, __typename: 'OffsetPaginatorMeta' },
                            __typename: 'RequestsList'
                        },
                        __typename: 'Campus'
                    }
                }
            }
        },
        {
            request: {
                query: CANCEL_REQUEST,
                variables: {
                    requestId: 'NAVAL-BASE20210318-1',
                    campusId: 'NAVAL-BASE',
                    transition: 'CANCEL'
                }
            },
            result: jest.fn(() => ({
                data: {
                    mutateCampus: {
                        shiftRequest: {
                            id: 'NAVAL-BASE20210402-1',
                            status: 'CANCELED',
                            __typename: 'Request'
                        },
                        __typename: 'CampusMutation'
                    }
                }
            }))
        }
    ];

    beforeEach(() => {
        cache = new InMemoryCache({
            typePolicies
        });
    });

    afterEach(cleanup);

    campusIdVar('NAVAL-BASE');

    it('display correctly', async () => {
        render(<MyAccessRequests />, { mocks, cache, addTypename: false });

        await waitFor(() => {
            expect(screen.getByText(/NAVAL-BASE20210318-1/i)).toBeInTheDocument();
        });
    });

    it('delete correctly', async () => {
        const mockMutation = mocks[1].result;

        render(<MyAccessRequests />, { mocks, cache, resolvers: {}, addTypename: false });

        await waitFor(() => {
            userEvent.click(screen.getByLabelText(/delete/i));
        });
        await waitFor(() => {
            userEvent.click(
                screen.getByRole('button', {
                    name: /supprimer/i
                })
            );
        });
        expect(mockMutation).toHaveBeenCalled();
    });

    it('change of table', async () => {
        render(<MyAccessRequests />, { mocks, cache, resolvers: {}, addTypename: false });

        await waitFor(() => {
            userEvent.click(
                screen.getByRole('tab', {
                    name: /finalisées 1/i
                })
            );
        });

        expect(screen.getByText(/NAVAL-BASE20210316-21/i)).toBeInTheDocument();
    });

    it('call the detail of a request', async () => {
        render(<MyAccessRequests />, { mocks, cache, resolvers: {}, addTypename: false });

        await waitFor(() => {
            userEvent.click(screen.getByLabelText(/details/i));
        });
        expect(mockedPush).toHaveBeenCalled();
    });
});
