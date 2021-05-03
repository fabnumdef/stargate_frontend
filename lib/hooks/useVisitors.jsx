import { useCallback } from 'react';
import { useApolloClient, useMutation } from '@apollo/client';

import { activeRoleCacheVar, campusIdVar } from '../apollo/cache';
import { LIST_VISITORS_DATA } from '../apollo/fragments';
import { useSnackBar } from './snackbar';

import { MUTATE_VISITOR } from '../apollo/mutations';
import { ROLES } from '../../utils/constants/enums';

export const filters = { exportDate: null };

export default function useVisitors() {
    const { addAlert } = useSnackBar();

    const client = useApolloClient();

    const [validateVisitorStep] = useMutation(MUTATE_VISITOR);

    /**
     * @todo parameters to switch filters or fragments
     */
    const shiftVisitors = useCallback((visitors) => {
        const campus = client.readFragment({
            id: `Campus:${campusIdVar()}`,
            fragment: LIST_VISITORS_DATA,
            fragmentName: 'ListVisitor',
            variables:
                activeRoleCacheVar().role === ROLES.ROLE_ACCESS_OFFICE.role
                    ? {
                          role: activeRoleCacheVar().role,
                          unit: activeRoleCacheVar().unit,
                          filters
                      }
                    : {
                          role: activeRoleCacheVar().role,
                          unit: activeRoleCacheVar().unit
                      }
        });
        Promise.all(
            visitors.map((visitor) =>
                validateVisitorStep({
                    variables: {
                        requestId: visitor.request.id,
                        visitorId: visitor.id,
                        decision: visitor.choice.validation,
                        tags: visitor.choice.tags
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
                        const newList = campus.listVisitorsToValidate.list.filter(
                            (v) => v.id !== visitor.id
                        );

                        const remove = campus.listVisitorsToValidate.list.find(
                            (v) => v.id === visitor.id
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
                            },
                            listVisitors: {
                                ...campus.listVisitors,
                                list: [...campus.listVisitors.list, remove],
                                meta: {
                                    ...campus.listVisitors.meta,
                                    total: campus.listVisitors.meta.total + 1
                                }
                            }
                        };

                        cache.writeFragment({
                            id: `Campus:${campusIdVar()}`,
                            fragment: LIST_VISITORS_DATA,
                            fragmentName: 'ListVisitor',
                            data: updatedList,
                            variables:
                                activeRoleCacheVar().role === ROLES.ROLE_ACCESS_OFFICE.role
                                    ? {
                                          role: activeRoleCacheVar().role,
                                          unit: activeRoleCacheVar().unit,
                                          filters
                                      }
                                    : {
                                          role: activeRoleCacheVar().role,
                                          unit: activeRoleCacheVar().unit
                                      }
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
