import { useCallback } from 'react';
import { useMutation } from '@apollo/client';

import { campusIdVar } from '../apollo/cache';
import { CANCEL_REQUEST, CANCEL_VISITOR } from '../apollo/mutations';
import { GET_REQUEST, LIST_MY_REQUESTS } from '../apollo/queries';
import { LIST_MY_REQUESTS as FRAGMENT_LIST_MY_REQUESTS } from '../apollo/fragments';
import { useSnackBar } from './snackbar';

import { STATE_REQUEST, VISITOR_STATUS } from '../../utils/constants/enums';

export default function useRequest() {
    const { addAlert } = useSnackBar();

    const [cancelRequest] = useMutation(CANCEL_REQUEST, {
        onCompleted: () => {
            addAlert({
                message: 'Suppression confirmée !',
                severity: 'success'
            });
        },
        onError: () => {
            addAlert({
                message: 'Erreur lors de la suppression.',
                severity: 'error'
            });
        }
    });

    const [cancelVisitor] = useMutation(CANCEL_VISITOR, {
        onCompleted: () => {
            addAlert({
                message: 'Suppression confirmée !',
                severity: 'success'
            });
        },
        onError: () => {
            addAlert({
                message: 'Erreur lors de la suppression.',
                severity: 'error'
            });
        }
    });

    /**
     * @todo parameters to switch filters or fragments
     */
    const deleteRequest = useCallback((id) => {
        cancelRequest({
            variables: { requestId: id, transition: 'CANCEL' },
            optimisticResponse: {
                __typename: 'Mutation',
                mutateCampus: {
                    __typename: 'CampusMutation',
                    shiftRequest: {
                        __typename: 'Request ',
                        id
                    }
                }
            },
            update: (cache) => {
                const campus = cache.readFragment({
                    id: `Campus:${campusIdVar()}`,
                    fragment: FRAGMENT_LIST_MY_REQUESTS,
                    fragmentName: 'listMyRequests',
                    variables: {
                        filters: { status: STATE_REQUEST.STATE_CREATED.state }
                    }
                });

                const newList = campus.listMyRequests.list.filter((r) => r.id !== id);

                const updatedList = {
                    ...campus,
                    listMyRequests: {
                        ...campus.listMyRequests,
                        list: newList,
                        meta: {
                            ...campus.listMyRequests.meta,
                            total: campus.listMyRequests.meta.total - 1
                        }
                    }
                };

                cache.writeFragment({
                    id: `Campus:${campusIdVar()}`,
                    fragment: FRAGMENT_LIST_MY_REQUESTS,
                    fragmentName: 'listMyRequests',
                    variables: {
                        filters: { status: STATE_REQUEST.STATE_CREATED.state }
                    },
                    data: updatedList
                });
            }
        });
    }, []);

    const deleteRequestVisitor = useCallback((requestId, visitorId) => {
        cancelVisitor({
            variables: { requestId, visitorId },
            optimisticResponse: {
                __typename: 'Mutation',
                mutateCampus: {
                    __typename: 'CampusMutation',
                    mutateRequest: {
                        __typename: 'Request',
                        cancelVisitor: {
                            __typename: 'RequestVisitor',
                            id: visitorId,
                            status: VISITOR_STATUS.CANCELED
                        }
                    }
                }
            },
            refetchQueries: [
                {
                    query: GET_REQUEST,
                    variables: { requestId }
                },
                {
                    query: LIST_MY_REQUESTS,
                    /** Dont put any cursor if u want that cache replace old value */
                    variables: {
                        filtersP: { status: STATE_REQUEST.STATE_CREATED.state },
                        filtersT: {
                            status: [
                                STATE_REQUEST.STATE_CANCELED.state,
                                STATE_REQUEST.STATE_ACCEPTED.state,
                                STATE_REQUEST.STATE_MIXED.state,
                                STATE_REQUEST.STATE_REJECTED.state
                            ]
                        }
                    }
                }
            ]
        });
    }, []);

    return { deleteRequest, deleteRequestVisitor };
}
