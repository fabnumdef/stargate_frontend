import React, { useState, useEffect, useCallback, useContext } from 'react';

import PropTypes from 'prop-types';
import SnackBar from '../../components/styled/snackbar';

export const SnackBarContext = React.createContext();

const AUTO_DISMISS = 5000;

export function SnackBarProvider({ children }) {
    const [alerts, setAlerts] = useState([]);
    const activeAlertIds = alerts.join(',');
    useEffect(() => {
        if (activeAlertIds.length > 0) {
            const timer = setTimeout(
                () => setAlerts(() => alerts.slice(0, alerts.length - 1)),
                AUTO_DISMISS
            );
            return () => clearTimeout(timer);
        }
        return undefined;
    }, [activeAlertIds, alerts]);

    const addAlert = useCallback(
        (content) => {
            setAlerts(() => [content, ...alerts]);
        },
        [alerts]
    );

    const value = { addAlert };

    return (
        <SnackBarContext.Provider value={value}>
            {children}
            {alerts.map((alert) => (
                <SnackBar key={alert} alert={alert} open />
            ))}
        </SnackBarContext.Provider>
    );
}

SnackBarProvider.propTypes = {
    children: PropTypes.node.isRequired
};

export function useSnackBar() {
    const snackbar = useContext(SnackBarContext);
    if (!snackbar) {
        throw new Error('Cannot use `useSnackBar` outside of a SnackBarProvider');
    }
    return snackbar;
}
