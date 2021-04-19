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
