import { gql } from '@apollo/client';

import { REQUEST_DATA, VISITOR_DATA } from './fragments';

export const GET_ME = gql`
    query getMe {
        me {
            id
            firstname
            lastname
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
            email {
                original
            }
        }
    }
`;

export const GET_ACTIVE_ROLE = gql`
    query getActiveRole {
        activeRoleCache @client {
            role
            unit
            unitLabel
        }
    }
`;

export const IS_LOGGED_IN = gql`
    query IsUserLoggedIn {
        isLoggedIn @client
    }
`;

export const INIT_CACHE = gql`
    query initCache(
        $campusId: String!
        $as: ValidationPersonas!
        $cursor: OffsetCursor!
        $filterCreated: RequestFilters!
        $filterTreated: RequestFilters!
    ) {
        getCampus(id: $campusId) {
            id
            label
            listVisitorsToValidate(as: $as, cursor: $cursor) {
                list {
                    ...VisitorData
                    request {
                        ...RequestData
                    }
                }
                meta {
                    total
                }
            }
            progress: listMyRequests(filters: $filterCreated, cursor: $cursor) {
                list {
                    id
                    from
                    to
                    reason
                    status
                    places {
                        id
                        label
                    }
                    owner {
                        firstname
                        lastname
                        unit {
                            label
                        }
                    }
                }
                meta {
                    total
                }
            }
            treated: listMyRequests(filters: $filterTreated, cursor: $cursor) {
                list {
                    id
                    from
                    to
                    reason
                    status
                    places {
                        id
                        label
                    }
                    owner {
                        firstname
                        lastname
                        unit {
                            label
                        }
                    }
                }
                meta {
                    total
                }
            }
        }
    }
    ${VISITOR_DATA}
    ${REQUEST_DATA}
`;

export const LIST_MY_REQUESTS = gql`
    query listMyRequests(
        $campusId: String!
        $cursor: OffsetCursor
        $filtersP: RequestFilters!
        $filtersT: RequestFilters!
    ) {
        campusId @client @export(as: "campusId")
        getCampus(id: $campusId) {
            id
            progress: listMyRequests(filters: $filtersP, cursor: $cursor) {
                list {
                    id
                    from
                    to
                    reason
                    status
                    places {
                        id
                        label
                    }
                    owner {
                        firstname
                        lastname
                        unit {
                            label
                        }
                    }
                }
                meta {
                    total
                }
            }
            treated: listMyRequests(filters: $filtersT, cursor: $cursor) {
                list {
                    id
                    from
                    to
                    reason
                    status
                    places {
                        id
                        label
                    }
                    owner {
                        firstname
                        lastname
                        unit {
                            label
                        }
                    }
                }
                meta {
                    total
                }
            }
        }
    }
`;

export const GET_REQUEST = gql`
    query getRequest($campusId: String!, $requestId: String!, $cursor: OffsetCursor) {
        campusId @client @export(as: "campusId")
        getCampus(id: $campusId) {
            id
            getRequest(id: $requestId) {
                id
                from
                to
                reason
                status
                places {
                    id
                    label
                }
                owner {
                    firstname
                    lastname
                    unit {
                        label
                    }
                }
                listVisitors(cursor: $cursor) {
                    list {
                        id
                        vip
                        rank
                        firstname
                        birthLastname
                        employeeType
                        company
                        status
                        units {
                            id
                            label
                            steps {
                                role
                                behavior
                                state {
                                    isOK
                                    value
                                    tags
                                }
                            }
                        }
                    }
                    meta {
                        total
                    }
                }
            }
        }
    }
`;

export const GET_CAMPUS = gql`
    query getCampus($id: String!) {
        getCampus(id: $id) {
            id
            label
            trigram
            createdAt
        }
    }
`;

export const GET_PLACES_LIST = gql`
    query getPlacesList($campusId: String!) {
        getCampus(id: $campusId) {
            id
            listPlaces {
                list {
                    id
                    label
                    unitInCharge {
                        id
                        label
                    }
                }
                meta {
                    total
                }
            }
        }
    }
`;

export const GET_UNITS_LIST = gql`
    query listUnits($cursor: OffsetCursor, $campusId: String!, $search: String) {
        getCampus(id: $campusId) {
            listUnits(cursor: $cursor, search: $search) {
                meta {
                    offset
                    first
                    total
                }
                list {
                    id
                    label
                    trigram
                }
            }
        }
    }
`;

export const LIST_USERS = gql`
    query listUsers($cursor: OffsetCursor, $hasRole: HasRoleInput, $campus: String) {
        listUsers(cursor: $cursor, hasRole: $hasRole, campus: $campus) {
            list {
                id
                firstname
                lastname
                email {
                    original
                }
                roles {
                    role
                    userInCharge
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
            meta {
                total
            }
        }
    }
`;
