import React, { forwardRef, useState, useImperativeHandle } from 'react';
import PropTypes from 'prop-types';

import { useLazyQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Link from 'next/link';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import IconButton from '@material-ui/core/IconButton';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import DoneIcon from '@material-ui/icons/Done';
import ErrorIcon from '@material-ui/icons/Error';
import DescriptionIcon from '@material-ui/icons/Description';

import { fade } from '@material-ui/core/styles/colorManipulator';

import { format } from 'date-fns';
import TableContainer from '@material-ui/core/TableContainer';
import { useSnackBar } from '../../../lib/ui-providers/snackbar';
import CustomTableCellHeader from '../../styled/customTableCellHeader';

import EmptyArray from '../../styled/emptyArray';
import { useLogin } from '../../../lib/loginContext';

import { STATE_REQUEST } from '../../../utils/constants/enums';


const columns = [
  { id: 'id', label: 'N° demande', width: '220px' },
  {
    id: 'periode', label: 'Période', width: '100px', style: { textAlign: 'center' },
  },
  { id: 'owner', label: 'Demandeur' },
  { id: 'places', label: 'Lieu' },
  { id: 'reason', label: 'Motif' },
];

const StyledFormLabel = withStyles({
  root: {
    margin: 'auto',
  },
})(FormControlLabel);

function createData({
  id, requestData,
}) {
  const {
    owner, from, to, reason, places, status,
  } = requestData[0];
  return {
    id,
    periode: `${format(new Date(from), 'dd/MM/yyyy')}
          au
          ${format(new Date(to), 'dd/MM/yyyy')}`,
    owner: owner
      ? `
          ${owner.rank || ''} ${owner.lastname.toUpperCase()} ${owner.firstname} -
          ${owner.unit.label}`
      : '',

    places: places.map((place, index) => {
      if (index === places.length - 1) return `${place.label}.`;
      return `${place.label}, `;
    }),
    status,
    reason,
  };
}

function validRequest(status) {
  return !(status === STATE_REQUEST.STATE_CANCELED.state
  || status === STATE_REQUEST.STATE_REJECTED.state);
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  container: {
    maxHeight: 440,
  },
  icon: {
    marginBottom: '-20px',
    marginTop: '-20px',
  },
  buttons: {
    marginTop: '1vh',
    marginBottom: '1vh',
  },
  cellNoBorder: {
    border: 'none',
  },
  borderRight: {
    borderRight: 'solid 1px',
  },
  borderBottom: {
    borderBottom: 'solid 1px',
  },
  borderLeft: {
    borderLeft: 'solid 1px',
  },
  textCenter: {
    textAlign: 'center',
  },
  rowForm: {
    backgroundColor: fade(theme.palette.primary.main, 0.05),
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
  export: {
    color: 'white',
  },
  sortedHeader: {
    color: `${theme.palette.primary.main}!important`,
  },
  exportContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  inactive: {
    opacity: '.3',
    fontStyle: 'italic',
  },
}));

export const LIST_MY_VISITORS = gql`
         query listMyVisitors(
           $campusId: String!
           $isDone: RequestVisitorIsDone!
           $requestsId: [String]
         ) {
           campusId @client @export(as: "campusId")
           getCampus(id: $campusId) {
             listVisitors(isDone: $isDone, requestsId: $requestsId) {
               generateCSVExportLink{
                token
                link
               }
            }
          }
         }
       `;

const TabMyRequestUntreated = forwardRef(({ requests, detailLink, emptyLabel }, ref) => {
  const classes = useStyles();

  const { addAlert } = useSnackBar();
  const { activeRole } = useLogin();

  const rows = React.useMemo(() => requests.reduce((acc, dem) => {
    acc.push(createData(dem));
    return acc;
  }, []), [requests]);

  const [hover, setHover] = useState({});
  // sort Date
  const [order, setOrder] = useState('asc');

  const [chosen, setChosen] = useState([]);

  // getLink for the CSV
  const [exportCsv, { data, loading, error }] = useLazyQuery(LIST_MY_VISITORS);

  const createSortHandler = () => () => {
    const isAsc = order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setChosen(rows.filter((row) => validRequest(row.status)).map((row) => row.id));
    } else {
      setChosen([]);
    }
  };

  const handleMouseEnter = (index) => {
    setHover((prevState) => ({ ...prevState, [index]: true }));
  };

  const handleMouseLeave = (index) => {
    setTimeout(() => {}, 2000);
    setHover((prevState) => ({ ...prevState, [index]: false }));
  };

  const handleChangeCheckbox = (event, id) => {
    if (event.target.checked) {
      setChosen((ids) => [...ids, id]);
    } else {
      const chosenTemp = [...chosen];
      const indexId = chosenTemp.indexOf(id);
      if (indexId > -1) {
        chosenTemp.splice(indexId, 1);
      }
      setChosen(chosenTemp);
    }
  };

  React.useEffect(() => {
    const onCompleted = (d) => {
      const link = document.createElement('a');
      link.href = d.getCampus.listVisitors.generateCSVExportLink.link;
      link.setAttribute('download', `export-${new Date()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    };

    const onError = (e) => {
      addAlert({
        message:
              e.message,
        severity: 'error',
      });
    };

    if (onCompleted || onError) {
      if (onCompleted && !loading && !error && data) {
        onCompleted(data);
      } else if (onError && !loading && error) {
        onError(error);
      }
    }
  }, [loading, error, data]);

  useImperativeHandle(
    ref,
    () => ({
      async execExport() {
        if (chosen.length > 0) {
          await exportCsv({
            variables: {
              isDone: { role: activeRole.role, value: true },
              requestsId: chosen,
            },
          });
        } else {
          addAlert({
            message:
              'Aucune visite selectionée',
            severity: 'error',
          });
        }
      },
    }),
  );
  // triggerEvent from Parent Component

  return requests.length > 0 ? (
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <CustomTableCellHeader
                key={column.id}
                rowSpan={2}
                align={column.align}
                style={{ width: column.width }}
              >
                {column.label}
              </CustomTableCellHeader>
            ))}
            <CustomTableCellHeader key="actions" rowSpan={2} style={{ minWidth: '120px', width: '130px' }} />
            <CustomTableCellHeader colSpan={2} className={`${classes.reportHeader} ${classes.reportRow}`} style={{ minWidth: '150px', width: '180px', borderBottom: 'none' }}>
              Export
            </CustomTableCellHeader>
          </TableRow>
          <TableRow className={classes.textCenter}>
            <CustomTableCellHeader className={`${classes.textCenter} ${classes.borderLeft}`}>
              <StyledFormLabel
                control={(
                  <Checkbox
                    color="primary"
                    onChange={(event) => handleSelectAll(event)}
                  />
                      )}
              />
            </CustomTableCellHeader>
            <CustomTableCellHeader className={`${classes.textCenter} ${classes.borderRight}`}>
              <TableSortLabel
                className={classes.sortedHeader}
                direction={order}
                onClick={createSortHandler()}
              >
                Date
              </TableSortLabel>
            </CustomTableCellHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows && rows.map((row, index) => (
            <TableRow
              hover
              onMouseOver={() => handleMouseEnter(index)}
              onFocus={() => handleMouseEnter(index)}
              onMouseLeave={() => handleMouseLeave(index)}
              role="checkbox"
              tabIndex={-1}
              key={row.code}
            >
              {columns.map((column) => {
                const value = row[column.id];
                return column.id === 'criblage' ? (
                  <TableCell key={column.id} align={column.align}>
                    {value ? <DoneIcon style={{ color: '#4CAF50' }} /> : <ErrorIcon />}
                  </TableCell>
                ) : (
                  <TableCell key={column.id} align={column.align} style={column.style}>
                    {column.format && typeof value === 'number' ? column.format(value) : value}
                  </TableCell>
                );
              })}
              <TableCell key="modif">
                {hover[index] && (
                <div style={{ float: 'right' }}>
                  <Link href={`/demandes/${detailLink}/${row.id}`}>
                    <IconButton aria-label="modifier" className={classes.icon} color="primary">
                      <DescriptionIcon />
                    </IconButton>
                  </Link>
                </div>
                )}
              </TableCell>
              <TableCell
                className={`${
                  index === requests.length - 1 ? classes.borderBottom : ''
                } ${classes.borderLeft} ${classes.textCenter}`}
              >
                { validRequest(row.status) && (
                <Checkbox
                  color="primary"
                  checked={chosen.includes(row.id)}
                  onChange={(event) => handleChangeCheckbox(event, row.id)}
                />
                )}
              </TableCell>
              <TableCell className={`${
                index === requests.length - 1 ? classes.borderBottom : ''
              } ${classes.borderRight} ${classes.textCenter}`}
              >
                26/08/2020
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  ) : (
    <EmptyArray type={emptyLabel} />
  );
});

export default TabMyRequestUntreated;

TabMyRequestUntreated.propTypes = {
  request: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      from: PropTypes.date,
      to: PropTypes.date,
      owner: PropTypes.shape({
        firstname: PropTypes.string,
        birthLastname: PropTypes.string,
        rank: PropTypes.string,
        company: PropTypes.string,
      }),
      places: PropTypes.arrayOf(PropTypes.string),
      reason: PropTypes.string,
    }),
  ),
  detailLink: PropTypes.string.isRequired,
  emptyLabel: PropTypes.string.isRequired,
};

TabMyRequestUntreated.defaultProps = {
  request: [],
};
