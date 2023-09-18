import React from "react";
import { Button } from "@mui/material";

interface CustomButtonProps {
  buttonText: string;
  onClick: () => void;
  buttonColor?: "primary" | "secondary" | "inherit" | "success" | "error" | "info" | "warning";
}

const SettingButton = ({ buttonText, onClick, buttonColor = "primary" }: CustomButtonProps) => {
  return (
    <Button  variant="contained" color={buttonColor} onClick={onClick}>
      {buttonText}
    </Button>
  );
};

export default SettingButton;
