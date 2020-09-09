import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useApolloClient } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import Link from 'next/link';
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
                        status
                        units {
                            id
                            label
                              steps {
                                  role
                                  behavior
                                  state {
                                     isOK
                                     date
                                     tags
                                     value
                                  }
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

  const [data, setData] = useState(null);
  const [loadData, setLoadData] = useState(true);

  const getRequest = async () => {
    const { data: requestData } = await client.query({
      query: READ_REQUEST,
      variables: { requestId },
      fetchPolicy: 'no-cache',
    });
    return setData(requestData);
  };

  useEffect(() => {
    if (!data) {
      getRequest();
    }

    if (data && (
      !checkRequestDetailAuth(data, activeRole)
      && data.getCampus.getRequest.owner.id !== userData.me.id
    )) {
      router.push('/');
    } else if (data) {
      setLoadData(false);
    }
  }, [data]);


  return (
    <Template loading={loadData}>
      <Grid container spacing={2} className={classes.root}>
        <Grid item sm={12} xs={12}>
          <Box display="flex" alignItems="center">
            <Typography variant="h5" className={classes.pageTitle}>
              Demandes traitées :
            </Typography>
            <Typography variant="subtitle2" className={classes.idRequest}>
              {data && data.getCampus.getRequest.id}
            </Typography>
          </Box>
        </Grid>
        <Grid item sm={12} xs={12}>
          <DetailsInfosRequest request={data && data.getCampus.getRequest} />
        </Grid>
        <Grid item sm={12} xs={12} className={classes.tabContent}>
          <TabRequestVisitorsTreated
            visitors={data && data.getCampus.getRequest.listVisitors.list}
          />
        </Grid>
        <Grid item sm={12}>
          <Grid container justify="flex-end">
            <div>
              <Link href="/">
                <Button variant="contained" color="primary" onClick={() => router.back()}>
                  Retour
                </Button>
              </Link>
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
