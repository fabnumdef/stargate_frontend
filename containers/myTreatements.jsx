import React from 'react';
import { gql, useQuery, useLazyQuery } from '@apollo/client';
// Material Import
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { useRouter } from 'next/router';

import { fade } from '@material-ui/core/styles/colorManipulator';

import TablePagination from '@material-ui/core/TablePagination';
import { useSnackBar } from '../lib/hooks/snackbar';

import { TabPanel, TabMesDemandesToTreat, TabMesDemandesTreated } from '../components';

import { ROLES } from '../utils/constants/enums';
import { useLogin } from '../lib/loginContext';
import { urlAuthorization } from '../utils/permissions';

const useStyles = makeStyles(() => ({
    root: {
        width: '100%'
    },
    tab: {
        '& .MuiBox-root': {
            padding: 'Opx'
        }
    },
    pageTitle: {
        margin: '16px 0',
        color: '#0d40a0'
    },
    pageTitleHolder: {
        borderBottom: '1px solid #e5e5e5'
    },
    pageTitleControl: {
        marginLeft: 'auto'
    }
}));

export const AntTab = withStyles((theme) => ({
    root: {
        textTransform: 'none',
        color: theme.palette.primary.main,
        fontSize: '1rem',
        minWidth: 72,
        marginRight: theme.spacing(5),
        '&:hover': {
            opacity: 1
        },
        '&$selected': {
            color: theme.palette.primary.main,
            fontWeight: 'bold',
            backgroundColor: fade(theme.palette.primary.main, 0)
        },
        backgroundColor: fade(theme.palette.primary.main, 0.1),
        borderRadius: '5%'
    },
    selected: {}
    // Many props needed by Material-UI
    // eslint-disable-next-line react/jsx-props-no-spreading
}))((props) => <Tab disableRipple {...props} />);

export const LIST_REQUESTS = gql`
    query listRequestByVisitorStatus(
        $campusId: String!
        $as: ValidationPersonas!
        $filters: RequestVisitorFilters
        $cursor: OffsetCursor!
        $isDone: RequestVisitorIsDone!
    ) {
        campusId @client @export(as: "campusId")
        getCampus(id: $campusId) {
            id
            listRequestByVisitorStatus(
                as: $as
                filters: $filters
                cursor: $cursor
                isDone: $isDone
            ) {
                list {
                    id
                    requestData {
                        from
                        to
                        reason
                        status
                        places {
                            label
                        }
                        owner {
                            firstname
                            lastname
                            unit {
                                id
                                label
                            }
                        }
                    }
                }
                meta {
                    total
                }
            }
        }
    }
`;

export const LIST_MY_VISITORS = gql`
    query listMyVisitors(
        $campusId: String!
        $isDone: RequestVisitorIsDone!
        $requestsId: [String]
    ) {
        campusId @client @export(as: "campusId")
        getCampus(id: $campusId) {
            id
            listVisitors(isDone: $isDone, requestsId: $requestsId) {
                generateCSVExportLink {
                    token
                    link
                }
            }
        }
    }
`;

export default function MyTreatements() {
    const classes = useStyles();
    const router = useRouter();

    const { addAlert } = useSnackBar();
    const { activeRole } = useLogin();

    React.useEffect(() => {
        router.replace(router.pathname, '/mes-traitements', { shallow: true });
    }, []);

    const [value, setValue] = React.useState(() => {
        try {
            // Get from local storage by key
            const item = JSON.parse(window.localStorage.getItem('menuValue'));
            // Parse stored json or if none return initialValue
            if (item) return item;
            return 0;
        } catch (error) {
            return 0;
        }
    });
    /** @todo searchField filters
  const [search, setSearch] = React.useState('');
   */

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const childRef = React.useRef();

    const { data: toTreat, fetchMore: fetchToTreat } = useQuery(LIST_REQUESTS, {
        variables: {
            cursor: {
                first: rowsPerPage,
                offset: page * rowsPerPage
            },
            as: {
                role: activeRole.role,
                unit: activeRole.unit
            },
            isDone: { value: false }
        },
        fetchPolicy: 'cache-and-network'
    });

    const { data: treated, fetchMore: fetchTreated } = useQuery(LIST_REQUESTS, {
        variables: {
            cursor: {
                first: rowsPerPage,
                offset: page * rowsPerPage
            },
            as: { role: activeRole.role, unit: activeRole.unit },
            isDone: { value: true }
        },
        fetchPolicy: 'cache-and-network',
        onError: React.useCallback((e) => {
            addAlert({
                message: e,
                severity: 'error'
            });
        }, [])
    });
    // get link of export csv if BA role
    const [exportCsv] = useLazyQuery(LIST_MY_VISITORS, {
        onCompleted: React.useCallback((d) => {
            const link = document.createElement('a');
            link.href = d.getCampus.listVisitors.generateCSVExportLink.link;
            link.setAttribute('download', `export-${new Date()}.csv`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        }),
        onError: React.useCallback((e) => {
            addAlert({
                message: e.message,
                severity: 'error'
            });
        }, [])
    });

    const mapRequestData = (data) =>
        data.getCampus.listRequestByVisitorStatus.list.map((r) => ({
            id: r.id,
            ...r.requestData[0]
        }));

    const handleFetchMore = () => {
        switch (value) {
            case 0:
                fetchToTreat({
                    query: LIST_REQUESTS,
                    variables: {
                        cursor: {
                            first: rowsPerPage,
                            offset: page * rowsPerPage
                        },
                        as: {
                            role: activeRole.role,
                            unit: activeRole.unit
                        },
                        isDone: { value: false }
                    }
                });
                break;
            case 1:
                fetchTreated({
                    query: LIST_REQUESTS,
                    variables: {
                        cursor: {
                            first: rowsPerPage,
                            offset: page * rowsPerPage
                        },
                        as: { role: activeRole.role, unit: activeRole.unit },
                        isDone: { value: true }
                    }
                });
                break;
            default:
        }
    };

    const handleChangePage = (event, newPage) => {
        handleFetchMore();
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        handleFetchMore();
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const tabList = [
        {
            index: 0,
            label: `À traiter ${
                toTreat && toTreat.getCampus.listRequestByVisitorStatus.meta.total > 0
                    ? `(${toTreat.getCampus.listRequestByVisitorStatus.meta.total})`
                    : ''
            }`,
            access: urlAuthorization('/demandes/a-traiter', activeRole.role)
        },
        {
            index: 1,
            label: `Traitées ${
                treated && treated.getCampus.listRequestByVisitorStatus.meta.total > 0
                    ? `(${treated.getCampus.listRequestByVisitorStatus.meta.total})`
                    : ''
            }`,
            access: true
        }
    ];

    const handleChange = async (event, newValue) => {
        window.localStorage.setItem('menuValue', JSON.stringify(newValue));
        setValue(newValue);
        setPage(0);
    };

    const handlePageSize = React.useMemo(() => {
        switch (value) {
            case 0:
                if (!toTreat) return 0;
                return toTreat.getCampus.listRequestByVisitorStatus.meta.total;
            case 1:
                if (!treated) return 0;
                return treated.getCampus.listRequestByVisitorStatus.meta.total;
            default:
                return 0;
        }
    }, [toTreat, treated, value]);

    return (
        <Grid container spacing={2} className={classes.root}>
            <Grid item sm={12} xs={12}>
                <Box display="flex" alignItems="center">
                    <Typography variant="h5" className={classes.pageTitle}>
                        Mes Traitements
                    </Typography>
                </Box>
            </Grid>
            <Grid item sm={12} xs={12}>
                {/** Tabulator  */}
                <Tabs
                    value={value}
                    onChange={handleChange}
                    variant="scrollable"
                    scrollButtons="off"
                    aria-label="simple tabs example">
                    {tabList.map(
                        (tab) =>
                            tab.access && (
                                <AntTab
                                    label={tab.label}
                                    value={tab.index}
                                    id={tab.index}
                                    aria-controls={tab.index}
                                    key={tab.label}
                                />
                            )
                    )}
                </Tabs>
            </Grid>
            <Grid item sm={12} xs={12}>
                {urlAuthorization('/demandes/a-traiter', activeRole.role) && (
                    <TabPanel value={value} index={0} classes={{ root: classes.tab }}>
                        <TabMesDemandesToTreat
                            requests={toTreat ? mapRequestData(toTreat) : []}
                            detailLink="a-traiter"
                            emptyLabel="à traiter"
                        />
                    </TabPanel>
                )}
                <TabPanel value={value} index={1} classes={{ root: classes.tab }}>
                    {activeRole.role === ROLES.ROLE_ACCESS_OFFICE.role ? (
                        <TabMesDemandesTreated
                            requests={
                                treated ? treated.getCampus.listRequestByVisitorStatus.list : []
                            }
                            detailLink="traitees"
                            emptyLabel="traitée"
                            ref={childRef}
                        />
                    ) : (
                        <TabMesDemandesToTreat
                            requests={treated ? mapRequestData(treated) : []}
                            detailLink="traitees"
                            emptyLabel="traitée"
                        />
                    )}
                </TabPanel>
            </Grid>
            <Grid item sm={6} xs={12} md={8} lg={8}>
                {handlePageSize > 0 && (
                    <TablePagination
                        rowsPerPageOptions={[10, 20, 30, 40, 50]}
                        component="div"
                        count={handlePageSize}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onChangePage={handleChangePage}
                        onChangeRowsPerPage={handleChangeRowsPerPage}
                    />
                )}
            </Grid>
            {value === 1 &&
                activeRole.role === ROLES.ROLE_ACCESS_OFFICE.role &&
                treated &&
                treated.getCampus.listRequestByVisitorStatus.meta.total > 0 && (
                    <Grid item sm={2} xs={12} md={4} lg={4}>
                        <Button
                            size="small"
                            variant="contained"
                            color="primary"
                            onClick={() => {
                                const chosen = childRef.current.chosen.splice(0);
                                if (chosen.length > 0) {
                                    exportCsv({
                                        variables: {
                                            isDone: { role: activeRole.role, value: true },
                                            requestsId: chosen
                                        }
                                    });
                                } else {
                                    addAlert({
                                        message: 'Aucune visite selectionée',
                                        severity: 'error'
                                    });
                                }
                            }}>
                            Exporter
                        </Button>
                    </Grid>
                )}
        </Grid>
    );
}
