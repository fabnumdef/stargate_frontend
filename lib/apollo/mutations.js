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

export const GEN_CSV_EXPORTS = gql`
    mutation generateCSVExport($campusId: String!, $visitorsId: [String]!) {
        campusId @client @export(as: "campusId")
        mutateCampus(id: $campusId) {
            generateCSVExportLink(visitorsId: $visitorsId) {
                token
                link
            }
        }
    }
`;

export const CREATE_USER = gql`
    mutation createUser($user: UserInput!) {
        createUser(user: $user) {
            id
            firstname
            lastname
            email {
                original
            }
            roles {
                role
                campuses {
                    id
                    label
                }
                units {
                    id
                    label
                }
            }
        }
    }
`;

export const DELETE_ROLE = gql`
    mutation deleteUserRole($id: ObjectID!, $roleData: UserRoleInput) {
        deleteUserRole(id: $id, roleData: $roleData) {
            id
        }
    }
`;

export const ADD_USER_ROLE = gql`
    mutation addUserRole($roleData: UserRoleInput!, $id: ObjectID!) {
        addUserRole(roleData: $roleData, id: $id) {
            id
            firstname
            lastname
            email {
                original
            }
            roles {
                role
                campuses {
                    id
                    label
                }
                units {
                    id
                    label
                }
            }
        }
    }
`;
