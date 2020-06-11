import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useQuery, useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';

// Material Import
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import { useLogin } from '../../lib/loginContext';
import { useSnackBar } from '../../lib/ui-providers/snackbar';
import { DetailsInfosRequest, TabRequestVisitors } from '../../components';

import Template from '../template';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  pageTitle: {
    margin: '16px 0',
    color: '#0d40a0',
    fontWeight: theme.typography.fontWeightBold,
  },
  idRequest: {
    marginLeft: '10px',
    marginTop: '4px',
    color: '#0d40a0',
  },
  pageTitleHolder: {
    borderBottom: '1px solid #e5e5e5',
  },
  pageTitleControl: {
    marginLeft: 'auto',
  },
  tabContent: {
    margin: '20px 0',
  },
}));


const REQUEST_ATTRIBUTES = gql`
  fragment RequestResult on Request {
    id
    reason
    from
    to
    places {
      label
    }
  }
`;

const STATUT_ATTRIBUTES = gql`
  fragment StatutResult on UnitStatus {
    status {
      unit
      steps {
        role
        step
        behavior
        status
        done
      }
    }
  }
`;

export const READ_REQUEST = gql`
         query readRequest($requestId: String!, $campusId: String!) {
           campusId @client @export(as: "campusId")
           getCampus(id: $campusId) {
             getRequest(id: $requestId) {
               ...RequestResult
               listVisitors {
                 list {
                   id
                   rank
                   firstname
                   birthLastname
                   company
                   status {
                     ...StatutResult
                   }
                 }
               }
             }
           }
         }
         ${REQUEST_ATTRIBUTES}
         ${STATUT_ATTRIBUTES}
       `;


export const MUTATE_VISITOR = gql`
         mutation shiftVisitor(
           $requestId: String!
           $campusId: String!
           $visitorId: String!
           $persona: ValidationPersonas!
           $transition: String!
         ) {
           campusId @client @export(as: "campusId")
           mutateCampus(id: $campusId) {
             mutateRequest(id: $requestId) {
               shiftVisitor(id: $visitorId, as: $persona, transition: $transition) {
                 id
               }
             }
           }
         }
       `;


export default function RequestDetails({ requestId }) {
  const classes = useStyles();

  const { activeRole } = useLogin();
  const { addAlert } = useSnackBar();

  const {
    data, error, loading, refetch,
  } = useQuery(READ_REQUEST, {
    variables: { requestId },
  });

  const [shiftVisitor] = useMutation(MUTATE_VISITOR);

  const [visitors, setVisitors] = useState([]);

  const submitForm = () => {
    visitors.forEach((visitor) => {
      if (visitor.validation !== null) {
        shiftVisitor({
          variables: { requestId, persona: activeRole, transition: visitor.validation },
          onError: () => {
            // Display good message
            addAlert({
              message:
              `erreur graphQL:${' '}
              le visiteur ${visitor.firstname} ${visitor.birthLastname.toUpperCase()} n'a pas été sauvegardé`,
              severity: 'error',
            });
          },
        });
      }
    });
    // refresh the query
    refetch();
  };


  if (loading) return <p>Loading ....</p>;

  if (error) return <p>page 404</p>;

  return (
    <Template>
      <Grid container spacing={2} className={classes.root}>
        <Grid item sm={12} xs={12}>
          <Box display="flex" alignItems="center">
            <Typography variant="h5" className={classes.pageTitle}>
              {/* @todo change title if treated */}
              Demandes à traiter :
            </Typography>
            <Typography variant="subtitle2" className={classes.idRequest}>
              {/* @todo change title if treated */}
              {data.getCampus.getRequest.id}
            </Typography>
          </Box>
        </Grid>
        <Grid item sm={12} xs={12}>
          <DetailsInfosRequest request={data.getCampus.getRequest} />
        </Grid>
        <Grid item sm={12} xs={12} className={classes.tabContent}>
          <TabRequestVisitors
            visitors={data.visitors}
            onChange={(entries) => {
              setVisitors(entries);
            }}
          />
        </Grid>
        <Grid item sm={12}>
          <Grid container justify="flex-end">
            <div>
              <Button variant="outlined" color="primary" style={{ marginRight: '5px' }}>
                Annuler
              </Button>
            </div>
            <div>
              <Button variant="contained" color="primary" onClick={submitForm}>
                Envoyer
              </Button>
            </div>
          </Grid>
        </Grid>
      </Grid>
    </Template>
  );
}

RequestDetails.propTypes = {
  requestId: PropTypes.string.isRequired,
};
