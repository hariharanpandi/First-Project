import React from "react";
import { Grid, Snackbar, SnackbarProps } from "@mui/material";
import { Success } from "../assets/icons/Success";
import { Error } from "../assets/icons/Error";
import ".././styles/common-styles/SnackBar.css";
import { SnackbarOrigin } from "@mui/material/Snackbar";

interface Props extends SnackbarProps {
  message: string;
  severity: string;
}
const anchorOrigin: SnackbarOrigin = {
  vertical: "bottom",
  horizontal: "left",
};

const MySnackbar: React.FC<Props> = ({ message, severity, ...props }) => {
  return (
    <Snackbar {...props} autoHideDuration={2000} anchorOrigin={anchorOrigin}>
      <div className="snack-box">
        <div className="snack-error">
          {" "}
          {severity === "success" ? <Success /> : <Error />}
        </div>
        <div className="snack-msg"> {message}</div>
      </div>
    </Snackbar>
  );
};

export default MySnackbar;
