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
    }
    ${VISITOR_DATA}
    ${REQUEST_DATA}
`;

export default null;
