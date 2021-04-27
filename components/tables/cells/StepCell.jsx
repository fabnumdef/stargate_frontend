import React from 'react';

import PropTypes from 'prop-types';
import TableCell from '@material-ui/core/TableCell';
import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import WarningIcon from '@material-ui/icons/Warning';

import { ROLES, WORKFLOW_BEHAVIOR } from '../../../utils/constants/enums';

const useStyles = makeStyles((theme) => ({
    success: {
        color: theme.palette.success.main
    },
    error: {
        color: theme.palette.error.main
    },
    warning: {
        color: theme.palette.warning.main
    }
}));

export default function ReasonCell({ steps, ...others }) {
    const classes = useStyles();

    function getIcon(step) {
        switch (step.state.value) {
            case WORKFLOW_BEHAVIOR[step.behavior].RESPONSE.positive:
                return CheckCircleIcon;
            case WORKFLOW_BEHAVIOR.ADVISEMENT.RESPONSE.negative:
                return WarningIcon;
            case WORKFLOW_BEHAVIOR[step.behavior].RESPONSE.negative:
                return ErrorIcon;
        }
    }

    function getIconProps(step) {
        switch (step.state.value) {
            case WORKFLOW_BEHAVIOR[step.behavior].RESPONSE.positive:
                return {
                    classes: { root: classes.success },
                    title: 'successIcon'
                };
            case WORKFLOW_BEHAVIOR.ADVISEMENT.RESPONSE.negative:
                return {
                    classes: { root: classes.warning },
                    title: 'warningIcon'
                };
            case WORKFLOW_BEHAVIOR[step.behavior].RESPONSE.negative:
                return {
                    classes: { root: classes.error },
                    title: 'errorIcon'
                };
        }
    }

    return (
        <TableCell {...others}>
            <Stepper alternativeLabel activeStep={-1}>
                {steps.map((step) => (
                    <Step key={step.role}>
                        <StepLabel
                            StepIconComponent={getIcon(step)}
                            StepIconProps={getIconProps(step)}>
                            {ROLES[step.role].shortLabel}
                        </StepLabel>
                    </Step>
                ))}
            </Stepper>
        </TableCell>
    );
}

ReasonCell.propTypes = {
    steps: PropTypes.object.isRequired
};
