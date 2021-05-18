import PropTypes from 'prop-types';
import { memo, useMemo, useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableContainer from '@material-ui/core/TableContainer';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import { format } from 'date-fns';

import { ROLES } from '../../utils/constants/enums';
import CustomTableCellHeader from './cells/TableCellHeader';
import RowScreeningTreatments from './rows/RowScreening';
import { IconButton } from '@material-ui/core';
import { MoreVert } from '@material-ui/icons';

const useStyles = makeStyles(() => ({
    tableCollapes: {
        borderCollapse: 'collapse'
    },
    root: {
        border: '1px solid #F3F3F3',
        maxHeight: '55vh',
        overflowX: 'hidden'
    }
}));

function createData({
    id,
    nationality,
    birthday,
    birthplace,
    isScreened,
    firstname,
    birthLastname,
    identityDocuments,
    request,
    generateIdentityFileExportLink
}) {
    return {
        id,
        nationality,
        birthday: format(new Date(birthday), 'dd/MM/yyyy'),
        birthplace,
        firstname,
        isScreened,
        lastname: birthLastname,
        requestId: request.id,
        vAttachedFile:
            identityDocuments[0] && identityDocuments[0].file ? identityDocuments[0].file.id : null,
        link: generateIdentityFileExportLink ? generateIdentityFileExportLink.link : null
    };
}

export const columns = [
    {
        id: 'lastname',
        label: 'Nom de naiss.'
    },
    {
        id: 'firstname',
        label: 'Prénom'
    },
    { id: 'birthday', label: 'Date de naiss.' },
    { id: 'birthplace', label: 'Lieu de naiss.' },
    { id: 'nationality', label: 'Nat. étrangere' },
    {
        id: 'action',
        label: 'Signalement',
        style: {
            width: 125
        }
    }
];

export const choices = [
    {
        label: 'RAS',
        validation: ROLES.ROLE_SCREENING.workflow.positive,
        tags: []
    },
    {
        label: 'RES',
        validation: ROLES.ROLE_SCREENING.workflow.negative,
        tags: []
    }
];

const ITEM_HEIGHT = 48;

const TableScreening = ({ requests, treated, selectAll }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const classes = useStyles();
    const rows = useMemo(
        () =>
            requests.reduce((acc, dem) => {
                acc.push(createData(dem));
                return acc;
            }, []),
        [requests]
    );

    return (
        <TableContainer className={classes.root}>
            <Table stickyHeader aria-label="sticky table" className={classes.tableCollapes}>
                <TableHead>
                    <TableRow>
                        {columns.map((column) =>
                            !treated && column.id === 'action' ? (
                                <>
                                    <CustomTableCellHeader key={column.id} align={column.align}>
                                        {column.label || ''}
                                        <IconButton
                                            aria-label="options"
                                            onClick={(event) => {
                                                setAnchorEl(event.currentTarget);
                                            }}
                                            aria-haspopup="true">
                                            <MoreVert />
                                        </IconButton>
                                    </CustomTableCellHeader>
                                    <Menu
                                        id="options"
                                        anchorEl={anchorEl}
                                        keepMounted
                                        open={open}
                                        onClose={() => {
                                            setAnchorEl(null);
                                        }}
                                        PaperProps={{
                                            style: { maxHeight: ITEM_HEIGHT * 4.5, width: '20ch' }
                                        }}>
                                        {choices.map((choice) => (
                                            <MenuItem
                                                key={choice.label}
                                                onClick={() => {
                                                    selectAll(choice);
                                                    setAnchorEl(null);
                                                }}>
                                                {choice.label}
                                            </MenuItem>
                                        ))}
                                    </Menu>
                                </>
                            ) : (
                                <CustomTableCellHeader key={column.id} align={column.align}>
                                    {column.label || ''}
                                </CustomTableCellHeader>
                            )
                        )}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => (
                        <RowScreeningTreatments
                            key={`${treated ? 'treated' : ''}_${row.id}`}
                            choices={choices}
                            row={row}
                            columns={columns}
                            treated={treated}
                        />
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};
export default memo(TableScreening);

TableScreening.propTypes = {
    treated: PropTypes.bool,
    requests: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string,
            firstname: PropTypes.string,
            birthLastname: PropTypes.string,
            isInternal: PropTypes.bool,
            isScreened: PropTypes.string,
            company: PropTypes.string,
            employeeType: PropTypes.string,
            request: PropTypes.shape({
                id: PropTypes.string,
                from: PropTypes.string,
                to: PropTypes.string,
                reason: PropTypes.string,
                owner: PropTypes.shape({
                    rank: PropTypes.string,
                    firstname: PropTypes.string,
                    lastname: PropTypes.string,
                    unit: PropTypes.shape({
                        label: PropTypes.string
                    })
                }),
                places: PropTypes.arrayOf(
                    PropTypes.shape({
                        label: PropTypes.string
                    })
                )
            })
        })
    ).isRequired,
    selectAll: PropTypes.func.isRequired
};

TableScreening.defaultProps = {
    treated: false
};
