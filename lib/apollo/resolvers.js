import gql from 'graphql-tag';

export const typeDefs = gql`
  extend type Query {
    initializedCache: Boolean!
    me: User!,
    validationPersonas: ValidationPersonas,
    campusId: String,
  },
  type ValidationPersonas {
    role: String,
    unit: String,
  }
`;

export const resolvers = {};
