import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useMutation, useApolloClient } from '@apollo/react-hooks';
import gql from 'graphql-tag';

// Material Import
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import { useSnackBar } from '../../lib/ui-providers/snackbar';
import {
  DetailsInfosRequest,
  TabRequestVisitorsToTreat,
  TabRequestVisitorsToTreatAcces,
} from '../../components';

import Template from '../template';
import { useLogin } from '../../lib/loginContext';

import { ROLES } from '../../utils/constants/enums';
import autoValidate from '../../utils/autoValidateVisitor';

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

export const READ_REQUEST = gql`
         query readRequest($requestId: String!, $campusId: String!) {
           campusId @client @export(as: "campusId")
           getCampus(id: $campusId) {
             getRequest(id: $requestId) {
                 id
                 reason
                 from
                 to
                 owner {
                     lastname
                     firstname
                 }
                 places {
                     label
                 }
               listVisitors {
                 list {
                   id
                   rank
                   firstname
                   birthLastname
                   employeeType
                   company
                   status {
                       unitId
                       label
                       steps {
                           role
                           step
                           behavior
                           status
                           date
                           done
                       }
                   }
                 }
               }
             }
           }
         }
       `;


export const MUTATE_VISITOR = gql`
         mutation shiftVisitor(
           $requestId: String!
           $campusId: String!
           $visitorId: String!
           $as: ValidationPersonas!
           $transition: String!
         ) {
           campusId @client @export(as: "campusId")
           mutateCampus(id: $campusId) {
             mutateRequest(id: $requestId) {
               shiftVisitor(id: $visitorId, as: $as, transition: $transition) {
                 id
               }
             }
           }
         }
       `;


export default function RequestDetails({ requestId }) {
  const classes = useStyles();
  const client = useApolloClient();
  const { activeRole } = useLogin();

  const { addAlert } = useSnackBar();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [result, setResult] = useState({});

  const fetchData = async () => {
    if (!loading) {
      setLoading(true);
    }
    try {
      const { data } = await client.query({
        query: READ_REQUEST,
        variables: { requestId },
        fetchPolicy: 'no-cache',
      });
      if (error) {
        setError(false);
      }
      setResult(data);
      return setLoading(false);
    } catch {
      return setError(true);
    }
  };

  const [shiftVisitor] = useMutation(MUTATE_VISITOR);

  const [visitors, setVisitors] = useState([]);

  useEffect(() => {
    if (result.getCampus) {
      fetchData();
    }
  }, [activeRole]);

  // TODO delete this useEffect when back will treat autoValidate Screening and Acces Office
  useEffect(() => {
    if (!result.getCampus && !result.error) {
      fetchData();
    }
    if (result.getCampus) {
      autoValidate(
        result.getCampus.getRequest.listVisitors.list,
        shiftVisitor,
        fetchData,
        requestId,
      );
    }
  }, [result]);


  const submitForm = async () => {
    await Promise.all(visitors.map(async (visitor) => {
      if (visitor.validation !== null) {
        try {
          await shiftVisitor({
            variables: {
              requestId,
              visitorId: visitor.id,
              transition: visitor.validation,
              as: { role: activeRole.role, unit: visitor.unitToShift },
            },
          });
        } catch (e) {
          addAlert({
            message:
              e.message,
            severity: 'error',
          });
        }
      }
    }));
    fetchData();
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
              {result.getCampus && result.getCampus.getRequest.id}
            </Typography>
          </Box>
        </Grid>
        <Grid item sm={12} xs={12}>
          <DetailsInfosRequest request={result.getCampus && result.getCampus.getRequest} />
        </Grid>
        <Grid item sm={12} xs={12} className={classes.tabContent}>
          {(() => {
            switch (activeRole.role) {
              case ROLES.ROLE_ACCESS_OFFICE.role:
                return (
                  <TabRequestVisitorsToTreatAcces
                    visitors={result.getCampus && result.getCampus.getRequest.listVisitors.list}
                    onChange={(entries) => {
                      setVisitors(entries);
                    }}
                  />
                );
              default:
                return (
                  <TabRequestVisitorsToTreat
                    visitors={result.getCampus && result.getCampus.getRequest.listVisitors.list}
                    onChange={(entries) => {
                      setVisitors(entries);
                    }}
                  />
                );
            }
          })()}
        </Grid>
        <Grid item sm={12}>
          <Grid container justify="flex-end">
            <div>
              <Button variant="outlined" color="primary" style={{ marginRight: '5px' }}>
                Annuler
              </Button>
            </div>
            <div>
              <Button variant="contained" color="primary" onClick={submitForm} disabled={!visitors.find((visitor) => visitor.validation !== null)}>
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
