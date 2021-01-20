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
import WarningIcon from '@material-ui/icons/Warning';

import { useRouter } from 'next/router';
import TableContainer from '@material-ui/core/TableContainer';
import { useLogin } from '../../../lib/loginContext';
import CustomTableHeader from '../../styled/customTableCellHeader';
import VisitorGrid from '../../styled/visitor';

import { EMPLOYEE_TYPE, ROLES } from '../../../utils/constants/enums';

import ckeckStatusVisitor, {
  ACTIVE_STEP_STATUS,
} from '../../../utils/mappers/checkStatusVisitor';

import checkCriblageVisitor, {
  REFUSED_STATUS,
  ACCEPTED_STATUS,
  PROGRESS_STEP_STATUS,
} from '../../../utils/mappers/checkCriblageVisitor';
import StatusLegend from '../../styled/statusLegend';

const useStyles = makeStyles((theme) => ({
  currentTitle: {
    lineHeight: '1.33',
    letterSpacing: '0.14px',
    color: theme.palette.primary.main,
    marginTop: '1%',
    marginBottom: '0,5 %',
  },
  table: {
    minWidth: 750,
    marginTop: '0.5%',
    marginBottom: '1%',
  },
  radioGroup: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  searchField: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  cellNoBorder: {
    border: 'none',
  },
  borderRight: {
    borderRight: 'solid 1px',
  },
  borderLeft: {
    borderLeft: 'solid 1px',
  },
  rowForm: {
    backgroundColor: fade(theme.palette.primary.main, 0.05),
    color: `${theme.palette.primary.main}!important`,
  },
  sortedHeader: {
    color: `${theme.palette.primary.main}!important`,
  },
  reportHeader: {
    textAlign: 'center',
    minWidth: '450px',
    borderTop: 'solid 1px',
    whiteSpace: 'nowrap',
  },
  reportRow: {
    borderLeft: 'solid 1px',
    borderRight: 'solid 1px',
  },
  reportLastChild: {
    borderBottom: 'solid 1px',
  },
  textCenter: {
    textAlign: 'center',
  },
  reportCheckbox: {
    justifyContent: 'center',
  },
  submitButton: {
    float: 'right',
  },
  paginator: {
    float: 'left',
  },
}));

function createData({
  id, firstname, birthLastname, rank, company, employeeType, units, vip, vipReason,
}, activeRole) {
  const findStep = ckeckStatusVisitor(units, activeRole);
  return {
    id,
    visitor: rank
      ? `${rank} ${birthLastname.toUpperCase()} ${firstname}`
      : `${birthLastname.toUpperCase()} ${firstname}`,
    company,
    type: EMPLOYEE_TYPE[employeeType],
    criblage: checkCriblageVisitor(units),
    validation: null,
    vip,
    vipReason,
    step: findStep.step,
    unitToShift: findStep.step === ACTIVE_STEP_STATUS ? findStep.unit : null,
  };
}

const columns = [
  { id: 'visitor', label: 'Visiteur(s)' },
  { id: 'company', label: 'Unité/Société' },
  { id: 'type', label: 'Type' },
  { id: 'criblage', label: 'Criblage' },
];

function criblageReturn(value) {
  switch (value) {
    case PROGRESS_STEP_STATUS:
      return 'En cours';
    case ACCEPTED_STATUS:
      return <CheckCircleIcon style={{ color: '#28a745' }} />;
    case REFUSED_STATUS:
      return <WarningIcon style={{ color: '#ffc107' }} />;
    default:
      return null;
  }
}

const StyledFormLabel = withStyles({
  root: {
    margin: 'auto',
  },
})(FormControlLabel);

export default function TabRequestVisitors({ visitors, onChange }) {
  const { activeRole } = useLogin();
  const router = useRouter();
  const classes = useStyles();

  const [rows, setDataRows] = useState(
    visitors.reduce((acc, dem) => {
      acc.push(createData(dem, activeRole));
      const activeRows = acc.filter((row) => row.step === ACTIVE_STEP_STATUS);
      return activeRows;
    }, []),
  );

  const initSelectAll = () => {
    if (activeRole.role === ROLES.ROLE_SECURITY_OFFICER.role) {
      return [
        {
          label: 'VA',
          value: false,
          validation: ROLES[activeRole.role].workflow.positive,
          tags: ['VA'],
        },
        {
          label: 'VL',
          value: false,
          validation: ROLES[activeRole.role].workflow.positive,
          tags: ['VL'],
        },
        {
          label: 'REFUSER',
          value: false,
          validation: ROLES[activeRole.role].workflow.negative,
          tags: [],
        },
      ];
    }
    return [
      {
        label: 'ACCEPTER',
        value: false,
        validation: ROLES[activeRole.role].workflow.positive,
        tags: [],
      },
      {
        label: 'REFUSER',
        value: false,
        validation: ROLES[activeRole.role].workflow.negative,
        tags: [],
      },
    ];
  };

  const [selectAll, setSelectAll] = useState(initSelectAll());

  const handleSelectAll = useCallback((checkbox, checkedValue) => {
    const newArray = rows.slice();
    newArray.forEach((row) => {
      newArray[newArray.indexOf(row)].validation = checkbox ? checkedValue.label : null;
      newArray[newArray.indexOf(row)].decision = checkbox ? checkedValue.validation : null;
      newArray[newArray.indexOf(row)].tags = checkedValue.tags;
    });
    setDataRows(newArray);

    const newChecked = selectAll.map((check) => {
      if (checkbox) {
        return {
          ...check,
          value: check.label === checkedValue.label,
        };
      }
      return {
        ...check,
        value: null,
      };
    });
    setSelectAll(newChecked);
  }, [rows, selectAll]);

  const handleChange = useCallback((event, row, checkbox) => {
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
          value: null,
        })),
      );
    }
  }, [rows, selectAll]);

  const handleDeselect = useCallback((index) => {
    const newArray = rows.slice();
    if (newArray[index].validation != null) {
      newArray[index].decision = null;
      newArray[index].validation = null;
      setDataRows(newArray);
    }
  }, [rows]);

  useEffect(() => {
    if (!rows.length) {
      router.push('/');
    }
    onChange(rows);
  }, [onChange, rows]);

  return (
    <div>
      {activeRole.role === ROLES.ROLE_SECURITY_OFFICER.role && <StatusLegend />}
      <TableContainer>
        <Table size="small" className={classes.table} data-testid="screeningTable">
          <TableHead>
            <TableRow>
              { columns.map((headCell) => {
                switch (headCell.id) {
                  case 'visitor':
                    return (
                      <CustomTableHeader rowSpan={2} key={headCell.id}>
                        {/* @todo length etc ... */ `${headCell.label}` }
                      </CustomTableHeader>
                    );
                  case 'criblage':
                    return (
                      activeRole.role === ROLES.ROLE_SECURITY_OFFICER.role && (
                        <CustomTableHeader rowSpan={2} key={headCell.id} style={{ 'text-align': 'center' }}>
                          {/* @todo length etc ... */ `${headCell.label}` }
                        </CustomTableHeader>
                      )
                    );
                  default:
                    return (
                      <CustomTableHeader rowSpan={2} key={headCell.id}>
                        { headCell.label }
                      </CustomTableHeader>
                    );
                }
              }) }
              <CustomTableHeader colSpan={selectAll.length} className={`${classes.reportHeader} ${classes.reportRow}`} style={{ borderBottom: 'none' }}>
                Validation
              </CustomTableHeader>
            </TableRow>
            <TableRow>

              { selectAll.map((checkbox, index) => (
                <CustomTableHeader className={`${classes.textCenter} ${index === selectAll.length - 1 ? classes.borderRight : ''}
                 ${activeRole.role !== ROLES.ROLE_SECURITY_OFFICER.role && index === selectAll.length - 2 ? classes.borderLeft : ''}
                 ${activeRole.role === ROLES.ROLE_SECURITY_OFFICER.role && index === selectAll.length - 3 ? classes.borderLeft : ''}`}
                >
                  <StyledFormLabel
                    control={(
                      <Checkbox
                        color="primary"
                        checked={checkbox.value}
                        onChange={(event) => {
                          handleSelectAll(event.target.checked, checkbox);
                        }}
                      />
                    )}
                    label={checkbox.label}
                    disabled={!rows.find((row) => row.step === ACTIVE_STEP_STATUS)}
                    labelPlacement="start"
                  />
                </CustomTableHeader>
              )) }

            </TableRow>
          </TableHead>
          <TableBody>
            { rows.map(
              (row, index) => (
                <TableRow hover tabIndex={-1} key={row.code}>
                  { columns.map((column) => {
                    const value = row[column.id];
                    switch (column.id) {
                      case 'visitor':
                        return (
                          <TableCell key={column.id} align={column.align}>
                            <VisitorGrid name={value} vip={row.vip} vipReason={row.vipReason} />
                          </TableCell>
                        );
                      case 'criblage':
                        return (
                          activeRole.role === ROLES.ROLE_SECURITY_OFFICER.role && (
                            <TableCell
                              key={column.id}
                              align={column.align}
                              className={classes.textCenter}
                            >
                              { criblageReturn(value) }
                            </TableCell>
                          )
                        );
                      default:
                        return (
                          <TableCell
                            key={column.id}
                            align={column.align}
                          >
                            { value }
                          </TableCell>
                        );
                    }
                  }) }
                  { selectAll.map((checkbox, indexCheck) => (
                    <TableCell
                      className={`
                      ${classes.textCenter}
                      ${index === rows.length - 1 ? classes.reportLastChild : ''}
                      ${indexCheck === selectAll.length - 1 ? classes.borderRight : ''}
                      ${indexCheck === 0 ? classes.borderLeft : ''}
                    `}
                      style={{ textAlign: 'center' }}
                    >
                      <StyledFormLabel
                        value={checkbox.label}
                        control={(
                          <Radio
                            color="primary"
                            checked={
                              rows[index].decision === checkbox.validation
                              && rows[index].tags === checkbox.tags
                            }
                            onChange={(event) => {
                              handleChange(event, row, checkbox);
                            }}
                            onClick={() => handleDeselect(index)}
                          />
                        )}
                        style={{ marginLeft: '10px' }}
                      />
                    </TableCell>
                  )) }
                </TableRow>
              ),
            ) }
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

TabRequestVisitors.propTypes = {
  visitors: PropTypes.arrayOf(
    PropTypes.shape({
      firstname: PropTypes.string,
    }),
  ).isRequired,
  onChange: PropTypes.func.isRequired,
};
