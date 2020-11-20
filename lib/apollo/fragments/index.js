import { gql } from '@apollo/client';

export const REQUEST_DATA = gql`
  fragment RequestData on Request{
    id
    object
    reason
    from
    status
    to
    owner{
      id
      firstname
      lastname
      unit
    }
    places{
      id
      label
    }
  }
`;

export const VISITOR_DATA = gql`
  fragment VisitorData on RequestVisitor {
    id
    rank
    firstname
    birthLastname
    employeeType
    company
    vip
    vipReason
    units {
        id
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

export default null;
