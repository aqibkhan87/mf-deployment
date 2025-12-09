import React, { useEffect, useState } from "react";
import {
    Box,
    Card,
    CardContent,
    Typography,
    Button,
} from "@mui/material";
import { useHistory } from "react-router-dom";
import { useAuthStore } from "store/authStore";
import AddressFormDialog from "./addressDialogForm.jsx";
import { addNewAddress, getAllAddresses, editAddress, markDefaultAddress } from "../../apis/address";

const brown = "#7B4A12";

const AddressList = () => {
    const history = useHistory();
    const { addresses } = useAuthStore();
    const [open, setOpen] = useState(false);
    const [current, setCurrent] = useState(null);

    useEffect(() => {
        getAllAddresses();
    }, []);

    const handleEdit = (address) => {
        setCurrent(address);
        setOpen(true);
    };

    const handleMarkDefault = async (address) => {
        await markDefaultAddress(address?._id);
    };

    const handleSave = async () => {
        if (current._id) {
            await editAddress(current);
        } else {
            await addNewAddress(current);
        }
        setOpen(false);
    };

    return (
        <Box sx={{
            overflowX: "auto",
            gap: 2,
            pb: 2
        }}>
            <Box
                sx={{
                    display: "flex",
                    flexWrap: "nowrap",
                    overflowX: "auto",
                    gap: 2,
                    pb: 2
                }}
            >
                {addresses.map((addr) => (
                    <Card
                        key={addr._id}
                        sx={{
                            width: 300,
                            minWidth: 300,
                            border: `1px solid ${brown}`,
                            background: "#fff"
                        }}
                    >
                        <CardContent>
                            <Typography fontWeight={600}>{addr.name}</Typography>

                            <Typography fontWeight={400} color="black">
                                {addr.line1}, {addr.line2}, {addr.city} - {addr.pincode}
                            </Typography>

                            <Typography color="text.secondary">
                                {addr.state}, {addr.country}
                            </Typography>

                            {addr?.isDefault ?
                                <></> :
                                <Button
                                    onClick={() => handleMarkDefault(addr)}
                                    sx={{ mt: 1, color: brown, textTransform: "none" }}
                                >
                                    Mark as Default
                                </Button>}
                            <Button
                                onClick={() => handleEdit(addr)}
                                sx={{ mt: 1, color: brown, textTransform: "none" }}
                            >
                                Edit Address
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </Box>

            {/* Add New Address Button */}
            <Button
                variant="outlined"
                onClick={() => {
                    setCurrent({});
                    setOpen(true);
                }}
                sx={{
                    borderColor: brown,
                    color: brown,
                    textTransform: "none",
                }}
            >
                Add New Address
            </Button>

            {/* Dialog */}
            <AddressFormDialog
                open={open}
                setOpen={setOpen}
                data={current}
                setData={setCurrent}
                onSave={handleSave}
            />
        </Box>
    );
};

export default AddressList;
