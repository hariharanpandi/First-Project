import React, { useEffect, useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { TextField, Button, Switch } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  profileInfoRequest,
  profileInfoReset,
} from "../../../../redux/slice/setting-slice/profile-setting/ProfileSettingSlice";
import {
  editUserRequest,
  editUserReset,
} from "../../../../redux/slice/user-management-slice/UpdateUserSlice";
import MySnackbar from "../../../../helper/SnackBar";
import { CustomBackdrop } from "../../../../helper/backDrop";
import { getQueryParam } from "../../../../helper/SearchParams";
import "../../../../styles/user-management-styles/EditeUser.css";
import PreventSpaceAtFirst from "../../../../components/PrventSpaceAtFirst";

interface FormValues {
  username: string;
  email: string;
  status: boolean | string;
}

const EditUser = () => {
  const user_id = getQueryParam("id");
  const dispatch = useDispatch();
  const { success, error, editSuccess, editLoading } = useSelector(
    (state: any) => state.editUser
  );
  const { profileData, loading } = useSelector(
    (state: any) => state.profileInfo
  );
  const [initialValues, setInitialValues] = useState<FormValues>({
    username: "",
    email: "",
    status: false,
  });

  useEffect(() => {
    dispatch(profileInfoReset());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    dispatch(profileInfoReset());
    dispatch(profileInfoRequest(user_id?.trim()));
  }, [dispatch, user_id]);

  useEffect(() => {
    if (profileData && profileData?._id === user_id) {
      setInitialValues({
        username: profileData?.user_name,
        email: profileData?.email || "",
        ...(((profileData.status === 'confirmed') || (profileData.status)) && { status: true }),
        ...(((profileData.status === 'pending') || (!profileData.status)) && { status: false }),
      });
    }
  }, [profileData, user_id]);

  const validationSchema = Yup.object({
    username: Yup.string()
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
    email: Yup.string().email("Invalid email address").required("Email is required"),
  });

  const handleSubmit = (values: FormValues) => {
    const formedRequest = {
      user_name: values.username,
      email: values?.email,
      ...(((values.status === 'confirmed') || (values.status)) && { status: true }),
      ...(((values.status === 'pending') || (!values.status)) && { status: false }),
    }
    dispatch(editUserRequest(formedRequest));
  };

  const [severity, setSeverity] = useState("");
  const [message, setMessage] = useState("");
  const [snackOpen, setSnackOpen] = useState(false);
  const handleSnackbarClose = () => {
    setSnackOpen(false);
  };

  useEffect(() => {
    if (editSuccess) {
      setMessage("User Data Updated Successfully");
      setSeverity("success");
      setSnackOpen(true);
    } else if (error) {
      setMessage(error);
      setSeverity("error");
      setSnackOpen(true);
    }
    return () => {
      dispatch(editUserReset());
    };
  }, [editSuccess, error, dispatch]);

  return (
    <div>
      <CustomBackdrop open={editLoading || loading} />
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ touched, errors, values, setFieldValue }) => (
          <Form className="edit-user-form">
            <div>
              <label htmlFor="username">Full Name</label>
              <Field
                as={TextField}
                className="edite-user-name-email"
                type="text"
                name="username"
                id="username"
                placeholder="User name"
                value={values?.username}
                error={touched.username && !!errors.username}
                helperText={touched.username && errors.username}
                onKeyDown={(event:any) => PreventSpaceAtFirst(event)}
                autoFocus
              />
            </div>
            <div>
              <label htmlFor="email">Email</label>
              <Field
                as={TextField}
                className="edite-user-name-email"
                type="email"
                name="email"
                id="email"
                placeholder="example@email.com"
                value={values.email}
                error={touched.email && !!errors.email}
                helperText={touched.email && errors.email}
                disabled
              />
            </div>

            <div className="status-bar">
              <label htmlFor="status">Status</label>
              <Switch
                checked={values.status as boolean}
                onChange={(event) => setFieldValue("status", event.target.checked)}
                name="status"
                className="user-switch-class"
                sx={{
                  "& .MuiSwitch-switchBase.Mui-checked": {
                    color: "#FFFFFF",
                  },
                  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                    backgroundColor: "#16A34A",
                  },
                  "& .MuiSwitch-switchBase": {
                    color: "#FFFFFF",
                  },
                  "& .MuiSwitch-switchBase + .MuiSwitch-track": {
                    backgroundColor: "#FFFFFF",
                  },
                }}
              />
            </div>
            <Button className="edit-user-button" type="submit">
              Save
            </Button>
          </Form>
        )}
      </Formik>
      <MySnackbar
        className="snack-bar"
        message={message}
        severity={severity}
        open={snackOpen}
        onClose={handleSnackbarClose}
      />
    </div>
  );
};

export default EditUser;
