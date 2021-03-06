import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useMutation } from '@apollo/client';
import TablePagination from '@material-ui/core/TablePagination';
import Grid from '@material-ui/core/Grid';
import PageTitle from '../styled/common/pageTitle';
import TabAdmin from '../tabs/tabAdmin';
import { useSnackBar } from '../../lib/hooks/snackbar';
import SearchField from '../styled/common/SearchField';
import { campusIdVar } from '../../lib/apollo/cache';

function IndexAdministration({
    fetchMore,
    result,
    onCompletedQuery,
    deleteMutation,
    searchInput,
    setSearchInput,
    tabData,
    columns,
    subtitles
}) {
    const { addAlert } = useSnackBar();

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const [deleteItemReq] = useMutation(deleteMutation);

    const handleChangePage = (event, selectedPage) => {
        setPage(selectedPage);
        fetchMore({
            variables: {
                campus: campusIdVar(),
                cursor: { first: rowsPerPage, offset: selectedPage * rowsPerPage }
            }
        }).then((res) => {
            onCompletedQuery(res.data);
        });
    };

    const handleChangeRowsPerPage = (event) => {
        const rows = parseInt(event.target.value, 10);
        setRowsPerPage(rows);
        setPage(0);
        fetchMore({
            variables: {
                campus: campusIdVar(),
                cursor: { first: rows, offset: 0 }
            }
        }).then((res) => {
            onCompletedQuery(res.data);
        });
    };

    const handleChangeFilter = (e) => {
        setSearchInput(e.target.value);
        setPage(0);
    };

    const deleteItem = async (id, deleteLabel) => {
        try {
            await deleteItemReq({ variables: { id } });
            setSearchInput('');
            addAlert({ message: tabData(deleteLabel).deletedText, severity: 'success' });
            const refreshPage = result.list.length === 1 && page > 0 ? page - 1 : page;
            if (result.list.length === 1 && page > 0) {
                setPage(page - 1);
            }
            const { data } = await fetchMore({
                variables: {
                    campus: campusIdVar(),
                    cursor: { first: rowsPerPage, offset: refreshPage * rowsPerPage }
                }
            });
            onCompletedQuery(data);
        } catch (e) {
            addAlert({ message: 'Une erreur est survenue', severity: 'warning' });
            return e;
        }
    };

    return (
        <>
            <PageTitle subtitles={subtitles}>Administration</PageTitle>
            <Grid container spacing={1} justify="space-between" style={{ margin: '20px 0' }}>
                <Grid
                    item
                    sm={12}
                    xs={12}
                    md={12}
                    lg={12}
                    style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <SearchField value={searchInput} onChange={handleChangeFilter}>
                        Rechercher...
                    </SearchField>
                </Grid>
                <Grid item sm={12}>
                    <TabAdmin
                        rows={result.list}
                        columns={columns}
                        deleteItem={deleteItem}
                        tabData={tabData}
                    />
                </Grid>
                <Grid item sm={6} xs={12} md={8} lg={8}>
                    <TablePagination
                        rowsPerPageOptions={[10, 20, 30, 40, 50]}
                        component="div"
                        count={result.total}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onChangePage={handleChangePage}
                        onChangeRowsPerPage={handleChangeRowsPerPage}
                    />
                </Grid>
            </Grid>
        </>
    );
}

IndexAdministration.propTypes = {
    fetchMore: PropTypes.func.isRequired,
    deleteMutation: PropTypes.func.isRequired,
    refetch: PropTypes.func.isRequired,
    onCompletedQuery: PropTypes.func.isRequired,
    result: PropTypes.shape({
        list: PropTypes.arrayOf(PropTypes.object),
        total: PropTypes.number
    }).isRequired,
    searchInput: PropTypes.string,
    setSearchInput: PropTypes.func.isRequired,
    tabData: PropTypes.func.isRequired,
    columns: PropTypes.arrayOf(PropTypes.object).isRequired,
    subtitles: PropTypes.arrayOf(PropTypes.string).isRequired,
    count: PropTypes.number
};

IndexAdministration.defaultProps = {
    count: 10,
    searchInput: ''
};

export default IndexAdministration;
