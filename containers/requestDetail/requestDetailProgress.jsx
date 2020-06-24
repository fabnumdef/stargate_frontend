import React from 'react';
import PropTypes from 'prop-types';
import { useQuery, useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';

// Material Import
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import { DetailsInfosRequest, TabRequestVisitorsProgress } from '../../components';

import Template from '../template';
import { useSnackBar } from '../../lib/ui-providers/snackbar';

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
               places {
                 label
               }
               listVisitors {
                 list {
                   id
                   rank
                   firstname
                   birthLastname
                   company
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
               }
             }
           }
         }
       `;


export const DELETE_VISITOR = gql`
         mutation deleteVisitor(
           $idVisitor: String!
           $requestId: String!
           $campusId: String!
           $transition: String!
           $as: ValidationPersonas!
         ) {
           campusId @client @export(as: "campusId")
           activeRoleCache @client @export(as: "as") {
             role
             unit
           }
           mutateCampus(id: $campusId) {
             mutateRequest(id: $requestId) {
               shiftVisitor(id: $idVisitor, as: $as, transition: $transition) {
                 id
               }
             }
           }
         }
       `;


export default function RequestDetails({ requestId }) {
  const classes = useStyles();

  const { addAlert } = useSnackBar();

  const {
    data, loading,
  } = useQuery(READ_REQUEST, {
    variables: { requestId },
  });

  const [deleteVisitor] = useMutation(DELETE_VISITOR);

  if (loading) return <p>Loading ....</p>;

  // @todo a real 404 page
  // if (error) return <p>page 404</p>;

  return (
    <Template>
      <Grid container spacing={2} className={classes.root}>
        <Grid item sm={12} xs={12}>
          <Box display="flex" alignItems="center">
            <Typography variant="h5" className={classes.pageTitle}>
              Demandes en cours :
            </Typography>
            <Typography variant="subtitle2" className={classes.idRequest}>
              {data.getCampus.getRequest.id}
            </Typography>
          </Box>
        </Grid>
        <Grid item sm={12} xs={12}>
          <DetailsInfosRequest request={data.getCampus.getRequest} />
        </Grid>
        <Grid item sm={12} xs={12} className={classes.tabContent}>
          <TabRequestVisitorsProgress
            visitors={data.getCampus.getRequest.listVisitors.list}
            onDelete={async (idVisitor) => {
              try {
                // @todo fix that delete
                await deleteVisitor({ variables: { requestId, idVisitor, transition: 'cancel' } });
              } catch (e) {
                addAlert({ message: e.message, severity: 'error' });
              }
            }}
          />
        </Grid>
        <Grid item sm={12}>
          <Grid container justify="flex-end">
            <div>
              <Button variant="contained" color="primary">
                Retour
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
