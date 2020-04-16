import React, { useEffect } from 'react';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import PlaceIcon from '@material-ui/icons/Place';
import FlagIcon from '@material-ui/icons/Flag';
import ScheduleIcon from '@material-ui/icons/Schedule';
import StepConnector from '@material-ui/core/StepConnector';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
// eslint-disable-next-line import/no-extraneous-dependencies
import clsx from 'clsx';

const ColorlibConnector = withStyles({
  alternativeLabel: {
    top: 22,
  },
  active: {
    '& $line': {
      backgroundColor: '#007aff',
      transition: 'all .6s ease',
      width: '100%',
    },
  },
  completed: {
    '& $line': {
      backgroundColor: '#007aff',
      width: '100%',
    },
  },
  line: {
    width: 0,
    height: 3,
    border: 0,
    backgroundColor: '#eaeaf0',
    borderRadius: 1,
  },
})(StepConnector);

function getSteps() {
  return ['Création', 'Unite', 'Criblage', 'Officier Sécurité', 'Burreau accées', 'Visite prévue'];
}

const useColorlibStepIconStyles = makeStyles({
  root: {
    zIndex: 1,
    color: '#ccc',
    display: 'flex',
    borderRadius: '50%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  active: {
    color: '#220a82',
  },
  completed: {
    color: '#220a82',
  },
});

function ColorlibStepIcon(props) {
  const classes = useColorlibStepIconStyles();
  const { active, completed, icon } = props;

  const icons = {
    1: <PlaceIcon />,
    2: <ScheduleIcon />,
    3: <ScheduleIcon />,
    4: <ScheduleIcon />,
    5: <ScheduleIcon />,
    6: <FlagIcon />,
  };

  return (
    <div>
      {React.cloneElement(icons[String(icon)], {
        className: clsx(classes.root, {
          [classes.active]: active,
          [classes.completed]: completed,
        }),
      })}
    </div>
  );
}

ColorlibStepIcon.propTypes = {
  active: PropTypes.bool.isRequired,
  completed: PropTypes.bool.isRequired,
  icon: PropTypes.node.isRequired,
};

export default function HorizontalNonLinearStepper() {
  const [activeStep, setActiveStep] = React.useState(0);

  const steps = getSteps();

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  useEffect(() => {
    setTimeout(() => {
      if (steps[activeStep] !== 'Unite') handleNext(); // count is 0 here
    }, 2000); // Update count to be 5 after timeout is scheduled
  }, [activeStep, steps]);

  return (
    <div>
      <Stepper alternativeLabel activeStep={activeStep} connector={<ColorlibConnector />}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel StepIconComponent={ColorlibStepIcon}>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
    </div>
  );
}
