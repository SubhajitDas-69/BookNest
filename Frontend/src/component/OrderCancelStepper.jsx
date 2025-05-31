import { Stepper, Step, StepLabel, Box, Typography } from '@mui/material';

const steps = [
  { label: 'Order Confirmed'},{label: 'Cancelled'}
];
export default function OrderCancelStepper({ currentStatus }){
     const statusMap = {
    'Order Confirmed': 0,
    'Cancelled': 1,
  };
  const activeStep = statusMap[currentStatus] ?? 0;

  return (
    <Box sx={{ maxWidth: 300 }}>
      <Stepper orientation="vertical" activeStep={activeStep}>
        {steps.map((step, index) => (
          <Step key={step.label} completed={index <= activeStep}>
            <StepLabel>
              <Typography fontWeight="bold">{step.label}</Typography>
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
}

