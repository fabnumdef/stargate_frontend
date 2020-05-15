import gql from 'graphql-tag';

export const typeDefs = gql`
  extend type Query {
    initializedCache: Boolean!
    me: User!,
    activeRole: Role,
    campusId: String,
  }
`;

export const resolvers = {};
