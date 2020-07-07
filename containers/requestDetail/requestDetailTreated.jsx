import React from 'react';
import PropTypes from 'prop-types';
import { useQuery, useApolloClient } from '@apollo/react-hooks';
import gql from 'graphql-tag';

// Material Import
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import { useRouter } from 'next/router';
import { DetailsInfosRequest, TabRequestVisitorsTreated } from '../../components';

import Template from '../template';
import { useLogin } from '../../lib/loginContext';
import { checkRequestDetailAuth } from '../../utils/permissions';

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
                owner {
                    id
                    lastname
                    firstname
                }
                listVisitors {
                    list {
                        id
                        rank
                        firstname
                        birthLastname
                        employeeType
                        company
                        state {
                            value
                            records {
                                date
                            }
                        }
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

export default function RequestDetailsTreated({ requestId }) {
  const classes = useStyles();
  const router = useRouter();
  const { activeRole } = useLogin();
  const client = useApolloClient();

  const userData = client.readQuery({
    query: gql`
        query getUserId {
            me {
                id
            }
        }
    `,
  });

  const {
    data, loading,
  } = useQuery(READ_REQUEST, {
    variables: { requestId },
  });

  if (loading) return <p>Loading ....</p>;

  if (data && (
    !checkRequestDetailAuth(data, activeRole)
    && !data.getCampus.getRequest.owner.id === userData.me.id
  )) {
    router.push('/');
    return <div />;
  }

  // @todo a real 404 page
  // if (error) return <p>page 404</p>;

  return (
    <Template>
      <Grid container spacing={2} className={classes.root}>
        <Grid item sm={12} xs={12}>
          <Box display="flex" alignItems="center">
            <Typography variant="h5" className={classes.pageTitle}>
              Demandes traitées :
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
          <TabRequestVisitorsTreated
            visitors={data.getCampus.getRequest.listVisitors.list}
          />
        </Grid>
        <Grid item sm={12}>
          <Grid container justify="flex-end">
            <div>
              <Button variant="contained" color="primary" onClick={() => router.back()}>
                Retour
              </Button>
            </div>
          </Grid>
        </Grid>
      </Grid>
    </Template>
  );
}

RequestDetailsTreated.propTypes = {
  requestId: PropTypes.string.isRequired,
};
