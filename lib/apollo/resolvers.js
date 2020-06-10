import gql from 'graphql-tag';

export const typeDefs = gql`
  extend type Query {
    initializedCache: Boolean!
    me: User!,
    activeRoleCache: ActiveRoleCache,
    campusId: String,
  }
  type ActiveRoleCache {
      role: String!
      unit: String
  }
`;

export const resolvers = {};
