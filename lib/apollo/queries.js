import { gql } from '@apollo/client';

import { REQUEST_DATA, VISITOR_DATA } from './fragments';

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
            CreatedMyRequest: listMyRequests(filters: $filterCreated, cursor: $cursor) {
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
            OthersMyRequest: listMyRequests(filters: $filterTreated, cursor: $cursor) {
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
