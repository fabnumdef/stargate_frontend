import { useState } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { format } from 'date-fns';
import PropTypes from 'prop-types';
import { memo, useMemo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { activeRoleCacheVar } from '../../lib/apollo/cache';
import {
    ACCESS_OFFICE_VALIDATION_CHOICES,
    EMPLOYEE_TYPE,
    ROLES
} from '../../utils/constants/enums';
import CustomTableCellHeader from './cells/TableCellHeader';
import TableContainer from './styled/TableContainer';
import RowTreatment from './rows/RowTreatments';
import ProcessDialog from '../styled/common/ProcessDialogs';

const useStyles = makeStyles(() => ({
    table: {
        zIndex: 10
    }
}));

export const columnsArray = (role, treated, exported) => {
    const columns = [];
    switch (role) {
        case ROLES.ROLE_UNIT_CORRESPONDENT.role:
            columns.push({ id: 'reason', label: 'Motif', position: 3 });
            break;
        case ROLES.ROLE_SECURITY_OFFICER.role:
            columns.push({ id: 'screening', label: 'Criblage', position: 3 });
            break;
        case ROLES.ROLE_ACCESS_OFFICE.role:
            if (!treated) columns.push({ id: 'decisions', label: 'Décisions', position: 3 });
            if (exported) columns.push({ id: 'export', label: 'Exporté le', position: 5 });

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
    exportDate,
    units,
    request
}) {
    const fromDate = format(new Date(request.from), 'dd/MM/yyyy');
    const toDate = format(new Date(request.to), 'dd/MM/yyyy');
    return {
        request: {
            id: request.id,
            period: `${fromDate === toDate ? fromDate : `${fromDate} au ${toDate}`}`,
            owner: request.owner
                ? `
          ${request.owner.rank || ''} 
          ${request.owner.firstname} 
          ${request.owner.lastname.toUpperCase()} 
          ${request.owner.unit?.label ? `(${request.owner.unit.label})` : ''}`
                : '',
            places: request.places
                .map((place, index) => {
                    if (index === request.places.length - 1) return `${place.label}.`;
                    return `${place.label}, `;
                })
                .join(''),
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
            units,
            exportDate
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
                ...ACCESS_OFFICE_VALIDATION_CHOICES.filter(
                    (choice) => choice.mainList
                ).map((choice) => ({ ...choice, validation: ROLES[role].workflow.positive })),
                {
                    label: 'Autre choix',
                    validation: null,
                    tags: [],
                    subChoices: [
                        ...ACCESS_OFFICE_VALIDATION_CHOICES.filter(
                            (choice) => !choice.mainList
                        ).map((choice) => ({
                            ...choice,
                            validation: ROLES[role].workflow.positive
                        }))
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

const TableTreatmentsToTreat = ({ requests, treated, exported }) => {
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
    const columns = useMemo(() => columnsArray(activeRoleCacheVar().role, treated, exported), [
        activeRoleCacheVar()
    ]);
    return (
        <TableContainer height={57}>
            <Table stickyHeader aria-label="sticky table" className={classes.table}>
                <TableHead>
                    <TableRow>
                        {columns.map((column) => (
                            <CustomTableCellHeader
                                id={column.id}
                                key={column.id}
                                align={column.align}>
                                {column.label || ''}
                            </CustomTableCellHeader>
                        ))}
                    </TableRow>
                </TableHead>

                {rows.map((row) => (
                    <TableBody
                        key={`${treated ? 'treated' : ''}_${row.request.id}_${row.visitor.id}`}>
                        <RowTreatment
                            choices={choices}
                            row={row}
                            modalOpen={() => setToViewVisitor(row.visitor)}
                            columns={columns}
                            treated={treated}
                            exported={exported}
                        />
                    </TableBody>
                ))}
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
    exported: PropTypes.bool,
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

TableTreatmentsToTreat.defaultProps = { treated: false, exported: false };
