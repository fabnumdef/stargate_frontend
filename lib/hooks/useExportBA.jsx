import React, { useState, useCallback, useContext, useMemo } from 'react';
import { useLazyQuery } from '@apollo/client';
import PropTypes from 'prop-types';
import { LIST_CSV_EXPORTS, LIST_TREATMENTS } from '../apollo/queries';
import { useSnackBar } from './snackbar';
import { LIST_VISITORS_TREATED } from '../apollo/fragments';
import { campusIdVar, activeRoleCacheVar } from '../apollo/cache';
import { filters } from './useVisitors';

export const ExportContext = React.createContext();

export function ExportProvider({ children }) {
    const [visitors, setVisitors] = useState([]);
    const { addAlert } = useSnackBar();

    const [exportCsv] = useLazyQuery(LIST_CSV_EXPORTS, {
        fetchPolicy: 'no-cache',
        onCompleted: React.useCallback((d) => {
            const link = document.createElement('a');
            link.href = d.getCampus.listVisitors.generateCSVExportLink.link;
            link.setAttribute('download', `export-${new Date()}.csv`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        }),
        onError: React.useCallback((e) => {
            addAlert({
                message: e.message,
                severity: 'error'
            });
        }, [])
    });

    const addVisitors = useCallback((id) => {
        setVisitors((visitors) => visitors.concat(id));
    }, []);

    const exportVisitors = useCallback((tabVisitors) => {
        exportCsv({
            variables: {
                visitorsId: tabVisitors
            },
            update: (cache) => {
                const campus = cache.readFragment({
                    id: `Campus:${campusIdVar()}`,
                    fragment: LIST_VISITORS_TREATED,
                    fragmentName: 'ListExport',
                    variables: {
                        role: activeRoleCacheVar().role,
                        unit: activeRoleCacheVar().unit,
                        filters
                    }
                });

                const updatedList = {
                    ...campus,
                    export: {
                        ...campus.export,
                        list: [],
                        meta: {
                            ...campus.export.meta,
                            total: 0
                        }
                    }
                };

                cache.writeFragment({
                    id: `Campus:${campusIdVar()}`,
                    fragment: LIST_VISITORS_TREATED,
                    fragmentName: 'ListExport',
                    data: updatedList,
                    variables: {
                        role: activeRoleCacheVar().role,
                        unit: activeRoleCacheVar().unit,
                        filters
                    }
                });
            },
            refetchQueries: [
                {
                    query: LIST_TREATMENTS
                }
            ]
        });
        resetVisitors();
    }, []);

    const removeVisitors = useCallback((id) => {
        setVisitors((visitors) => visitors.filter((visitor) => visitor !== id));
    }, []);
    const visitorsNumber = useMemo(() => {
        return visitors.length;
    }, [visitors]);

    const resetVisitors = useCallback(() => {
        setVisitors([]);
    }, []);

    const generateCSV = useCallback(() => {
        exportCsv({
            variables: {
                visitorsId: visitors
            }
        });
    });

    const value = {
        visitors,
        addVisitors,
        removeVisitors,
        resetVisitors,
        visitorsNumber,
        generateCSV,
        exportVisitors
    };

    return <ExportContext.Provider value={value}>{children}</ExportContext.Provider>;
}

ExportProvider.propTypes = {
    children: PropTypes.node.isRequired
};

export const withExportProvider = (Components) => {
    const returnProvider = (props) => {
        return (
            <ExportProvider>
                <Components {...props} />
            </ExportProvider>
        );
    };
    return returnProvider;
};

export function useExport() {
    const exports = useContext(ExportContext);
    if (!exports) {
        throw new Error('Cannot use `useExport` outside of a ExportProvider');
    }
    return exports;
}
