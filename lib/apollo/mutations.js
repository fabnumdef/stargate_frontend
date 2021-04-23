import { gql } from '@apollo/client';

export const CANCEL_REQUEST = gql`
    mutation cancelRequest(
        $requestId: String!
        $campusId: String!
        $transition: RequestTransition!
    ) {
        campusId @client @export(as: "campusId")
        mutateCampus(id: $campusId) {
            shiftRequest(id: $requestId, transition: $transition) {
                id
                status
            }
        }
    }
`;

export const CANCEL_VISITOR = gql`
    mutation cancelVisitor($visitorId: ObjectID!, $requestId: String!, $campusId: String!) {
        campusId @client @export(as: "campusId")
        mutateCampus(id: $campusId) {
            mutateRequest(id: $requestId) {
                cancelVisitor(id: $visitorId) {
                    id
                    status
                }
            }
        }
    }
`;

export const MUTATE_VISITOR = gql`
    mutation validateVisitorStep(
        $requestId: String!
        $campusId: String!
        $visitorId: ObjectID!
        $as: ValidationPersonas!
        $tags: [String]
        $decision: String!
    ) {
        campusId @client @export(as: "campusId")
        activeRoleCache @client @export(as: "as") {
            role: role
            unit: unit
        }
        mutateCampus(id: $campusId) {
            mutateRequest(id: $requestId) {
                validateVisitorStep(id: $visitorId, as: $as, decision: $decision, tags: $tags) {
                    id
                    units {
                        label
                        steps {
                            role
                            behavior
                            state {
                                value
                                isOK
                                date
                                tags
                            }
                        }
                    }
                }
            }
        }
    }
`;
