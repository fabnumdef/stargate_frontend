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
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Checkbox from '@material-ui/core/Checkbox';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import CustomTableHeader from '../styled/customTableCellHeader';

import { tableSort, getComparator } from '../../utils/mappers/sortArrays';

import { ROLES } from '../../utils/constants/enums';
import { useLogin } from '../../lib/loginContext';

import { ACTIVE_STEP_STATUS } from '../../utils/mappers/checkStatusVisitor';

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
  linkCsv: {
    color: '#fff',
    textDecoration: 'none',
    padding: '0.4em 2.5em 0.4em 0.7em',
    margin: '-0.4em -2.5em -0.4em -0.7em',
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


const columns = [
  { id: 'birthLastname', label: 'Nom de N.', fullLabel: 'Nom de Naissance' },
  { id: 'firstname', label: 'Prénom' },
  { id: 'birthday', label: 'Date de N.', fullLabel: 'Date de Naissance' },
  { id: 'birthplace', label: 'Lieu de N.', fullLabel: 'Lieu de Naissance' },
  { id: 'nationality', label: 'Nationalité' },
  { id: 'report', label: 'Signalement' },
];


export default function ScreeningTable({ visitors, onChange }) {
  const { activeRole } = useLogin();

  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('birthLastname');


  const createSortHandler = (property) => () => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const classes = useStyles();

  const [selectAll, setSelectAll] = useState([
    { label: 'RAS', value: false, report: ROLES[activeRole.role].workflow.positive },
    { label: 'RES', value: false, report: ROLES[activeRole.role].workflow.negative },
  ]);

  // Filter
  const handleSelectAll = (checkbox, checkedValue) => {
    const newArray = visitors.slice();

    visitors.forEach((row) => {
      if (row.screening === ACTIVE_STEP_STATUS) {
        newArray[newArray.indexOf(row)].report = checkbox ? checkedValue : null;
      }
    });

    onChange(newArray);

    const newChecked = selectAll.map((check) => {
      if (checkbox) {
        return {
          ...check,
          value: check.report === checkedValue,
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
    setSelectAll(
      selectAll.map((check) => ({
        ...check,
        value: null,
      })),
    );
  };

  const handleDeselect = (row) => {
    const newArray = visitors.slice();
    if (newArray[newArray.indexOf(row)].report != null) {
      newArray[newArray.indexOf(row)].report = null;
      onChange(newArray);
    }
  };

  return (
    <div className={classes.root}>
      <TableContainer>
        <Table size="small" className={classes.table} data-testid="screeningTable">
          <TableHead>
            <TableRow>
              {columns.map((headCell) => {
                switch (headCell.id) {
                  case 'birthLastname':
                    return (
                      <CustomTableHeader key={headCell.id}>
                        <TableSortLabel
                          className={classes.sortedHeader}
                          active={headCell.id === 'birthLastname'}
                          direction={orderBy === headCell.id ? order : 'asc'}
                          onClick={createSortHandler(headCell.id)}
                        >
                          {headCell.label}
                        </TableSortLabel>
                      </CustomTableHeader>
                    );
                  case 'nationality':
                    return (
                      <CustomTableHeader key={headCell.id}>
                        {headCell.label}
                        <Typography ariant="subtitle2">Étrangère</Typography>
                      </CustomTableHeader>
                    );
                  case 'report':
                    return (
                      <CustomTableHeader
                        className={`${classes.reportHeader} ${classes.reportRow}`}
                        key={headCell.id}
                      >
                        {headCell.label}

                        <FormGroup row className={classes.reportCheckbox}>
                          {selectAll.map((checkbox) => (
                            <FormControlLabel
                              control={(
                                <Checkbox
                                  color="primary"
                                  checked={checkbox.value}
                                  onChange={(event) => {
                                    handleSelectAll(event.target.checked, checkbox.report);
                                  }}
                                />
                              )}
                              label={checkbox.label}
                              labelPlacement="start"
                            />
                          ))}
                        </FormGroup>
                      </CustomTableHeader>
                    );
                  default:
                    return (
                      <CustomTableHeader key={headCell.id}>{headCell.label}</CustomTableHeader>
                    );
                }
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {tableSort(visitors, getComparator(order, orderBy)).map((row, index) => (
              <TableRow hover tabIndex={-1} key={row.code}>
                {columns.map((column) => {
                  const value = row[column.id];
                  switch (column.id) {
                    case 'birthLastname':
                      return row.vAttachedFile === true ? (
                        <TableCell
                          key={column.id}
                          align={column.align}
                          className={
                            row.screening !== ACTIVE_STEP_STATUS ? classes.inactiveCell : ''
                          }
                        >
                          {value}
                          <IconButton aria-label="AttachFileIcon">
                            <AttachFileIcon />
                          </IconButton>
                        </TableCell>
                      ) : (
                        <TableCell
                          key={column.id}
                          align={column.align}
                          className={
                            row.screening !== ACTIVE_STEP_STATUS ? classes.inactiveCell : ''
                          }
                        >
                          {value}
                        </TableCell>
                      );
                    case 'nationality':
                      return value === 'Française' ? (
                        <TableCell
                          key={column.id}
                          align={column.align}
                          className={
                            row.screening !== ACTIVE_STEP_STATUS ? classes.inactiveCell : ''
                          }
                        />
                      ) : (
                        <TableCell
                          key={column.id}
                          align={column.align}
                          className={
                            row.screening !== ACTIVE_STEP_STATUS ? classes.inactiveCell : ''
                          }
                        >
                          {value}
                        </TableCell>
                      );
                    case 'report':
                      return (
                        <TableCell
                          key={column.id}
                          align={column.align}
                          className={`${classes.reportRow} ${
                            index === visitors.length - 1 ? classes.reportLastChild : ''
                          }`}
                        >
                          <RadioGroup
                            className={classes.radioGroup}
                            value={row.report}
                            onChange={(event) => {
                              const newArray = visitors.slice();
                              newArray[newArray.indexOf(row)].report = event.target.value;
                              onChange(newArray);
                              deselectAllCheckbox();
                            }}
                          >
                            <FormControlLabel
                              value={ROLES[activeRole.role].workflow.positive}
                              disabled={row.screening !== ACTIVE_STEP_STATUS}
                              control={
                                <Radio color="primary" onClick={() => handleDeselect(row)} />
                              }
                            />
                            <FormControlLabel
                              value={ROLES[activeRole.role].workflow.negative}
                              disabled={row.screening !== ACTIVE_STEP_STATUS}
                              control={
                                <Radio color="primary" onClick={() => handleDeselect(row)} />
                              }
                              style={{ marginRight: '0px' }}
                            />
                          </RadioGroup>
                        </TableCell>
                      );
                    default:
                      return (
                        <TableCell
                          key={column.id}
                          align={column.align}
                          className={
                            row.screening !== ACTIVE_STEP_STATUS ? classes.inactiveCell : ''
                          }
                        >
                          {value}
                        </TableCell>
                      );
                  }
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

ScreeningTable.propTypes = {
  visitors: PropTypes.arrayOf(PropTypes.object),
  onChange: PropTypes.func.isRequired,
};

ScreeningTable.defaultProps = {
  visitors: [],
};