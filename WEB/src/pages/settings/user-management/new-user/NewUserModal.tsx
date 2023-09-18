import {
  Modal,
  TextField,
  Button,
  Box,
  FormLabel,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import "../../../../styles/project-styles/ProjectModal.css";
import ClearIcon from "@material-ui/icons/Clear";
import { regex } from "../../../../helper/RegEx";
import {
  createUserRequest,
  createUserReset,
} from "../../../../redux/slice/user-management-slice/CreateUserSlice";
import { useNavigate } from "react-router";
import MySnackbar from "../../../../helper/SnackBar";

import { useDispatch, useSelector } from "react-redux";

import { useEffect, useState } from "react";
import ConfirmationDialog from "../UserSuccesModal";
import { CustomBackdrop } from "../../../../helper/backDrop";
import { setTimeout } from "timers/promises";
import PreventSpaceAtFirst from "../../../../components/PrventSpaceAtFirst";

interface CommonModalProps {
  modalOpen: boolean;
  handleClose: () => void;
}

const validationSchema = Yup.object().shape({
  name: Yup.string()
    // .transform((value) => value.trim())
    .required("Full Name is required")
    .min(3, "Full Name must be at least 3 characters")
    .max(32, "Full Name must be no longer than 32 characters")
    .matches(/^[a-zA-Z\s]*$/, "Full Name must contain only alphabetic characters")
    .test({
      name: "no-whitespace",
      message: "Full Name cannot be empty or contain only spaces",
      test: (value: string | undefined) => {
        if (!value) {
          return false;
        }
        return value.trim().length > 0;
      },
    }),

  email: Yup.string()
    .email("Invalid Email")
    .matches(regex.email, "Invalid Email")
    .required("Email is Required"),
});

const UserModal = ({ modalOpen, handleClose }: CommonModalProps) => {
  const dispatch = useDispatch();

  /* user modal*/
  const [userSuccess, setUserSuccess] = useState(false);
  const [isProjectCreated, setIsProjectCreated] = useState(false);
  const [projectData, setProjectData] = useState([]);
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [isUpdate, setIsUpdate] = useState<any>("");
  const [formValues, setFormValues] = useState<any>("");
  const navigate = useNavigate();
  const [snackOpen, setSnackOpen] = useState(false);
  const [severity, setSeverity] = useState("");
  const [message, setMessage] = useState("");

  const { editSuccess } = useSelector((state: any) => state.editProject);
  const { createSuccess, error, createLoading } = useSelector(
    (state: any) => state.createUser
  );

  useEffect(() => {
    if(createSuccess) {
      formik.resetForm();
      setUserSuccess(true);
      handleClose();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createSuccess])

  const formik = useFormik({
    initialValues: { name: "", email: "" },
    validationSchema,
    onSubmit: (values: any) => {
      dispatch(createUserRequest(values));      
      //formik.resetForm();
    },
  });
  useEffect(() => {
    if (error) {
      setUserSuccess(false);
      setSnackOpen(true);
      setMessage(error);
    }
    // else if(createSuccess)
    // {
    //   setUserSuccess(true);
    // }
    return () => {
      dispatch(createUserReset());
    };
  }, [error]);

  const handleCloseAndReset = () => {
    handleClose();
    formik.resetForm();
  };
  const handleProjectChange = (event: any) => {
    setProjectName(event.target.value);
  };
  const handleDescChange = (event: any) => {
    setProjectDescription(event.target.value);
  };
  const handleCloseDialog = () => {
    setUserSuccess(false);
  };
  const handleConfirm = () => {
    navigate(
      `/overview/user-management?id=${createSuccess?._id}&name=user&tab=1`
    );
    handleCloseDialog();
  };
  const handleCancel = () => {
    // Perform any necessary cleanup or action when "No" is clicked
    // ...
    handleCloseDialog();
    navigate("/overview/settings?tab=1");
  };
  const handleSnackbarClose = () => {
    setSnackOpen(false);
  };


  return (
    <>
      <CustomBackdrop open={createLoading} />
      <Modal open={modalOpen}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "#161C23",
            boxShadow: 24,
            //   p: 2,
            width: "30%",
            borderRadius: "7px",
          }}
        >
          <form className="p-a-24" onSubmit={formik.handleSubmit}>
            <div className="project-modal-heading">
              <Typography className="new-poject-text">New User</Typography>
              <div className="closed-icon-style custom-cursor" onClick={handleCloseAndReset}>
                <ClearIcon />
              </div>
            </div>

            <div className="form-labels">
              <FormLabel className="project-label-name">Full Name</FormLabel>
            </div>
            <div className="project-modal-text">
              <TextField
                // sx={{ width: "100%" }}
                className="project-name-input"
                name="name"
                placeholder="Full Name"
                value={formik.values.name}
                // id='project-name'
                // value={editProject?.project_name || projectName}
                onChange={formik.handleChange}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name
                ? formik.errors.name.toString() : " "
                }
                onKeyDown={(event) => PreventSpaceAtFirst(event)}
                onBlur={formik.handleBlur}
                autoFocus
              />
            </div>
            <div className="form-labels">
              <FormLabel className="project-label-name">Email</FormLabel>
            </div>
            <div className="project-modal-text">
              <TextField
                // sx={{ width: "100%" }}
                className="project-name-input"
                placeholder="email@example.com"
                name="email"
                type="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email
                  ? formik.errors.email.toString() : " "
                }
              />
            </div>
            {createLoading ? <CustomBackdrop open={true}/> : <Button disableRipple={true} className="project-modal-submit-button new-user-modal-submit" type="submit" disabled = {createLoading} >
              Create
            </Button>}
           
          </form>
        </Box>
      </Modal>
      <ConfirmationDialog
        open={userSuccess}
        onClose={handleCloseDialog}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        title={""}
        message={""}
      />
      <MySnackbar
        className="snack-bar"
        message={message}
        severity={severity}
        open={snackOpen}
        onClose={handleSnackbarClose}
      />
    </>
  );
};

export default UserModal;
