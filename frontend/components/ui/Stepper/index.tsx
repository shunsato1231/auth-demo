import React from 'react';
import { styled } from '@mui/material/styles';
import {
  Step,
  StepConnector,
  stepConnectorClasses,
  StepIconProps,
  StepLabel,
  stepLabelClasses,
  svgIconClasses,
  Stepper as MuiStepper,
} from '@mui/material';

const contentStyle = {
  position: 'absolute',
  display: 'block',
  content: '""',
  top: 0,
  left: 0,
};

const Connector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 16,
    left: 'calc(-50% + 35px)',
    right: 'calc(50% + 35px)',
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      ['&:before']: {
        width: '100%',
      },
      ['&:after']: {
        width: '0%',
      },
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      ['&:before']: {
        width: '100%',
      },
      ['&:after']: {
        width: '100%',
      },
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    backgroundColor: theme.palette.grey[300],
    border: 0,
    height: 4,
    position: 'relative',
    zIndex: 1,
    ['&:before']: {
      ...contentStyle,
      backgroundColor: theme.palette.primary.light,
      height: 4,
      width: '0%',
      zIndex: 2,
      transition: 'width 0.4s ease 0.4s',
    },
    ['&:after']: {
      ...contentStyle,
      background: theme.palette.primary.main,
      height: 4,
      width: '0%',
      zIndex: 3,
      transition: 'width 0.2s ease 0s',
    },
  },
}));

const IconRoot = styled('div')<{
  ownerState: { completed?: boolean; active?: boolean };
}>(({ theme, ownerState }) => ({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 34,
  height: 34,
  borderRadius: '50%',
  borderStyle: 'solid',
  borderWidth: 1,
  borderColor: theme.palette.grey[300],
  zIndex: 1,
  // transition: 'width,height 0.5s ease 0.8s',
  ['&:before']: {
    ...contentStyle,
    width: 0,
    height: 0,
    borderRadius: '50%',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 2,
  },
  [`.${svgIconClasses.root}`]: {
    zIndex: 3,
    fontSize: 20,
    ['path']: {
      color: theme.palette.grey[400],
    },
  },
  ...(ownerState.active && {
    borderColor: theme.palette.primary.main,
    [`.${svgIconClasses.root} path`]: {
      color: '#fff',
    },
    '&:before': {
      ...contentStyle,
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      borderRadius: '50%',
      backgroundColor: theme.palette.primary.light,
      width: 26,
      height: 26,
    },
  }),
  ...(ownerState.completed && {
    borderColor: theme.palette.primary.main,
    [`.${svgIconClasses.root} path`]: {
      color: '#fff',
    },
    '&:before': {
      ...contentStyle,
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      borderRadius: '50%',
      backgroundColor: theme.palette.primary.main,
      width: 34,
      height: 34,
    },
  }),
}));

const Label = styled(StepLabel)(({ theme }) => ({
  [`&.${stepLabelClasses.root}`]: {
    [`.${stepLabelClasses.label}`]: {
      fontSize: 12,
      marginTop: 8,
      color: theme.palette.grey[400],
    },
    [`.${stepLabelClasses.completed}`]: {
      color: theme.palette.primary.main,
    },
    [`.${stepLabelClasses.active}`]: {
      color: theme.palette.primary.main,
      fontWeight: 600,
    },
  },
}));

export interface StepperProps {
  activeStep: number;
  steps: string[];
  icons: { [index: string]: React.ReactElement };
}

export const Stepper: React.FC<StepperProps> = ({
  activeStep,
  steps,
  icons,
}): JSX.Element => {
  const Icon: React.FC<StepIconProps> = ({
    active,
    completed,
    className,
    icon,
  }): JSX.Element => {
    return (
      <IconRoot ownerState={{ completed, active }} className={className}>
        {icons[String(icon)]}
      </IconRoot>
    );
  };
  return (
    <MuiStepper
      alternativeLabel
      activeStep={activeStep}
      connector={<Connector />}>
      {steps.map((label) => (
        <Step key={label}>
          <Label StepIconComponent={Icon}>{label}</Label>
        </Step>
      ))}
    </MuiStepper>
  );
};
