import React, { useState } from 'react';
import { Grid, TextField, Button, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';

export default function FlightSearch({ onSearch }) {
  const [origin, setOrigin] = useState('DEL');
  const [destination, setDestination] = useState('BOM');
  const [date, setDate] = useState(null);
  const [classType, setClassType] = useState('Economy');

  return (
    <Grid container spacing={2}>
      {/* form fields for origin, destination, date, classType */}
      <Grid item xs={2}><TextField label="From" value={origin} onChange={e => setOrigin(e.target.value)} /></Grid>
      <Grid item xs={2}><TextField label="To" value={destination} onChange={e => setDestination(e.target.value)} /></Grid>
      <Grid item xs={3}><DatePicker label="Date" value={date} onChange={setDate} renderInput={params => <TextField {...params} />} /></Grid>
      <Grid item xs={2}>
        <FormControl fullWidth>
          <InputLabel>Class</InputLabel>
          <Select value={classType} onChange={e => setClassType(e.target.value)}>
            <MenuItem value="Economy">Economy</MenuItem>
            <MenuItem value="Premium Economy">Premium Economy</MenuItem>
            <MenuItem value="Business">Business</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={3}><Button variant="contained" onClick={() => onSearch({ origin, destination, date, classType })}>Search</Button></Grid>
    </Grid>
  );
}
