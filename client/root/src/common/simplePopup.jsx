import * as React from "react";
import Popover from "@mui/material/Popover";
import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from '@mui/material';

export default function SimplePopover(props) {
    const { anchorEl, open, onClose } = props;

    return (
        <Popover
            open={open}
            anchorEl={anchorEl}
            onClose={onClose}
            anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
            }}
            transformOrigin={{
                vertical: "top",
                horizontal: "left",
            }}
            PaperProps={{
                sx: {
                    p: 2,
                    borderRadius: 2,
                    boxShadow: 3,
                },
            }}
        >
            <>
                <IconButton
                    onClick={onClose}
                    color="primary"
                    sx={{
                        position: "absolute",
                        right: "20px",
                    }}
                >
                    <CloseIcon />
                </IconButton>
                {props?.children}
            </>
        </Popover>
    );
}