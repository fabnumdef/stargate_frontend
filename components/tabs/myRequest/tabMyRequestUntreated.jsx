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
import CustomTableCellHeader from '../../styled/customTableCellHeader';
import EmptyArray from '../../styled/emptyArray';

const columns = [
  { id: 'id', label: 'N° demande' },
  { id: 'periode', label: 'Période' },
  { id: 'demandeur', label: 'Demandeur' },
  { id: 'places', label: 'Lieu' },
  { id: 'reason', label: 'Motif' },
];

function createData({
  id, demandeur, from, to, reason, places,
}) {
  return {
    id,
    periode: `${format(new Date(from), 'dd/MM/yyyy')}
          au
          ${format(new Date(to), 'dd/MM/yyyy')}`,
    demandeur: demandeur
      ? `
          ${demandeur.rank} ${demandeur.birthLastname.toUpperCase()} ${demandeur.firstname}
          ${demandeur.company}`
      : '',

    places: places.map((lieu, index) => {
      if (index === places.length - 1) return `${lieu.value}.`;
      return `${lieu.value}, `;
    }),
    reason,
  };
}

/*
function formattedDate(d) {
let day = String(d.getDate());
let month = String(d.getMonth() + 1);
const year = String(d.getFullYear());

if (month.length < 2) month = `0${ month}`;
if (day.length < 2) day = `0${ day}`;

return `${day}/${month}/${year}`;
}
*/

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
});

export default function TabMyRequestUntreated({ request }) {
  const classes = useStyles();

  const rows = request.reduce((acc, dem) => {
    acc.push(createData(dem));
    return acc;
  }, []);

  const [hover, setHover] = useState({});

  const handleMouseEnter = (index) => {
    setHover((prevState) => ({ ...prevState, [index]: true }));
  };

  const handleMouseLeave = (index) => {
    setTimeout(() => {}, 2000);
    setHover((prevState) => ({ ...prevState, [index]: false }));
  };

  return request.length > 0 ? (
    <Table>
      <TableHead>
        <TableRow>
          {columns.map((column) => (
            <CustomTableCellHeader key={column.id} align={column.align}>
              {column.label}
            </CustomTableCellHeader>
          ))}
          <CustomTableCellHeader key="actions" style={{ minWidth: '150px' }} />
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map((row, index) => (
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
                <TableCell key={column.id} align={column.align}>
                  {column.format && typeof value === 'number' ? column.format(value) : value}
                </TableCell>
              );
            })}
            <TableCell key="modif">
              {hover[index] && (
                <>
                  <Link href={`/demandes/${row.id}`}>
                    <IconButton aria-label="modifier" className={classes.icon} color="primary">
                      <DescriptionIcon />
                    </IconButton>
                  </Link>
                </>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ) : (
    <EmptyArray type="à traiter" />
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
};

TabMyRequestUntreated.defaultProps = {
  request: [],
};
