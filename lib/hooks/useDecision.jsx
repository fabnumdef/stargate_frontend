import { useCallback, useState } from 'react';

/**
 * Methods to manage users decisions
 *
 * @component
 * @returns {decisions, addDecision, resetDecision}
 */
const useDecisions = () => {
    const [decisions, setDecisions] = useState({});

    /** Add decision
     * @param decision
     * @example
     *  decision = { request: { id: request.id },
     *    id: visitor.id,
     *    decision: activeRole.workflow.positive,
     *    tags: []
     *   }
     */
    const addDecision = useCallback((decision) => {
        setDecisions((prev) => ({
            ...prev,
            [`${decision.request.id}_${decision.id}`]: decision
        }));
    }, []);

    const resetDecision = useCallback(() => {
        setDecisions({});
    }, []);

    return { decisions, addDecision, resetDecision };
};

export default useDecisions;
