import { useCallback } from 'react';
import { useMutation } from '@apollo/client';

import { campusIdVar } from '../apollo/cache';
import { LIST_VISITORS_DATA } from '../apollo/fragments';
import { useSnackBar } from './snackbar';

import { MUTATE_VISITOR } from '../apollo/mutations';

export default function useVisitors() {
    const { addAlert } = useSnackBar();

    const [validateVisitorStep] = useMutation(MUTATE_VISITOR);

    /**
     * @todo parameters to switch filters or fragments
     */
    const shiftVisitors = useCallback((visitors) => {
        Promise.all(
            visitors.map((visitor) =>
                validateVisitorStep({
                    variables: {
                        requestId: visitor.request.id,
                        visitorId: visitor.id,
                        decision: visitor.decision,
                        tags: visitor.tags
                    },
                    optimisticResponse: {
                        __typename: 'Mutation',
                        mutateCampus: {
                            __typename: 'CampusMutation',
                            mutateRequest: {
                                __typename: 'RequestMutation',
                                validateVisitorStep: {
                                    __typename: 'RequestVisitor',
                                    id: visitor.id
                                }
                            }
                        }
                    },
                    update: (cache) => {
                        const campus = cache.readFragment({
                            id: `Campus:${campusIdVar()}`,
                            fragment: LIST_VISITORS_DATA,
                            fragmentName: 'ListVisitor'
                        });

                        const newList = campus.listVisitorsToValidate.list.filter(
                            (v) => v.id !== visitor.id
                        );

                        const updatedList = {
                            ...campus,
                            listVisitorsToValidate: {
                                ...campus.listVisitorsToValidate,
                                list: newList,
                                meta: {
                                    ...campus.listVisitorsToValidate.meta,
                                    total: campus.listVisitorsToValidate.meta.total - 1
                                }
                            }
                        };

                        cache.writeFragment({
                            id: `Campus:${campusIdVar()}`,
                            fragment: LIST_VISITORS_DATA,
                            fragmentName: 'ListVisitor',
                            data: updatedList
                        });
                    }
                })
            )
        )
            .then(() => {
                /** Update the cache */
                addAlert({
                    message: 'Opération effectuée',
                    severy: 'success'
                });
            })
            .catch((e) => {
                addAlert({
                    message: e.message,
                    severity: 'error'
                });
            });
    }, []);

    return { shiftVisitors };
}
