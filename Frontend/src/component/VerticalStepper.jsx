import { Stepper, Step, StepLabel, Box, Typography } from '@mui/material';

const steps = [
  { label: 'Pending'},
  {label:  'Order Placed'},{ label: 'Order Confirmed'},{label: 'Out of Delivery' },{label: 'Delivered'}
];

export default function VerticalStepper({ currentStatus }) {
  const statusMap = {
    'Pending':0,
    'Order Placed': 1,
    'Order Confirmed': 2,
    'Out of Delivery': 3,
    'Delivered': 4,
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
