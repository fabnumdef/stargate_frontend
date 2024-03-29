import { useCallback } from 'react';
import { useMutation } from '@apollo/client';

import { activeRoleCacheVar, campusIdVar } from '../apollo/cache';
import { LIST_VISITORS_DATA } from '../apollo/fragments';
import { useSnackBar } from './snackbar';

import { MUTATE_VISITOR } from '../apollo/mutations';
import { ROLES, WORKFLOW_BEHAVIOR } from '../../utils/constants/enums';

export const filters = {
    exportDate: null
};

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
                        decision: visitor.choice.validation,
                        tags: visitor.choice.tags
                    },
                    update: (cache) => {
                        // check if BA behavior or not

                        const campusId = campusIdVar();
                        const activeRole = activeRoleCacheVar();
                        const variables =
                            activeRole.role === ROLES.ROLE_ACCESS_OFFICE.role &&
                            visitor.choice.validation ===
                                WORKFLOW_BEHAVIOR.VALIDATION.RESPONSE.positive
                                ? {
                                      role: activeRole.role,
                                      unit: activeRole.unit,
                                      filters
                                  }
                                : {
                                      role: activeRole.role,
                                      unit: activeRole.unit
                                  };

                        const campus = cache.readFragment({
                            id: `Campus:${campusId}`,
                            fragment: LIST_VISITORS_DATA,
                            fragmentName: 'ListVisitor',
                            variables
                        });

                        // Remove submit values
                        let newList = campus.listVisitorsToValidate.list.filter(
                            (v) => v.id !== visitor.id
                        );
                        let remove = campus.listVisitorsToValidate.list.find(
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

                        // Update cache
                        cache.writeFragment({
                            id: `Campus:${campusId}`,
                            fragment: LIST_VISITORS_DATA,
                            fragmentName: 'ListVisitor',
                            data: updatedList,
                            variables
                        });
                    }
                })
            )
        )
            .then(() => {
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
