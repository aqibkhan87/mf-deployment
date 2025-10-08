import { Grid, Button } from '@mui/material';

export default function SeatSelection({ seats, onSelect }) {
  // Render seat grid based on props
  return (
    <Grid container spacing={1}>
      {seats.map(seat => (
        <Grid item key={seat.number}>
          <Button
            variant={seat.isAvailable ? "outlined" : "contained"}
            color={seat.isAvailable ? "success" : "default"}
            onClick={() => seat.isAvailable && onSelect(seat.number)}
          >
            {seat.number}
          </Button>
        </Grid>
      ))}
    </Grid>
  );
}
