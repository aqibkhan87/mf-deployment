import React, { useState, useEffect } from "react";
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  Divider,
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
import { statesOfIndia } from "../../../checkout/src/utils/constants";
import { saveNewAddress } from "../apis/address";

const initialFields = {
  name: "",
  mobile: "",
  pincode: "",
  locality: "",
  address: "",
  city: "",
  state: "",
  landmark: "",
  alternatePhone: "",
  addressType: "home",
};

const AddressForm = () => {
  const { setNewAddress } = useAuthStore();
  const [fields, setFields] = useState(initialFields);
  const [touched, setTouched] = useState({});
  const [saving, setSaving] = useState(true);
  const [openAddressForm, setOpenAddressForm] = useState(false);

  useEffect(() => {
    if (
      fields.name?.length &&
      fields.mobile?.length &&
      fields.pincode?.length &&
      fields.locality?.length &&
      fields.address?.length &&
      fields.city?.length
    )
      setSaving(false);
    else setSaving(true);
  }, [fields]);

  useEffect(() => {
    const handler = (event) => {
      const payload = event.detail;
      setOpenAddressForm(payload.openAddressForm);
    };
    window.addEventListener("openAddressForm", handler);
    return () => {
      window.removeEventListener("openAddressForm", handler);
    };
  }, []);

  const requiredFields = [
    "name",
    "mobile",
    "pincode",
    "locality",
    "address",
    "city",
  ];

  // Validation
  const errors = {
    name: !fields.name,
    mobile: !fields.mobile || fields.mobile.length !== 10,
    pincode: !fields.pincode || fields.pincode.length !== 6,
    locality: !fields.locality,
    address: !fields.address,
    city: !fields.city,
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
      const newAddressRes = await saveNewAddress(fields);
      if (newAddressRes?.status === 200 && newAddressRes?.address) {
        setNewAddress(newAddressRes?.address);
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
        <DialogTitle>Add New Address</DialogTitle>
        <DialogContent sx={{ mt: 1 }}>
          <Grid container spacing={2} justifyContent="center" sx={{ pl: 2 }}>
            <Paper elevation={0} sx={{ p: 2 }}>
              <form onSubmit={handleSubmit}>
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
                      label="10-digit mobile number"
                      name="mobile"
                      value={fields.mobile}
                      error={errors.mobile && touched.mobile}
                      helperText={
                        errors.mobile && touched.mobile
                          ? "Please fill out this field."
                          : ""
                      }
                      onBlur={() => handleBlur("mobile")}
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
                      label="Address (Area and Street)"
                      name="address"
                      value={fields.address}
                      error={errors.address && touched.address}
                      helperText={
                        errors.address && touched.address
                          ? "Please fill out this field."
                          : ""
                      }
                      onBlur={() => handleBlur("address")}
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
                    >
                      SAVE AND DELIVER HERE
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<CancelIcon />}
                    >
                      CANCEL
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Paper>
          </Grid>
        </DialogContent>
      </Dialog>
    );
  }
  return null;
};

export default AddressForm;
