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
import { Done } from "../../../assets/icons/Done";
import "../../../styles/user-management-styles/UserSuccess.css"



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
    >
        <div className="done-icon">
        <Done/>
        </div>
       
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
        User Created Succesfully
      </DialogTitle>
      <DialogContent className="delete-dialog-content">
        <Typography >Would you like to map roles to the user? You can also choose to skip this section for now and complete it later</Typography>
       
       
      </DialogContent>
      <DialogActions className="dialog-action">
        <Button
          className="delete-button"
          onClick={onCancel}
          color="primary"
          style={{ textTransform: "none" }}
        >
          I'll do it later
        </Button>
        <Button
          className="delete-cancel"
          onClick={onConfirm}
          color="primary"
          style={{ textTransform: "none" }}
        >
         Go to Role mapping
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;
