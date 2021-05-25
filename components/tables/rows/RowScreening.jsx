import React from 'react';
import TableCell from '@material-ui/core/TableCell';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import ActionCell from '../cells/ActionCell';
import TableRow from '@material-ui/core/TableRow';
import { IconButton, makeStyles } from '@material-ui/core';
import { AttachFile, CheckCircle, Error } from '@material-ui/icons';
import { WORKFLOW_BEHAVIOR } from '../../../utils/constants/enums';

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

const useStyles = makeStyles((theme) => ({
    info: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    },
    iconStatus: {
        marginRight: '5px'
    },
    iconSuccess: {
        color: theme.palette.success.main
    },
    iconWarning: {
        color: theme.palette.warning.main
    }
}));

function RowScreening({ columns, choices, row, treated }) {
    const classes = useStyles();
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
                            <TableCell key={column.id}>
                                {row.isScreened ===
                                WORKFLOW_BEHAVIOR.ADVISEMENT.RESPONSE.positive ? (
                                    <div className={classes.info}>
                                        <CheckCircle
                                            title="acceptedIcon"
                                            fontSize="small"
                                            className={`${classes.iconStatus} ${classes.iconSuccess}`}
                                        />
                                        RAS
                                    </div>
                                ) : (
                                    <div className={classes.info}>
                                        <Error
                                            title="canceledIcon"
                                            fontSize="small"
                                            className={`${classes.iconStatus} ${classes.iconWarning}`}
                                        />
                                        RES
                                    </div>
                                )}
                            </TableCell>
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
