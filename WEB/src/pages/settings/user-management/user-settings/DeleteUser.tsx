import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";
// import "../../../styles/project-styles/Project.css"

import "../../../../styles/user-management-styles/UserSuccess.css"



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
        position: "absolute",
        top: 200,
        bottom: 0,
        left: 200,
        right: 0,
        height: "40%",
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
          display:"flex",
          justifyContent:"center"
        }}
      >
       Delete User
      </DialogTitle>
      <DialogContent className="delete-dialog-content">
        <Typography >Are you sure you want to delete the user? This action cannot be undone</Typography>
        
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
       No,Keep
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;
