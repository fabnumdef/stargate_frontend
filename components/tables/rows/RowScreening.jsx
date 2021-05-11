import React from 'react';
import TableCell from '@material-ui/core/TableCell';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import ActionCell from '../cells/ActionCell';
import TableRow from '@material-ui/core/TableRow';
import { IconButton } from '@material-ui/core';
import { AttachFile } from '@material-ui/icons';

const StyledRow = withStyles((theme) => ({
    root: {
        border: `19px solid ${theme.palette.background.table}`
    },
    hover: {
        '&:hover': {
            boxShadow: `inset -1px -2px 0px ${theme.palette.primary.dark}
            , inset 1px 1px 0px ${theme.palette.primary.dark}`,
            backgroundColor: `${theme.palette.common.white} !important`
        }
    }
}))(TableRow);

function RowScreening({ columns, choices, row, treated }) {
    return (
        <StyledRow hover key={row.id}>
            {columns.map((column) => {
                const value = row[column.id];
                switch (column.id) {
                    case 'lastname':
                        return (
                            <TableCell key={column.id}>
                                <>
                                    {row.vAttachedFile && (
                                        <a href={row.link} download>
                                            <IconButton aria-label="AttachFileIcon">
                                                <AttachFile />
                                            </IconButton>
                                        </a>
                                    )}
                                    {column.format && typeof value === 'number'
                                        ? column.format(value)
                                        : value}
                                </>
                            </TableCell>
                        );
                    case 'nationality':
                        return (
                            <TableCell key={column.id}>
                                <>{typeof value === 'string' && value !== 'Française' && value}</>
                            </TableCell>
                        );
                    case 'action':
                        return treated ? (
                            <TableCell key={column.id}>{row.isScreened}</TableCell>
                        ) : (
                            <ActionCell
                                key={column.id}
                                decision={{
                                    request: { id: row.requestId },
                                    id: row.id
                                }}
                                choices={choices}
                            />
                        );

                    default:
                        return (
                            <TableCell key={column.id}>
                                {column.format && typeof value === 'number'
                                    ? column.format(value)
                                    : value}
                            </TableCell>
                        );
                }
            })}
        </StyledRow>
    );
}

export default React.memo(RowScreening);

RowScreening.propTypes = {
    treated: PropTypes.bool,
    columns: PropTypes.arrayOf(PropTypes.object).isRequired,
    row: PropTypes.object.isRequired,
    choices: ActionCell.propTypes.choices
};

RowScreening.defaultProps = {
    treated: false
};
