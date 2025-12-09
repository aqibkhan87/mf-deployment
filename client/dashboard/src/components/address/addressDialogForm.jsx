import React from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button
} from "@mui/material";

const AddressFormDialog = ({ open, setOpen, data, setData, onSave }) => {

    const fields = [
        { label: "Name", key: "name" },
        { label: "Address Line 1", key: "line1" },
        { label: "Address Line 2", key: "line2" },
        { label: "City", key: "city" },
        { label: "State", key: "state" },
        { label: "Country", key: "country" },
        { label: "Pincode", key: "pincode" }
    ];

    return (
        <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
            <DialogTitle>{data?._id ? "Edit Address" : "Add Address"}</DialogTitle>

            <DialogContent>
                {fields?.map((f) => (
                    <TextField
                        key={f.key}
                        label={f.label}
                        fullWidth
                        margin="dense"
                        value={data?.[f.key] || ""}
                        onChange={(e) =>
                            setData({ ...data, [f.key]: e.target.value })
                        }
                    />
                ))}
            </DialogContent>

            <DialogActions>
                <Button onClick={() => setOpen(false)}>Cancel</Button>
                <Button onClick={onSave} variant="contained">
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default AddressFormDialog;