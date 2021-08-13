import PropTypes from 'prop-types';
import { memo, useState, Fragment, useEffect } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import { format } from 'date-fns';

import { ROLES } from '../../utils/constants/enums';
import TableContainer from './styled/TableContainer';
import CustomTableCellHeader from './cells/TableCellHeader';
import RowScreeningTreatments from './rows/RowScreening';
import { IconButton } from '@material-ui/core';
import { MoreVert } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
    cont: {
        position: 'relative'
    },
    root: {
        borderTop: '1px solid rgba(224, 224, 224, 1)',
        padding: '0 20px 0 20px',
        background: theme.palette.background.table,
        overflowX: 'hidden'
    },
    header: {
        position: 'absolute',
        top: '1px',
        left: '0',
        width: '100%',
        height: '57px',
        backgroundColor: 'white',
        '&::after': {
            content: '""',
            position: 'absolute',
            bottom: '-1px',
            height: '1px',
            width: '100%',
            backgroundColor: 'rgba(224, 224, 224, 1)'
        }
    },
    headerToTreat: {
        height: '81px'
    },
    table: {
        zIndex: 10
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

    const [matches, setMatches] = useState(() => window.innerWidth < (!treated ? 1292 : 1260));

    const classes = useStyles();
    const rows = requests.reduce((acc, dem) => {
        acc.push(createData(dem));
        return acc;
    }, []);

    useEffect(() => {
        function handleResize() {
            if (window.innerWidth < (!treated ? 1292 : 1260)) {
                setMatches(true);
                return;
            }
            setMatches(false);
        }

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const height = () => {
        if (matches) return !treated ? 104 : 80;
        return !treated ? 81 : 57;
    };

    return (
        <TableContainer height={height()}>
            <Table stickyHeader aria-label="sticky table" className={classes.table}>
                <TableHead>
                    <TableRow>
                        {columns.map((column) =>
                            !treated && column.id === 'action' ? (
                                <Fragment key={`${treated ? 'treated' : ''}_${column.id}`}>
                                    <CustomTableCellHeader align={column.align}>
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
                                            style: {
                                                maxHeight: ITEM_HEIGHT * 4.5,
                                                width: '20ch'
                                            }
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
                                </Fragment>
                            ) : (
                                <CustomTableCellHeader
                                    key={`${treated ? 'treated' : ''}_${column.id}`}
                                    align={column.align}>
                                    {column.label || ''}
                                </CustomTableCellHeader>
                            )
                        )}
                    </TableRow>
                </TableHead>
                {rows.map((row) => (
                    <TableBody key={`${treated ? 'treated' : ''}_${row.id}`}>
                        <RowScreeningTreatments
                            choices={choices}
                            row={row}
                            columns={columns}
                            treated={treated}
                        />
                    </TableBody>
                ))}
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
