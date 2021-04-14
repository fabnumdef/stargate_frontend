import React, { useEffect, useState } from 'react';

import PropTypes from 'prop-types';
import TableCell from '@material-ui/core/TableCell';
import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';

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

    const [activeStep, setActiveStep] = useState(0);

    useEffect(() => {
        let activeIndex = 0;
        while (steps[activeIndex].isOK !== null) {
            activeIndex++;
        }
        setActiveStep(activeIndex);
    }, [steps]);

    return (
        <TableCell {...others}>
            <Stepper alternativeLabel activeStep={activeStep}>
                {steps.map((step) => (
                    <Step key={step.role}>
                        <StepLabel
                            error={
                                step.value === WORKFLOW_BEHAVIOR[step.behavior].RESPONSE.negative ||
                                WORKFLOW_BEHAVIOR[step.behavior].RESPONSE.externally
                            }
                            StepIconProps={(() => {
                                switch (step.value) {
                                    case WORKFLOW_BEHAVIOR[step.behavior].RESPONSE.positive:
                                        return { className: classes.success };
                                    case WORKFLOW_BEHAVIOR[step.behavior].RESPONSE.negative:
                                        return { className: classes.error };
                                    case WORKFLOW_BEHAVIOR[step.behavior].RESPONSE.externally:
                                        return { className: classes.warning };
                                }
                            })()}>
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
