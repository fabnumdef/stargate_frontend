import { gql } from '@apollo/client';

import { REQUEST_DATA, VISITOR_DATA } from './fragments';

export const GET_ACTIVE_ROLE = gql`
    query getActiveRole {
        activeRoleCache @client {
            role
            unit
        }
    }
`;

export const IS_LOGGED_IN = gql`
    query IsUserLoggedIn {
        isLoggedIn @client
    }
`;

export const LIST_REQUESTS = gql`
    query listRequestByVisitorStatus(
        $campusId: String!
        $as: ValidationPersonas!
        $filters: RequestVisitorFilters
        $cursor: OffsetCursor!
    ) {
        campusId @client @export(as: "campusId")
        activeRoleCache @client @export(as: "as") {
            role: role
            unit: unit
        }
        getCampus(id: $campusId) {
            id
            listVisitorsToValidate(as: $as, filters: $filters, cursor: $cursor) {
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
    }
    ${VISITOR_DATA}
    ${REQUEST_DATA}
`;
