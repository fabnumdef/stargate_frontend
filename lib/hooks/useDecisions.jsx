import React, { useState, useCallback, useContext, useMemo } from 'react';
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

    const submitDecisionNumber = useMemo(() => {
        return Object.values(decisions).filter((des) => des.choice.validation !== '').length;
    }, [decisions]);

    const resetDecision = useCallback(() => {
        const reset = { ...decisions };
        Object.values(reset).map((v) => ({
            ...v,
            choice: {
                label: '',
                validation: '',
                tags: []
            }
        }));
        setDecisions(reset);
    }, []);

    const value = { decisions, addDecision, resetDecision, submitDecisionNumber };

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
