import React from 'react';
import { Button } from "@mui/material";

interface CustomButtonProps {
    type?: "button" | "submit" | "reset"; // Changed to proper type definition
    children: React.ReactNode;
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    fullWidth?: boolean;
    sx?: object;
}

export default function CustomButton({ 
    type = "button", 
    children, 
    onClick,
    fullWidth = true,
    sx = {}
}: CustomButtonProps) {
    const buttonStyle = {
        mt: 2,
        mb: 2,
        background: "#009688",
        color: "#fff",
        fontWeight: 600,
        padding: "10px 0",
        borderRadius: 2,
        '&:hover': {
            background: "#00897b"
        },
        ...sx
    };

    return (
        <Button
            type={type}
            fullWidth={fullWidth}
            variant="contained"
            sx={buttonStyle}
            onClick={onClick}
        >
            {children}
        </Button>
    );
}