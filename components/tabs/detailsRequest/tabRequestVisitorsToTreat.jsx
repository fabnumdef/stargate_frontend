import React, { useState } from 'react';
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

import { useLogin } from '../../../lib/loginContext';
import CustomTableHeader from '../../styled/customTableCellHeader';

import { ROLES } from '../../../utils/constants/enums';

import ckeckStatusVisitor, {
  HIDEN_STEP_STATUS,
  INACTIF_STEP_STATUS,
} from '../../../utils/mappers/checkStatusVisitor';

import checkCriblageVisitor, {
  REFUSED_STATUS,
  ACCEPTED_STATUS,
  ACTIF_STEP_STATUS,
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
  id, firstname, birthLastname, rank, company, type, status,
}, activeRole) {
  return {
    id,
    visitor: rank
      ? `${rank} ${birthLastname.toUpperCase()} ${firstname}`
      : `${birthLastname.toUpperCase()} ${firstname}`,
    company,
    type,
    criblage: checkCriblageVisitor(status, activeRole),
    validation: null,
    step: ckeckStatusVisitor(status, activeRole),
  };
}

const columns = [
  { id: 'visitor', label: 'Visiteur(s)' },
  { id: 'company', label: 'Unité/Société' },
  { id: 'type', label: 'Type' },
  { id: 'criblage', label: 'Criblage' },
];


function getCheckbox() {
  return {
    ACCEPTER: false,
    REFUSER: false,
  };
}

function criblageReturn(value) {
  switch (value) {
    case ACTIF_STEP_STATUS:
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

  const [rows, setDataRows] = useState(
    visitors.reduce((acc, dem) => {
      acc.push(createData(dem, activeRole));
      return acc;
    }, []),
  );

  const classes = useStyles();

  const [checked, setChecked] = React.useState(getCheckbox());

  const handleSelectAll = (checkbox, value) => {
    const newArray = rows.slice();

    newArray.forEach((row) => {
      newArray[newArray.indexOf(row)].validation = checkbox ? value : null;
    });

    setDataRows(newArray);
  };

  const handleDeselect = (row) => {
    const newArray = rows.slice();
    if (newArray[newArray.indexOf(row)].validation != null) {
      newArray[newArray.indexOf(row)].validation = null;
      setDataRows(newArray);
    }
  };

  React.useEffect(() => {
    // Share changes to onther components
    onChange(rows);

    // UI tool
    let ACCEPTER = true;
    let REFUSER = true;

    rows.some((row) => {
      // @todo: refactor this switch
      switch (row.validation) {
        case null:
          ACCEPTER = false;
          REFUSER = false;
          return true;
        case 'ACCEPTER':
          REFUSER = false;
          break;
        case 'REFUSER':
          ACCEPTER = false;
          break;
        default:
          break;
      }
      return false;
    });

    setChecked({
      ACCEPTER,
      REFUSER,
    });
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
                  {Object.keys(getCheckbox()).map((value) => (
                    <FormControlLabel
                      control={(
                        <Checkbox
                          color="primary"
                          checked={checked[value]}
                          onChange={(event) => {
                            setChecked({ ...getCheckbox, [value]: !checked[value] });
                            handleSelectAll(event.target.checked, value);
                          }}
                        />
                                     )}
                      label={value}
                      labelPlacement="start"
                    />
                  ))}
                </FormGroup>
              </CustomTableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map(
              (row, index) => row.step.state !== HIDEN_STEP_STATUS && (
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
                          className={row.step.state === INACTIF_STEP_STATUS ? classes.inactiveCell : ''}
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
                          className={row.step.state === INACTIF_STEP_STATUS
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
                    }}
                    style={{ justifyContent: 'space-evenly' }}
                  >
                    <FormControlLabel
                      value="ACCEPTER"
                      disabed={row.step.state === INACTIF_STEP_STATUS}
                      control={(
                        <Radio
                          color="primary"
                          onClick={() => handleDeselect(row)}
                        />
                                         )}
                    />
                    <FormControlLabel
                      value="REFUSER"
                      disabed={row.step.state === INACTIF_STEP_STATUS}
                      control={(
                        <Radio
                          color="primary"
                          onClick={() => handleDeselect(row)}
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