import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';

// Material Import
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Tabs from '@material-ui/core/Tabs';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import TablePagination from '@material-ui/core/TablePagination';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';
import NoteAddIcon from '@material-ui/icons/NoteAdd';

import { format } from 'date-fns';
import { CSVLink } from 'react-csv';

import {
  TabPanel, TabScreeningVisitors,
} from '../components';
import Template from './template';

import { AntTab } from './menuRequest';

import { MUTATE_VISITOR } from './requestDetail/requestDetailToTreat';

import checkStatus from '../utils/mappers/checkStatusVisitor';

import { useSnackBar } from '../lib/ui-providers/snackbar';

import { useLogin } from '../lib/loginContext';


const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  pageTitle: {
    margin: '16px 0',
    color: '#0d40a0',
    fontWeight: theme.typography.fontWeightBold,
  },
  pageTitleHolder: {
    borderBottom: '1px solid #e5e5e5',
  },
  pageTitleControl: {
    marginLeft: 'auto',
  },
}));


function csvName() {
  const date = new Date(Date.now());
  const options = {
    year: '2-digit',
    month: '2-digit',
    day: '2-digit',
  };
  const titleCsv = `criblage du ${date.toLocaleString('fr-FR', options)}.csv`;
  return titleCsv;
}

const csvHeaders = [
  { label: 'Nom de N.', key: 'vBirthName', fullLabel: 'Nom de Naissance' },
  { label: 'Date de N.', key: 'vBirthDate', fullLabel: 'Date de Naissance' },
  { label: 'Lieu de N.', key: 'vBirthPlace', fullLabel: 'Lieu de Naissance' },
  { label: 'Prénom', key: 'vFirstName' },
  { label: 'Nationalité', key: 'vNationality' },
];

function createData({
  id,
  nationality,
  birthday,
  birthplace,
  firstname,
  birthLastname,
  status,
  identityDocuments,
  request,
}, activeRole) {
  return {
    id,
    nationality,
    birthday: format(new Date(birthday), 'dd/MM/yyyy'),
    birthplace,
    firstname,
    birthLastname,
    report: null,
    screening: checkStatus(status, activeRole),
    requestId: request.id,
    vAttachedFile: identityDocuments,
  };
}


export const LIST_VISITOR_REQUESTS = gql`
         query ListVisitorsRequestQuery(
           $campusId: String!
           $search: String
           $cursor: OffsetCursor!
         ) {
           campusId @client @export(as: "campusId")
           getCampus(id: $campusId) {
             listVisitors(search: $search, cursor: $cursor) {
               list {
                 id
                 firstname
                 nationality
                 birthday
                 birthplace
                 birthLastname
                 status {
                   unitId
                   label
                   steps {
                     role
                     step
                     behavior
                     status
                     done
                   }
                 }
                 request {
                   id
                 }
               }
               meta {
                 total
               }
             }
           }
         }
       `;

export default function ScreeningManagement() {
  const classes = useStyles();

  const { addAlert } = useSnackBar();
  const { activeRole } = useLogin();

  // submit values
  const [visitors, setVisitors] = useState([]);

  // tabMotor
  const [value, setValue] = useState(0);

  // filters
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const initMount = React.useRef(true);

  const { data, fetchMore, refetch } = useQuery(LIST_VISITOR_REQUESTS, {
    variables: {
      cursor: { first: rowsPerPage, offset: page * rowsPerPage },
    },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'cache-and-network',
  });

  React.useEffect(() => {
    if (!data) return;
    setVisitors(
      data.getCampus.listVisitors.list.reduce((acc, dem) => {
        acc.push(createData(dem, activeRole));
        return acc;
      }, []),
    );
  }, [data]);

  const [shiftVisitor] = useMutation(MUTATE_VISITOR);

  const tabList = [
    {
      index: 0,
      label: `À traiter ${
        data && data.getCampus.listVisitors.meta.total > 0
          ? `(${data.getCampus.listVisitors.meta.total})`
          : ''
      }`,
    },
  ];

  const handleFetchMore = () => {
    fetchMore({
      variables: {
        cursor: { first: rowsPerPage, offset: page * rowsPerPage },
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        return fetchMoreResult;
      },
    });
  };

  const handlePageSize = () => {
    if (!data) return 0;
    return data.getCampus.listVisitors.meta.total;
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
    setPage(0);
  };

  React.useEffect(() => {
    if (initMount.current) {
      initMount.current = false;
    }
    handleFetchMore();
  }, [page, rowsPerPage]);

  const csvData = () => visitors.map((row) => ({
    vBirthName: row.birthLastname.toUpperCase(),
    vBirthDate: row.birthdate,
    vBirthPlace: row.birthplace.toUpperCase(),
    vFirstName: row.firstname.toUpperCase(),
    vNationality: row.nationality.toUpperCase(),
  }));


  const submitForm = async () => {
    await Promise.all(
      visitors.map(async (visitor) => {
        if (visitor.report !== null) {
          try {
            await shiftVisitor({
              variables: {
                requestId: visitor.requestId,
                visitorId: visitor.id,
                transition: visitor.report,
                as: { role: activeRole.role, unit: visitor.unitToShift },
              },
            });
          } catch (e) {
            addAlert({
              message: e.message,
              severity: 'error',
            });
          }
        }
      }),
    );
    // refresh the query
    refetch();
  };

  return (
    <Template>
      <Grid container spacing={2} className={classes.root}>
        <Grid item sm={12} xs={12}>
          <Box display="flex" alignItems="center" className={classes.pageTitleHolder}>
            <Typography variant="h5" className={classes.pageTitle}>
              Demandes de contrôle
            </Typography>
          </Box>
        </Grid>
        <Grid item sm={12} xs={12}>
          {/** Tabulator  */}
          <Tabs value={value} onChange={handleChange} variant="scrollable" scrollButtons="off">
            {tabList.map((tab, index) => (
              <AntTab label={tab.label} id={index} aria-controls={index} key={tab.label} />
            ))}
          </Tabs>
        </Grid>
        <Grid item sm={12} xs={12}>
          <TabPanel value={value} index={0}>
            <Grid container spacing={1} className={classes.searchField}>
              <Grid item sm={2} xs={12} md={1} lg={1}>
                {data && (
                  <CSVLink
                    style={{ textDecoration: 'none' }}
                    className={classes.linkCsv}
                    data={csvData()}
                    separator=";"
                    headers={csvHeaders}
                    filename={csvName()}
                  >
                    <Button
                      size="small"
                      variant="contained"
                      color="primary"
                      endIcon={<NoteAddIcon />}
                    >
                      Export
                    </Button>
                  </CSVLink>
                )}
              </Grid>
              <Grid item sm={6} xs={12} md={8} lg={8}>
                <TablePagination
                  rowsPerPageOptions={[10, 20, 30, 40, 50]}
                  component="div"
                  count={handlePageSize()}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onChangePage={handleChangePage}
                  onChangeRowsPerPage={handleChangeRowsPerPage}
                />
              </Grid>
              <Grid item sm={3} xs={12} md={2} lg={2}>
                <TextField
                  style={{ float: 'right' }}
                  margin="dense"
                  variant="outlined"
                  placeholder="Rechercher..."
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                    inputProps: { 'data-testid': 'searchField' },
                  }}
                />
              </Grid>
            </Grid>
            <TabScreeningVisitors
              visitors={visitors}
              onChange={(visitorsChange) => setVisitors(visitorsChange)}
            />
          </TabPanel>
          <TabPanel value={value} index={1} />
        </Grid>

        <Grid item sm={12}>
          <Grid container justify="flex-end">
            <div>
              <Button
                variant="contained"
                color="primary"
                onClick={submitForm}
                disabled={!visitors.find((visitor) => visitor.report !== null)}
              >
                Soumettre
              </Button>
            </div>
          </Grid>
        </Grid>
      </Grid>
    </Template>
  );
}