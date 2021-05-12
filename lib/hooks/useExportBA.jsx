import React, { useState, useCallback, useContext, useMemo } from 'react';
import { useMutation } from '@apollo/client';
import PropTypes from 'prop-types';
import { GEN_CSV_EXPORTS } from '../apollo/mutations';
import { useSnackBar } from './snackbar';
import { LIST_TREATMENTS, LIST_EXPORTS } from '../apollo/queries';

export const ExportContext = React.createContext();

export function ExportProvider({ children }) {
    const [visitors, setVisitors] = useState([]);
    const { addAlert } = useSnackBar();

    const [exportCsv] = useMutation(GEN_CSV_EXPORTS, {
        fetchPolicy: 'no-cache',
        refetchQueries: [
            {
                query: LIST_TREATMENTS
            },
            {
                query: LIST_EXPORTS,
                variables: {
                    filters: {
                        exportDate: null
                    }
                }
            }
        ],
        onCompleted: React.useCallback((d) => {
            const link = document.createElement('a');
            link.href = d.mutateCampus.generateCSVExportLink.link;
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
            }
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
            fetchPolicy: 'no-cache',
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
