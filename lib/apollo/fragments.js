import { gql } from '@apollo/client';

export const REQUEST_OWNER_DATA = gql`
    fragment OwnerData on RequestOwner {
        firstname
        lastname
        unit {
            label
        }
    }
`;

export const REQUEST_DATA = gql`
    fragment RequestData on Request {
        id
        object
        reason
        from
        to
        owner {
            ...OwnerData
        }
        places {
            label
        }
    }
    ${REQUEST_OWNER_DATA}
`;

export const VISITOR_DATA = gql`
    fragment VisitorData on RequestVisitor {
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
    }
`;

export const LIST_VISITORS_DATA = gql`
    fragment ListVisitor on Campus {
        listVisitorsToValidate {
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
        listVisitors(isDone: { role: $role, unit: $unit, value: true }, filters: $filters) {
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
    ${VISITOR_DATA}
    ${REQUEST_DATA}
`;

export const LIST_VISITORS_TREATED = gql`
    fragment ListExport on Campus {
        export: listVisitors(isDone: { role: $role, unit: $unit, value: true }, filters: $filters) {
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
        treated: listVisitors(isDone: { role: $role, unit: $unit, value: true }) {
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
    ${REQUEST_DATA}
`;

export const LIST_MY_REQUESTS = gql`
    fragment listMyRequests on Campus {
        listMyRequests(filters: $filters) {
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
`;

export const GET_REQUEST = gql`
    fragment getRequest on Request {
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
`;

export default null;
