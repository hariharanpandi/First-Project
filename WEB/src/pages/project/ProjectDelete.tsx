import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";
import "../../styles/project-styles/project.css";
import { DelNeg, Delete } from "../../styles/setting-styles/AccountStyles";

interface ConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  onCancel: () => void;
  title: string;
  message: string;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  open,
  onClose,
  onConfirm,
  onCancel,
  title,
  message,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      style={{
        // position: "absolute",
        // top: 200,
        // bottom: 0,
        left: 300,
        // right: 0,
        // height: "42%",
        width: "62%",
        padding: "3%",
      }}
    >
      <DialogTitle
        style={{
          color: "white",
          fontFamily: "Inter",
          fontWeight: 500,
          fontSize: "17px",
        }}
      >
        {title}
      </DialogTitle>
      <DialogContent className="delete-dialog-content">
        <Typography>{message}</Typography>
      </DialogContent>
      <DialogActions className="dialog-action">
        <Button
          className="delete-button"
          onClick={onConfirm}
          color="primary"
          style={{ textTransform: "none" }}
        >
          Yes,Delete
        </Button>
        <Button
          className="delete-cancel"
          onClick={onCancel}
          color="primary"
          style={{ textTransform: "none" }}
        >
          No,I'm Staying
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;
