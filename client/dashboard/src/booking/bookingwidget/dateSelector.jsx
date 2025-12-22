import React from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";
import { TextField } from "@mui/material";

const DateSelector = ({ label, value, onChange, minDate }) => {
  return (
    <StaticDatePicker
      displayStaticWrapperAs="desktop"
      value={value ? dayjs(value) : null}
      minDate={minDate ? dayjs(minDate) : dayjs()}
      onChange={(newValue) => {
        if (!newValue) return;
        onChange(newValue.format("YYYY-MM-DD"));
      }}
      renderInput={(params) => <TextField {...params} />}
    />
  );
};

export default DateSelector;
