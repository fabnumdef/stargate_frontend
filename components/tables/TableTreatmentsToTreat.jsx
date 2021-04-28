import { useState } from 'react';
import Table from '@material-ui/core/Table';
import TableContainer from '@material-ui/core/TableContainer';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { format } from 'date-fns';
import PropTypes from 'prop-types';
import { memo, useMemo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { activeRoleCacheVar } from '../../lib/apollo/cache';
import { EMPLOYEE_TYPE, ROLES } from '../../utils/constants/enums';
import CustomTableCellHeader from './cells/TableCellHeader';
import RowTreatment from './rows/RowTreatmentsToTreat';
import ProcessDialog from '../styled/common/ProcessDialogs';

const useStyles = makeStyles(() => ({
    tableCollapes: {
        borderCollapse: 'collapse'
    },
    root: {
        border: '1px solid #F3F3F3',
        maxHeight: '500px',
        overflowX: 'hidden'
    }
}));

export const columnsArray = (role, treated) => {
    const columns = [];
    switch (role) {
        case ROLES.ROLE_UNIT_CORRESPONDENT.role:
            columns.push({ id: 'reason', label: 'Motif', position: 3 });
            break;
        case ROLES.ROLE_SECURITY_OFFICER.role:
            columns.push({ id: 'screening', label: 'Criblage', position: 3 });
            break;
        case ROLES.ROLE_ACCESS_OFFICE.role:
            treated === true
                ? columns.push({ id: 'export', label: 'Exporté le', position: 5 })
                : columns.push({ id: 'decisions', label: 'Décisions', position: 3 });
            break;

        default:
            return null;
    }
    columns.push(
        { id: 'request', label: 'Infos demande', position: 1 },
        { id: 'visitor', label: 'Infos visiteur', position: 2 },
        { id: 'action', label: 'Status', position: 4 }
    );

    function compare(a, b) {
        const posA = a.position;
        const posB = b.position;

        if (posA > posB) return 1;
        if (posA < posB) return -1;
    }

    return columns.sort(compare);
};

function mapCreateRow({
    id,
    firstname,
    birthLastname,
    company,
    employeeType,
    isInternal,
    isCribled,
    units,
    request
}) {
    return {
        request: {
            id: request.id,
            period: `${format(new Date(request.from), 'dd/MM/yyyy')}
          au
          ${format(new Date(request.to), 'dd/MM/yyyy')}`,
            owner: request.owner
                ? `
          ${request.owner.rank || ''} 
          ${request.owner.firstname} 
          ${request.owner.lastname.toUpperCase()} 
          (${request.owner.unit?.label ?? ''})`
                : '',
            places: request.places
                .map((place, index) => {
                    if (index === request.places.length - 1) return `${place.label}.`;
                    return `${place.label}, `;
                })
                .join(),
            reason: request.reason
        },
        visitor: {
            id,
            firstname,
            lastname: birthLastname,
            isInternal: isInternal ? 'MINARM' : 'HORS MINARM',
            company: company,
            employeeType: EMPLOYEE_TYPE[employeeType],
            criblage: isCribled,
            units
        }
    };
}

export const choicesArray = (role) => {
    const choices = [];
    switch (role) {
        case ROLES.ROLE_UNIT_CORRESPONDENT.role:
            choices.push({
                label: 'ACCEPTER',
                validation: ROLES[role].workflow.positive,
                tags: []
            });
            break;
        case ROLES.ROLE_SECURITY_OFFICER.role:
            choices.push(
                {
                    label: 'VA',
                    validation: ROLES[role].workflow.positive,
                    tags: ['VA']
                },
                {
                    label: 'VL',
                    validation: ROLES[role].workflow.positive,
                    tags: ['VL']
                },
                {
                    label: 'VIP',
                    validation: ROLES[role].workflow.positive,
                    tags: ['VIP']
                }
            );
            break;
        case ROLES.ROLE_ACCESS_OFFICE.role:
            choices.push(
                {
                    label: 'VA',
                    validation: ROLES[role].workflow.positive,
                    tags: ['VA']
                },
                {
                    label: 'VL',
                    validation: ROLES[role].workflow.positive,
                    tags: ['VL']
                },
                {
                    label: 'VIP',
                    validation: ROLES[role].workflow.positive,
                    tags: ['VIP']
                },
                {
                    label: 'Autre choix',
                    validation: null,
                    tags: [],
                    subChoices: [
                        {
                            label: 'Enfant -13 ans',
                            validation: ROLES[role].workflow.positive,
                            tags: ['-13']
                        },
                        {
                            label: 'Carte CIMS Nominative',
                            validation: ROLES[role].workflow.positive,
                            tags: ['CIMS']
                        }
                    ]
                }
            );
            break;

        default:
            return null;
    }

    choices.push({
        label: 'REFUSER',
        validation: ROLES[role].workflow.negative,
        tags: []
    });
    return choices;
};

const TableTreatmentsToTreat = ({ requests, treated }) => {
    const [toViewVisitor, setToViewVisitor] = useState(null);

    const classes = useStyles();
    const rows = useMemo(
        () =>
            requests.reduce((acc, dem) => {
                acc.push(mapCreateRow(dem));
                return acc;
            }, []),
        [requests]
    );

    const choices = useMemo(() => choicesArray(activeRoleCacheVar().role, treated), [
        activeRoleCacheVar()
    ]);
    const columns = useMemo(() => columnsArray(activeRoleCacheVar().role, treated), [
        activeRoleCacheVar()
    ]);

    return (
        <TableContainer className={classes.root}>
            <Table stickyHeader aria-label="sticky table" className={classes.tableCollapes}>
                <TableHead>
                    <TableRow>
                        {columns.map((column) => (
                            <CustomTableCellHeader key={column.id} align={column.align}>
                                {column.label || ''}
                            </CustomTableCellHeader>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => (
                        <RowTreatment
                            key={`${row.request.id}_${row.visitor.id}`}
                            choices={choices}
                            row={row}
                            modalOpen={() => setToViewVisitor(row.visitor)}
                            columns={columns}
                            treated={treated}
                        />
                    ))}
                </TableBody>
            </Table>
            <ProcessDialog
                isOpen={toViewVisitor !== null}
                units={toViewVisitor?.units}
                onClose={() => setToViewVisitor(null)}
            />
        </TableContainer>
    );
};
export default memo(TableTreatmentsToTreat);

TableTreatmentsToTreat.propTypes = {
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
    ).isRequired
};

TableTreatmentsToTreat.defaultProps = { treated: false };
