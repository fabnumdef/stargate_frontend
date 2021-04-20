import React, { useState, useCallback, useContext } from 'react';
import PropTypes from 'prop-types';

export const DecisionContext = React.createContext();

export function DecisionsProvider({ children }) {
    const [decisions, setDecisions] = useState({});

    const addDecision = useCallback((decision) => {
        setDecisions((prev) => ({
            ...prev,
            [`${decision.request.id}_${decision.id}`]: decision
        }));
    }, []);

    const getDecision = useCallback(
        (decision) => decisions[`${decision.request.id}_${decision.id}`],
        []
    );

    const resetDecision = useCallback(() => {
        setDecisions({});
    }, []);

    const value = { decisions, addDecision, resetDecision, getDecision };

    return <DecisionContext.Provider value={value}>{children}</DecisionContext.Provider>;
}

DecisionsProvider.propTypes = {
    children: PropTypes.node.isRequired
};

export const withDecisionsProvider = (Components) => {
    const returnProvider = (props) => {
        return (
            <DecisionsProvider>
                <Components {...props} />
            </DecisionsProvider>
        );
    };
    return returnProvider;
};

export function useDecisions() {
    const decisions = useContext(DecisionContext);
    if (!decisions) {
        throw new Error('Cannot use `useDecisions` outside of a DecisionsProvider');
    }
    return decisions;
}
