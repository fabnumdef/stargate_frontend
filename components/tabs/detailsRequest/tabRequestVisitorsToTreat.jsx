import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import { fade } from '@material-ui/core/styles/colorManipulator';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Checkbox from '@material-ui/core/Checkbox';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import WarningIcon from '@material-ui/icons/Warning';

import { useRouter } from 'next/router';
import { useLogin } from '../../../lib/loginContext';
import CustomTableHeader from '../../styled/customTableCellHeader';

import { EMPLOYEE_TYPE, ROLES } from '../../../utils/constants/enums';

import ckeckStatusVisitor, {
  ACTIVE_STEP_STATUS,
  HIDDEN_STEP_STATUS,
  INACTIVE_STEP_STATUS,
} from '../../../utils/mappers/checkStatusVisitor';

import checkCriblageVisitor, {
  REFUSED_STATUS,
  ACCEPTED_STATUS,
  PROGRESS_STEP_STATUS,
} from '../../../utils/mappers/checkCriblageVisitor';

const useStyles = makeStyles((theme) => ({
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
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
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
  radioGroup: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  searchField: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  headers: {
    backgroundColor: fade(theme.palette.primary.main, 0.05),
    color: theme.palette.primary.main,
    fontSize: '18px',
    fontWeight: '600',
  },
  sortedHeader: {
    color: `${theme.palette.primary.main}!important`,
  },
  reportHeader: {
    textAlign: 'center',
    borderTop: 'solid 1px',
  },
  reportRow: {
    borderLeft: 'solid 1px',
    borderRight: 'solid 1px',
  },
  reportLastChild: {
    borderBottom: 'solid 1px',
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
  inactiveCell: {
    opacity: '0.2',
  },
}));

function createData({
  id, firstname, birthLastname, rank, company, employeeType, status,
}, activeRole) {
  const findStep = ckeckStatusVisitor(status, activeRole);
  return {
    id,
    visitor: rank
      ? `${rank} ${birthLastname.toUpperCase()} ${firstname}`
      : `${birthLastname.toUpperCase()} ${firstname}`,
    company,
    type: EMPLOYEE_TYPE[employeeType],
    criblage: checkCriblageVisitor(status),
    validation: null,
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

export default function TabRequestVisitors({ visitors, onChange }) {
  const { activeRole } = useLogin();
  const router = useRouter();

  const [rows, setDataRows] = useState(
    visitors.reduce((acc, dem) => {
      acc.push(createData(dem, activeRole));
      return acc;
    }, []),
  );

  const classes = useStyles();

  const [selectAll, setSelectAll] = React.useState([
    { label: 'ACCEPTER', value: false, validation: ROLES[activeRole.role].workflow.positive },
    { label: 'REFUSER', value: false, validation: ROLES[activeRole.role].workflow.negative },
  ]);

  const handleSelectAll = (checkbox, checkedValue) => {
    const newArray = rows.slice();
    newArray.forEach((row) => {
      if (row.step === ACTIVE_STEP_STATUS) {
        newArray[newArray.indexOf(row)].validation = checkbox ? checkedValue : null;
      }
    });
    setDataRows(newArray);

    const newChecked = selectAll.map((check) => {
      if (checkbox) {
        return {
          ...check,
          value: check.validation === checkedValue,
        };
      }
      return {
        ...check,
        value: null,
      };
    });
    setSelectAll(newChecked);
  };

  const deselectAllCheckbox = () => {
    setSelectAll(selectAll.map((check) => ({
      ...check,
      value: null,
    })));
  };

  const handleDeselect = (row) => {
    const newArray = rows.slice();
    if (newArray[newArray.indexOf(row)].validation != null) {
      newArray[newArray.indexOf(row)].validation = null;
      setDataRows(newArray);
    }
  };

  useEffect(() => {
    if (rows.every((row) => row.step === HIDDEN_STEP_STATUS)) {
      router.push('/');
    }
    onChange(rows);
  }, [onChange, rows]);

  return (
    <div className={classes.root}>
      <TableContainer>
        <Table size="small" className={classes.table} data-testid="screeningTable">
          <TableHead>
            <TableRow>
              {columns.map((headCell) => {
                switch (headCell.id) {
                  case 'visitors':
                    return (
                      <CustomTableHeader key={headCell.id}>
                        {/* @todo length etc ... */ `${headCell.label}`}
                      </CustomTableHeader>
                    );
                  case 'criblage':
                    return (
                      (activeRole.role === ROLES.ROLE_SECURITY_OFFICER.role
                        && (
                        <CustomTableHeader key={headCell.id}>
                          {/* @todo length etc ... */ `${headCell.label}`}
                        </CustomTableHeader>
                        )
                      ));
                  default:
                    return (
                      <CustomTableHeader key={headCell.id}>{headCell.label}</CustomTableHeader>
                    );
                }
              })}
              <CustomTableHeader
                className={`${classes.reportHeader} ${classes.reportRow}`}
              >
                Validation
                <FormGroup row className={classes.reportCheckbox}>
                  {selectAll.map((checkbox) => (
                    <FormControlLabel
                      control={(
                        <Checkbox
                          color="primary"
                          checked={checkbox.value}
                          onChange={(event) => {
                            handleSelectAll(event.target.checked, checkbox.validation);
                          }}
                        />
                                     )}
                      label={checkbox.label}
                      disabled={!rows.find((row) => row.step === ACTIVE_STEP_STATUS)}
                      labelPlacement="start"
                    />
                  ))}
                </FormGroup>
              </CustomTableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map(
              (row, index) => row.step !== HIDDEN_STEP_STATUS && (
              <TableRow hover tabIndex={-1} key={row.code}>
                {columns.map((column) => {
                  const value = row[column.id];
                  switch (column.id) {
                    case 'criblage':
                      return (
                        (activeRole.role === ROLES.ROLE_SECURITY_OFFICER.role
                        && (
                        <TableCell
                          key={column.id}
                          align={column.align}
                          className={row.step === INACTIVE_STEP_STATUS ? classes.inactiveCell : ''}
                        >
                          { criblageReturn(value) }
                        </TableCell>
                        )
                        )
                      );
                    default:
                      return (
                        <TableCell
                          key={column.id}
                          align={column.align}
                          className={row.step === INACTIVE_STEP_STATUS
                            ? classes.inactiveCell
                            : ''}
                        >
                          {value}
                        </TableCell>
                      );
                  }
                })}
                <TableCell
                  className={`${classes.reportRow} ${
                    index === rows.length - 1 ? classes.reportLastChild : ''
                  }`}
                >
                  <RadioGroup
                    className={classes.radioGroup}
                    value={row.validation}
                    onChange={(event) => {
                      const newArray = rows.slice();
                      newArray[newArray.indexOf(row)].validation = event.target.value;
                      setDataRows(newArray);
                      deselectAllCheckbox();
                    }}
                    style={{ justifyContent: 'space-evenly' }}
                  >
                    <FormControlLabel
                      value={ROLES[activeRole.role].workflow.positive}
                      disabled={row.step === INACTIVE_STEP_STATUS}
                      control={(
                        <Radio
                          color="primary"
                          onClick={() => handleDeselect(row)}
                          disabled={row.step === INACTIVE_STEP_STATUS}
                        />
                                         )}
                    />
                    <FormControlLabel
                      value={ROLES[activeRole.role].workflow.negative}
                      disabled={row.step === INACTIVE_STEP_STATUS}
                      control={(
                        <Radio
                          color="primary"
                          onClick={() => handleDeselect(row)}
                          disabled={row.step === INACTIVE_STEP_STATUS}
                        />
                                         )}
                    />
                  </RadioGroup>
                </TableCell>
              </TableRow>
              ),
            )}
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
