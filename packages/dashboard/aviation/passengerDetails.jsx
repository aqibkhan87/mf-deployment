import { Grid, TextField, MenuItem, Select, FormControl, InputLabel } from '@mui/material';

export default function PassengerDetails({ onSubmit }) {
  // Add form state and layout for passenger info fields
  return (
    <form>
      <Grid container spacing={2}>
        <Grid item xs={3}>
          <FormControl fullWidth>
            <InputLabel>Title</InputLabel>
            <Select label="Title">
              <MenuItem value="Mr">Mr.</MenuItem>
              <MenuItem value="Ms">Ms.</MenuItem>
              {/* ... */}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={4}><TextField label="First Name" required /></Grid>
        <Grid item xs={4}><TextField label="Surname" required /></Grid>
        <Grid item xs={4}><TextField label="DOB" placeholder="DD/MM/YYYY" required /></Grid>
        {/* Frequent flyer fields */}
      </Grid>
    </form>
  );
}
