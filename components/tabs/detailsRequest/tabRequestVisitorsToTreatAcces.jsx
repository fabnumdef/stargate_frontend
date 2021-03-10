import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';

import { makeStyles, withStyles } from '@material-ui/core/styles';
import { fade } from '@material-ui/core/styles/colorManipulator';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';

import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';

import { useRouter } from 'next/router';
import { format } from 'date-fns';
import WarningIcon from '@material-ui/icons/Warning';
import TableContainer from '@material-ui/core/TableContainer';

import CustomTableHeader from '../../styled/customTableCellHeader';
import CustomCheckbox from '../../styled/customCheckbox';
import { useLogin } from '../../../lib/loginContext';
import { EMPLOYEE_TYPE, ROLES, WORKFLOW_BEHAVIOR } from '../../../utils/constants/enums';
import getDecisions from '../../../utils/mappers/getDecisions';

import ckeckStatusVisitor, { ACTIVE_STEP_STATUS } from '../../../utils/mappers/checkStatusVisitor';

import VisitorGrid from '../../styled/visitor';
import StatusLegend from '../../styled/statusLegend';

const useStyles = makeStyles((theme) => ({
    paper: {
        width: '100%',
        marginBottom: theme.spacing(2)
    },
    currentTitle: {
        lineHeight: '1.33',
        letterSpacing: '0.14px',
        color: theme.palette.primary.main,
        marginTop: '1%',
        marginBottom: '0,5 %'
    },
    table: {
        minWidth: 750,
        marginTop: '0.5%',
        marginBottom: '1%'
    },
    radioGroup: {
        flexDirection: 'row',
        justifyContent: 'center'
    },
    searchField: {
        display: 'flex',
        justifyContent: 'space-between'
    },
    cellNoBorder: {
        border: 'none'
    },
    borderRight: {
        borderRight: 'solid 1px'
    },
    borderLeft: {
        borderLeft: 'solid 1px'
    },
    rowForm: {
        backgroundColor: fade(theme.palette.primary.main, 0.05),
        color: `${theme.palette.primary.main}!important`
    },
    sortedHeader: {
        color: `${theme.palette.primary.main}!important`
    },
    reportHeader: {
        textAlign: 'center',
        minWidth: '450px',
        borderTop: 'solid 1px',
        whiteSpace: 'nowrap'
    },
    reportRow: {
        borderLeft: 'solid 1px',
        borderRight: 'solid 1px'
    },
    reportLastChild: {
        borderBottom: 'solid 1px'
    },
    reportCheckbox: {
        justifyContent: 'center'
    },
    submitButton: {
        float: 'right'
    },
    paginator: {
        float: 'left'
    }
}));

function createData(
    { id, firstname, birthLastname, rank, company, employeeType, units, vip, vipReason },
    activeRole
) {
    const findStep = ckeckStatusVisitor(units, activeRole);
    return {
        id,
        visitor: rank
            ? `${rank} ${birthLastname.toUpperCase()} ${firstname}`
            : `${birthLastname.toUpperCase()} ${firstname}`,
        company,
        type: EMPLOYEE_TYPE[employeeType],
        validation: null,
        vip,
        vipReason,
        steps: getDecisions(units),
        step: findStep.step
    };
}

function CellDecision({ date, children }) {
    return (
        <>
            {date} {children}
        </>
    );
}

CellDecision.propTypes = {
    date: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired
};

function decisionReturn({ date, value, tags }) {
    const validationDate = date ? format(new Date(date), 'dd/MM/yyyy') : null;

    switch (value) {
        case WORKFLOW_BEHAVIOR.VALIDATION.RESPONSE.positive:
            return (
                <CellDecision date={validationDate}>
                    <span style={{ color: '#28a745', fontWeight: 'bold' }}>{tags[0]}</span>
                </CellDecision>
            );
        case WORKFLOW_BEHAVIOR.VALIDATION.RESPONSE.negative:
            return (
                <CellDecision date={validationDate}>
                    <RemoveCircleIcon style={{ color: '#ffc107' }} />
                </CellDecision>
            );
        case WORKFLOW_BEHAVIOR.ADVISEMENT.RESPONSE.positive:
            return (
                <CellDecision date={validationDate}>
                    <CheckCircleIcon style={{ color: '#28a745' }} />
                </CellDecision>
            );
        case WORKFLOW_BEHAVIOR.ADVISEMENT.RESPONSE.negative:
            return (
                <CellDecision date={validationDate}>
                    <WarningIcon style={{ color: '#ffc107' }} />
                </CellDecision>
            );
        default:
            return 'En attente';
    }
}

const columns = [
    { id: 'visitor', label: 'Visiteur(s)' },
    { id: 'company', label: 'Unité/Société' },
    { id: 'type', label: 'Type' },
    { id: 'steps' }
];

const StyledFormLabel = withStyles({
    root: {
        margin: 'auto'
    }
})(FormControlLabel);

export default function TabRequestVisitorsAcces({ visitors, onChange }) {
    const { activeRole } = useLogin();
    const router = useRouter();

    const [rows, setDataRows] = useState(
        visitors.reduce((acc, dem) => {
            acc.push(createData(dem, activeRole));
            const activeRows = acc.filter((row) => row.step === ACTIVE_STEP_STATUS);
            return activeRows;
        }, [])
    );

    const classes = useStyles();

    const [selectAll, setSelectAll] = useState([
        {
            label: 'VA',
            value: false,
            validation: ROLES[activeRole.role].workflow.positive,
            tags: ['VA']
        },
        {
            label: 'VL',
            value: false,
            validation: ROLES[activeRole.role].workflow.positive,
            tags: ['VL']
        },
        {
            label: 'L',
            value: false,
            validation: ROLES[activeRole.role].workflow.positive,
            tags: ['L']
        },
        {
            label: 'VIP',
            value: false,
            tags: ['VIP']
        },
        {
            label: 'REFUSER',
            value: false,
            validation: ROLES[activeRole.role].workflow.negative,
            tags: ['']
        }
    ]);

    const handleSelectAll = useCallback(
        (checkbox, checkedValue) => {
            const newArray = rows.slice();
            newArray.forEach((row) => {
                if (checkedValue.label !== 'VIP') {
                    newArray[newArray.indexOf(row)].validation = checkbox
                        ? checkedValue.label
                        : null;
                    newArray[newArray.indexOf(row)].decision = checkbox
                        ? checkedValue.validation
                        : null;
                } else {
                    newArray[newArray.indexOf(row)].vip = checkbox;
                }
            });
            setDataRows(newArray);

            const newChecked = selectAll.map((check) => {
                if (checkbox) {
                    return {
                        ...check,
                        value: check.label === checkedValue.label
                    };
                }
                return {
                    ...check,
                    value: null
                };
            });
            setSelectAll(newChecked);
        },
        [rows, selectAll]
    );

    const handleChange = useCallback(
        (event, row, checkbox) => {
            if (event.target.checked) {
                const newArray = rows.slice();
                const indexOfRow = newArray.indexOf(row);
                newArray[indexOfRow].validation = event.target.value;
                newArray[indexOfRow].decision = checkbox.validation;
                newArray[indexOfRow].tags = checkbox.tags;
                setDataRows(newArray);
                setSelectAll(
                    selectAll.map((check) => ({
                        ...check,
                        value: null
                    }))
                );
            }
        },
        [rows, selectAll]
    );

    const handleVip = useCallback(
        (event, row) => {
            const newArray = rows.slice();
            const indexOfRow = newArray.indexOf(row);
            newArray[indexOfRow].vip = event.target.checked;
            setDataRows(newArray);
            setSelectAll(
                selectAll.map((check) => ({
                    ...check,
                    value: null
                }))
            );
        },
        [rows, selectAll]
    );

    const handleDeselect = useCallback(
        (index) => {
            const newArray = rows.slice();
            if (newArray[index].validation != null) {
                newArray[index].decision = null;
                newArray[index].validation = null;
                setDataRows(newArray);
            }
        },
        [rows]
    );

    useEffect(() => {
        if (!rows.length) {
            router.push('/');
        }
        onChange(rows);
    }, [onChange, rows]);

    return rows.length ? (
        <div>
            <StatusLegend />
            <TableContainer>
                <Table size="small" className={classes.table} data-testid="screeningTable">
                    <TableHead>
                        <TableRow>
                            {columns.map((headCell) => {
                                switch (headCell.id) {
                                    case 'visitors':
                                        return (
                                            <CustomTableHeader rowSpan={2} key={headCell.id}>
                                                {/* @todo length etc ... */ `${headCell.label}`}
                                            </CustomTableHeader>
                                        );
                                    case 'steps':
                                        return rows[0].steps.map((column) => (
                                            <CustomTableHeader rowSpan={2} key={column.label}>
                                                {/* @todo length etc ... */ `${column.label}`}
                                            </CustomTableHeader>
                                        ));
                                    default:
                                        return (
                                            <CustomTableHeader rowSpan={2} key={headCell.id}>
                                                {headCell.label}
                                            </CustomTableHeader>
                                        );
                                }
                            })}
                            <CustomTableHeader
                                colSpan={selectAll.length}
                                className={`${classes.reportHeader} ${classes.reportRow}`}
                                style={{ borderBottom: 'none' }}>
                                Validation
                            </CustomTableHeader>
                        </TableRow>
                        <TableRow>
                            {selectAll.map((checkbox, index) => (
                                <CustomTableHeader
                                    key={checkbox.label}
                                    className={`${
                                        index === selectAll.length - 1 ? classes.borderRight : ''
                                    } ${index === selectAll.length - 5 ? classes.borderLeft : ''}`}
                                    style={{ textAlign: 'center' }}>
                                    <StyledFormLabel
                                        control={
                                            <Checkbox
                                                color="primary"
                                                checked={checkbox.value}
                                                onChange={(event) => {
                                                    handleSelectAll(event.target.checked, checkbox);
                                                }}
                                            />
                                        }
                                        label={checkbox.label}
                                        labelPlacement="start"
                                    />
                                </CustomTableHeader>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row, index) => (
                            <TableRow hover tabIndex={-1} key={row.code}>
                                {columns.map((column) => {
                                    const value = row[column.id];
                                    switch (column.id) {
                                        case 'steps':
                                            return value.map((step) => (
                                                <TableCell key={step.step} align={column.align}>
                                                    {decisionReturn(step.value)}
                                                </TableCell>
                                            ));
                                        case 'visitor':
                                            return (
                                                <TableCell key={column.id} align={column.align}>
                                                    <VisitorGrid
                                                        name={value}
                                                        vip={row.vip}
                                                        vipReason={row.vipReason}
                                                    />
                                                </TableCell>
                                            );
                                        default:
                                            return (
                                                <TableCell key={column.id} align={column.align}>
                                                    {value}
                                                </TableCell>
                                            );
                                    }
                                })}

                                {selectAll.map((checkbox, indexCheck) =>
                                    checkbox.label === 'VIP' ? (
                                        <TableCell
                                            className={`${
                                                index === rows.length - 1
                                                    ? classes.reportLastChild
                                                    : ''
                                            }
                    `}
                                            style={{ textAlign: 'center' }}>
                                            <StyledFormLabel
                                                control={
                                                    <CustomCheckbox
                                                        checked={row.vip}
                                                        onChange={(event) => {
                                                            handleVip(event, row);
                                                        }}
                                                        color="primary"
                                                    />
                                                }
                                                style={{ marginLeft: '10px' }}
                                            />
                                        </TableCell>
                                    ) : (
                                        <TableCell
                                            className={`${
                                                index === rows.length - 1
                                                    ? classes.reportLastChild
                                                    : ''
                                            }
                        ${indexCheck === selectAll.length - 1 ? classes.borderRight : ''}
                        ${indexCheck === 0 ? classes.borderLeft : ''}
                      `}>
                                            <StyledFormLabel
                                                value={checkbox.label}
                                                control={
                                                    <Radio
                                                        color="primary"
                                                        checked={
                                                            rows[index].validation ===
                                                            checkbox.label
                                                        }
                                                        onChange={(event) => {
                                                            handleChange(event, row, checkbox);
                                                        }}
                                                        onClick={() => handleDeselect(index)}
                                                    />
                                                }
                                                style={{ marginLeft: '10px' }}
                                            />
                                        </TableCell>
                                    )
                                )}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    ) : (
        <div />
    );
}

TabRequestVisitorsAcces.propTypes = {
    visitors: PropTypes.arrayOf(
        PropTypes.shape({
            firstname: PropTypes.string
        })
    ).isRequired,
    onChange: PropTypes.func.isRequired
};
