import gql from 'graphql-tag';

export const typeDefs = gql`
    extend type Query {
        initializedCache: Boolean!
        me: User!
        activeRoleCache: ActiveRoleCache
        campusId: String
        menuValue: Int
    }
    type ActiveRoleCache {
        role: String!
        unit: String
        unitLabel: String
    }
`;

export const resolvers = {};
