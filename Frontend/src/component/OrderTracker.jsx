import { Stepper, Step, StepLabel } from "@mui/material";

const steps = ["Login", "Delivery Address", "Order Summary", "Payment", "Placed", "Confirm Order"];

export default function OrderTracker({ activeStep }) {
  return (
    <Stepper activeStep={activeStep} alternativeLabel>
      {steps.map((label) => (
        <Step key={label}>
          <StepLabel>{label}</StepLabel>
        </Step>
      ))}
    </Stepper>
  );
}
