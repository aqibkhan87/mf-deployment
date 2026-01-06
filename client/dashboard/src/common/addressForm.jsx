import React, { useState, useEffect } from "react";
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  Paper,
  Grid,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import { useAuthStore } from "store/authStore";
import { statesOfIndia, countriesList } from "../utils/constants";
import { addNewAddress, editAddress } from "../apis/address";

const initialFields = {
  name: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  country: "",
  pincode: "",
};

const AddressForm = () => {
  const { setAddress, user } = useAuthStore();
  const [fields, setFields] = useState(initialFields);
  const [current, setCurrent] = useState(null);
  const [touched, setTouched] = useState({});
  const [saving, setSaving] = useState(true);
  const [openAddressForm, setOpenAddressForm] = useState(false);

  useEffect(() => {
    if (
      fields.name?.length &&
      fields.line1?.length &&
      fields.line2?.length &&
      fields.city?.length &&
      fields.state?.length &&
      fields.country?.length &&
      fields.pincode?.length &&
      user?.email
    )
      setSaving(false);
    else setSaving(true);
  }, [fields]);

  useEffect(() => {
    const handler = (event) => {
      const payload = event.detail;
      setOpenAddressForm(payload.openAddressForm);
      if (payload.address) setCurrent(payload.address)
    };
    window.addEventListener("openAddressForm", handler);
    return () => {
      window.removeEventListener("openAddressForm", handler);
    };
  }, []);

  const requiredFields = [
    "name",
    "line1",
    "line2",
    "city",
    "state",
    "country",
    "pincode",
  ];

  const errors = {
    name: !fields.name,
    line1: !fields.line1,
    line2: !fields.line2,
    city: !fields.city,
    state: !fields.state,
    country: !fields.country,
    pincode: !fields.pincode,
  };

  const handleBlur = (field) => setTouched({ ...touched, [field]: true });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFields({ ...fields, [name]: value });
  };

  const handleAddressTypeChange = (e) => {
    setFields({ ...fields, addressType: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched(
      requiredFields.reduce((acc, key) => ({ ...acc, [key]: true }), {})
    );
    if (Object.values(errors).every((err) => !err)) {
      setSaving(true);
      setTimeout(() => setSaving(false), 1200);
      setOpenAddressForm(false);
      let newAddressRes = {};
      if (current?._id) {
        newAddressRes = await editAddress(fields);
      } else {
        newAddressRes = await addNewAddress(fields);
      }
      if (newAddressRes?.status === 200 && newAddressRes?.data) {
        setAddress(newAddressRes?.data);
        onClose();
      }
    }
  };

  const onClose = () => {
    setOpenAddressForm(false);
  };

  if (openAddressForm) {
    return (
      <Dialog open={openAddressForm} onClose={onClose} sx={{ p: 2 }}>
        <DialogTitle>{current ? "Edit Addres" : "Add Address"}</DialogTitle>
        <DialogContent sx={{ mt: 1 }}>
          <Paper elevation={0} sx={{ p: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Name"
                  name="name"
                  value={fields.name}
                  error={errors.name && touched.name}
                  helperText={
                    errors.name && touched.name
                      ? "Please fill out this field."
                      : ""
                  }
                  onBlur={() => handleBlur("name")}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Locality"
                  name="locality"
                  value={fields.locality}
                  error={errors.locality && touched.locality}
                  helperText={
                    errors.locality && touched.locality
                      ? "Please fill out this field."
                      : ""
                  }
                  onBlur={() => handleBlur("locality")}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="(Area and Street)"
                  name="line1"
                  value={fields.line1}
                  error={errors.line1 && touched.line1}
                  helperText={
                    errors.line1 && touched.line1
                      ? "Please fill out this field."
                      : ""
                  }
                  onBlur={() => handleBlur("line1")}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="(Area and Street)"
                  name="line2"
                  value={fields.line2}
                  error={errors.line2 && touched.line2}
                  helperText={
                    errors.line2 && touched.line2
                      ? "Please fill out this field."
                      : ""
                  }
                  onBlur={() => handleBlur("line2")}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Pincode"
                  name="pincode"
                  value={fields.pincode}
                  error={errors.pincode && touched.pincode}
                  helperText={
                    errors.pincode && touched.pincode
                      ? "Please fill out this field."
                      : ""
                  }
                  onBlur={() => handleBlur("pincode")}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="City/District/Town"
                  name="city"
                  value={fields.city}
                  error={errors.city && touched.city}
                  helperText={
                    errors.city && touched.city
                      ? "Please fill out this field."
                      : ""
                  }
                  onBlur={() => handleBlur("city")}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>State</InputLabel>
                  <Select
                    label="State"
                    name="state"
                    value={fields.state}
                    onChange={handleChange}
                  >
                    {statesOfIndia.map((s) => (
                      <MenuItem key={s} value={s}>
                        {s}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Country</InputLabel>
                  <Select
                    label="Country"
                    name="country"
                    value={fields.country}
                    onChange={handleChange}
                  >
                    {countriesList?.map((c) => (
                      <MenuItem key={c.name} value={c.name}>
                        {c.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Landmark (Optional)"
                  name="landmark"
                  value={fields.landmark}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Alternate Phone (Optional)"
                  name="alternatePhone"
                  value={fields.alternatePhone}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl>
                  <RadioGroup
                    row
                    value={fields.addressType}
                    onChange={handleAddressTypeChange}
                  >
                    <FormControlLabel
                      value="home"
                      control={<Radio />}
                      label="Home (All day delivery)"
                    />
                    <FormControlLabel
                      value="work"
                      control={<Radio />}
                      label="Work (Delivery between 10 AM - 5 PM)"
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>
            </Grid>
            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid item>
                <Button
                  type="submit"
                  variant="contained"
                  color="warning"
                  disabled={saving}
                  onClick={handleSubmit}
                >
                  Save And Deliver Here
                </Button>
              </Grid>
              <Grid item>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<CancelIcon />}
                  onClick={onClose}
                >
                  Cancel
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </DialogContent>
      </Dialog>
    );
  }
  return null;
};

export default AddressForm;
