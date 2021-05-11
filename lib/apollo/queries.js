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
export const LIST_TREATMENTS = gql`
    query listTreatments(
        $campusId: String!
        $as: ValidationPersonas!
        $filters: RequestVisitorFilters
        $role: String
        $unit: ObjectID
        $cursor: OffsetCursor
    ) {
        campusId @client @export(as: "campusId")
        activeRoleCache @client @export(as: "as") {
            role: role @export(as: "role")
            unit: unit @export(as: "unit")
        }
        getCampus(id: $campusId) {
            id
            progress: listVisitorsToValidate(as: $as, filters: $filters, cursor: $cursor) {
                list {
                    ...VisitorData
                    exportDate
                    request {
                        ...RequestData
                    }
                }
                meta {
                    total
                }
            }
            treated: listVisitors(
                isDone: { role: $role, unit: $unit, value: true }
                cursor: $cursor
            ) {
                list {
                    id
                    nid
                    firstname
                    birthLastname
                    isInternal
                    employeeType
                    rank
                    company
                    email
                    vip
                    vipReason
                    nationality
                    birthday
                    birthplace
                    exportDate
                    isScreened @client
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
                    request {
                        ...RequestData
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

export const LIST_EXPORTS = gql`
    query listExports(
        $campusId: String!
        $filters: RequestVisitorFilters
        $role: String
        $unit: ObjectID
        $cursor: OffsetCursor
    ) {
        campusId @client @export(as: "campusId")
        activeRoleCache @client {
            role: role @export(as: "role")
            unit: unit @export(as: "unit")
        }
        getCampus(id: $campusId) {
            id
            export: listVisitors(
                isDone: { role: $role, unit: $unit, value: true }
                filters: $filters
                cursor: $cursor
            ) {
                list {
                    id
                    nid
                    firstname
                    birthLastname
                    isInternal
                    employeeType
                    rank
                    company
                    email
                    vip
                    vipReason
                    nationality
                    birthday
                    birthplace
                    exportDate
                    isScreened @client
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
                    request {
                        ...RequestData
                    }
                }
                meta {
                    total
                }
            }
        }
    }
    ${REQUEST_DATA}
`;

export const LIST_CSV_EXPORTS = gql`
    query listCSVExport($campusId: String!, $role: String, $unit: ObjectID, $visitorsId: [String]) {
        campusId @client @export(as: "campusId")
        activeRoleCache @client {
            role: role @export(as: "role")
            unit: unit @export(as: "unit")
        }
        getCampus(id: $campusId) {
            id
            listVisitors(
                isDone: { role: $role, unit: $unit, value: true }
                visitorsId: $visitorsId
            ) {
                generateCSVExportLink {
                    token
                    link
                }
            }
        }
    }
`;

export const LIST_TREATMENTS_SCREENING = gql`
    query listTreatments(
        $campusId: String!
        $as: ValidationPersonas!
        $filters: RequestVisitorFilters
        $role: String!
        $unit: ObjectID
        $cursor: OffsetCursor
        $search: String
    ) {
        campusId @client @export(as: "campusId")
        activeRoleCache @client @export(as: "as") {
            role: role @export(as: "role")
            unit: unit @export(as: "unit")
        }
        getCampus(id: $campusId) {
            id
            progress: listVisitorsToValidate(
                as: $as
                filters: $filters
                cursor: $cursor
                search: $search
            ) {
                list {
                    ...VisitorData
                    request {
                        ...RequestData
                    }
                    identityDocuments {
                        file {
                            id
                        }
                    }
                    generateIdentityFileExportLink {
                        link
                    }
                }
                meta {
                    total
                }
            }
            treated: listVisitors(
                isDone: { role: $role, unit: $unit, value: true }
                cursor: $cursor
                search: $search
            ) {
                list {
                    id
                    nid
                    firstname
                    birthLastname
                    isInternal
                    employeeType
                    rank
                    company
                    email
                    vip
                    vipReason
                    nationality
                    birthday
                    birthplace
                    exportDate
                    isScreened @client
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
                    request {
                        ...RequestData
                    }
                    identityDocuments {
                        file {
                            id
                        }
                    }
                    generateIdentityFileExportLink {
                        link
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
