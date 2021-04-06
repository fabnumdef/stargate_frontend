import { useCallback } from 'react';
import { useMutation } from '@apollo/client';

import { campusIdVar } from '../apollo/cache';
import { CANCEL_REQUEST } from '../apollo/mutations';
import { LIST_MY_REQUESTS } from '../apollo/fragments';
import { useSnackBar } from './snackbar';

import { STATE_REQUEST } from '../../utils/constants/enums';

export default function useRequest() {
    const { addAlert } = useSnackBar();

    const [cancelRequest] = useMutation(CANCEL_REQUEST, {
        onCompleted: () => {
            addAlert({
                message: 'Supression confirmée !',
                severity: 'success'
            });
        },
        onError: () => {
            addAlert({
                message: 'Érreur lors de la supression .',
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
                    fragment: LIST_MY_REQUESTS,
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
                    fragment: LIST_MY_REQUESTS,
                    fragmentName: 'listMyRequests',
                    variables: {
                        filters: { status: STATE_REQUEST.STATE_CREATED.state }
                    },
                    data: updatedList
                });
            }
        });
    }, []);

    return { deleteRequest };
}
