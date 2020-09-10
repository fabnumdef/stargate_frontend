import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import Link from 'next/link';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import IconButton from '@material-ui/core/IconButton';
import DoneIcon from '@material-ui/icons/Done';
import ErrorIcon from '@material-ui/icons/Error';
import DescriptionIcon from '@material-ui/icons/Description';

import { format } from 'date-fns';
import TableContainer from '@material-ui/core/TableContainer';
import CustomTableCellHeader from '../../styled/customTableCellHeader';

import EmptyArray from '../../styled/emptyArray';

const columns = [
  { id: 'id', label: 'N° demande', width: '220px' },
  {
    id: 'periode', label: 'Période', width: '100px', style: { textAlign: 'center' },
  },
  { id: 'owner', label: 'Demandeur' },
  { id: 'places', label: 'Lieu' },
  { id: 'reason', label: 'Motif' },
];

function createData({
  id, owner, from, to, reason, places,
}) {
  return {
    id,
    periode: `${format(new Date(from), 'dd/MM/yyyy')}
          au
          ${format(new Date(to), 'dd/MM/yyyy')}`,
    owner: owner
      ? `
          ${owner.rank || ''} ${owner.lastname.toUpperCase()} ${owner.firstname} -
          ${owner.unit}`
      : '',

    places: places.map((place, index) => {
      if (index === places.length - 1) return `${place.label}.`;
      return `${place.label}, `;
    }),
    reason,
  };
}

const useStyles = makeStyles({
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
  export: {
    color: 'white',
  },
  exportContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  inactive: {
    opacity: '.3',
    fontStyle: 'italic',
  },
});

export default function TabMyRequestUntreated({ requests, detailLink, emptyLabel }) {
  const classes = useStyles();
  const rows = React.useMemo(() => requests.reduce((acc, dem) => {
    acc.push(createData(dem));
    return acc;
  }, []), [requests]);

  const [hover, setHover] = useState({});

  const handleMouseEnter = (index) => {
    setHover((prevState) => ({ ...prevState, [index]: true }));
  };

  const handleMouseLeave = (index) => {
    setTimeout(() => {}, 2000);
    setHover((prevState) => ({ ...prevState, [index]: false }));
  };

  return requests.length > 0 ? (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <CustomTableCellHeader
                key={column.id}
                align={column.align}
                style={{ width: column.width }}
              >
                {column.label}
              </CustomTableCellHeader>
            ))}
            <CustomTableCellHeader key="actions" style={{ minWidth: '120px', width: '130px' }} />
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
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  ) : (
    <EmptyArray type={emptyLabel} />
  );
}

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
