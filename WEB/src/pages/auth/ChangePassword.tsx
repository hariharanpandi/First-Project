/* Import necessary modules from Material UI and other libraries*/
import { Grid, Snackbar } from "@mui/material";
import { useFormik } from "formik";
import { useState } from "react";
import * as Yup from "yup";
import React from "react";
import Logo from "../../assets/images/logo.svg";
import { Label, SigninButton } from "../../styles/auth-styles/SigninStyles";
import { TextField, Typography } from "@material-ui/core";
import Checkbox from "@mui/material/Checkbox";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import LogoText from "../../assets/images/LogoText.svg";
import { loginRequest } from "../../redux/slice/auth-slice/AuthSlice";
import {
  changePwdRequest,
  changePwdReset,
} from "../../redux/slice/auth-slice/ChangePwdSlice";
import { regex } from "../../helper/RegEx";
import "../../styles/auth-styles/Signin.css";
import { User } from "../../redux/@types/auth-types/AuthTypes";
import { useEffect } from "react";
import MySnackbar from "../../helper/SnackBar";
import LayoutImg from "../../assets/images/layoutLogin.png";
import "../../styles/common-styles/Modal.css";
import "../../styles/common-styles/Common.css";
import { getLocalStorage } from "../../helper/LocalStorage";
import { log } from "console";
import {
  ChangePwdUser,
  changePwdUserRequest,
} from "../../redux/@types/auth-types/ChangePassword";
import { useLocation } from "react-router-dom";
import { CustomBackdrop } from "../../helper/backDrop";
import EyeIcon from "../../assets/icons/EyeIcon";
import { pwdExpiryRequest } from "../../redux/slice/auth-slice/PwdExpirySlice";
import { getQueryParam } from "../../helper/SearchParams";
import EyeCloseLine from "../../assets/icons/EyeCloseLine";

/* Define the Signin component*/

export const ChangePassword = () => {
  /*Initialize necessary variables using React hooks*/

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [snackOpen, setSnackOpen] = useState(false);
  const [severity, setSeverity] = useState("");
  const [message, setMessage] = useState("");
  const [open, setOpen] = React.useState(false);
  const [privacyOpen, setPrivacyOpen] = React.useState(false);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const userIds = searchParams.get("id");
  const [scroll, setScroll] = React.useState<"paper" | "body">("paper");
  const [showPassword, setShowPossword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const { pwdExpiry, expiryError } = useSelector(
    (state: any) => state.pwdExpiry
  );
  const user_id = getQueryParam("id");

  /*Extract data from login redux*/

  const { user, isLoggedIn, error, loginResponse, isLoading, success } =
    useSelector((state: any) => state.changePwd);

  const clickPasswordHandler = () => setShowPossword((preState) => !preState);

  const clickConfirmPasswordHandler = () =>
    setShowConfirmPassword((preState) => !preState);

  /*Define the function to handle closing the snackbar*/

  const handleSnackbarClose = () => {
    setSnackOpen(false);
  };

  /* Use the useEffect hook to set check the local storage token to navigate login|| Dashboard*/

  /*Define the validation schema for the form using Yup*/

  const validationSchema = Yup.object().shape({
    password: Yup.string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters")
      .matches(
        regex.password,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),
    confirmPassword: Yup.string()
      .required("Confirm Password is required")
      .oneOf([Yup.ref("password"), ""], "Passwords must match"),
  });

  useEffect(() => {
    if (success) {
      setMessage(success);
      setSeverity("success");
      setSnackOpen(true);
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } else if (error) {
      setMessage(error);
      setSeverity("error");
      setSnackOpen(true);
    }
    return () => {
      // reset forgotPwdState object
      dispatch(changePwdReset());
    };
  }, [success, error]);
  useEffect(() => {
    dispatch(pwdExpiryRequest());
  }, [user_id]);
  useEffect(() => {
    if (expiryError) {
      navigate("/reset-link-expired");
    }
  }, [expiryError]);

  /*Use the useFormik hook to handle form values and submission*/
  const [person, setPerson] = useState<changePwdUserRequest>({
    userid: userIds,
    password: "",
  });
  const { errors, handleChange, handleSubmit, touched, values, resetForm } =
    useFormik({
      initialValues: {
        password: "",
        confirmPassword: "",
      },
      validationSchema,

      onSubmit: (values?: ChangePwdUser) => {
        setPerson({
          userid: userIds,
          password: values?.confirmPassword,
        });

        dispatch(changePwdRequest(values));
      },
    });

    const handlePaste = (event:any) => {
      event.preventDefault();
      // Optionally, you can show a notification or message here to inform the user that copy-paste is not allowed.
    };

  /*Return the component JSX*/

  return (
    <>
      <Grid container className="landing-page-container">
        <CustomBackdrop open={isLoading} />
        <Grid item md={6} sm={12} xs={12} lg={6}>
          {/* <Layout> */}
          <form onSubmit={handleSubmit}>
            <Grid container paddingTop={4}>
              <Grid
                className="tenant-logo"
                item
                lg={12}
                md={12}
                xs={12}
                sm={12}
              >
                <img src={Logo} width={32} height={32} />
                <img src={LogoText} />
              </Grid>
              <Grid item md={12} xs={12} sm={12}>
                <Typography className="typo-login">Welcome back</Typography>
              </Grid>
              <Grid item lg={12} md={12} xs={12} sm={12}>
                <Typography className="login-text">
                  Please set your password to get started
                </Typography>
              </Grid>
              <div className="widt-100pre max-width-382px">
                <Grid item lg={12} md={12} xs={12} sm={12}>
                  <div className="landing-page-input-form">
                    <div className="p-b-8">
                      <Label className="font-lg">Password</Label>
                    </div>

                    <TextField
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="********"
                      inputProps={{ maxLength: 50 }}
                      onChange={handleChange}
                      error={Boolean(touched.password && errors.password)}
                      helperText={
                        touched.password && errors.password && errors.password
                      }
                      value={values.password.trim()}
                      autoComplete={"off"}
                      InputProps={{ disableUnderline: true }}
                      autoFocus
                    />
                    {
                      values.password.trim().length > 0 && !showPassword  &&
                      <span
                        className="eye-lcon position-top"
                        onClick={clickPasswordHandler}
                      >
                        <EyeIcon />
                      </span>
                    }
                     {
                      values.password.trim().length > 0 && showPassword &&
                      <span className="eye-lcon position-top"
                        onClick={clickPasswordHandler}>
                        <EyeCloseLine />
                      </span>
                    }
                  </div>
                </Grid>
                <Grid item lg={12} md={12} xs={12} sm={12}>
                  <div className="landing-page-input-form">
                    <div className="p-b-8">
                      <Label className="font-lg">Confirm Password</Label>
                    </div>
                    <TextField
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="********"
                      inputProps={{ maxLength: 50 }}
                      onChange={handleChange}
                      error={Boolean(
                        touched.confirmPassword && errors.confirmPassword
                      )}
                      helperText={
                        touched.confirmPassword &&
                        errors.confirmPassword &&
                        errors.confirmPassword
                      }
                      value={values.confirmPassword.trim()}
                      autoComplete={"off"}
                      InputProps={{ disableUnderline: true }}
                      onPaste={handlePaste}
                    />
                    {
                      values.confirmPassword.trim().length > 0 && !showConfirmPassword  &&
                      <span
                        className="eye-lcon position-top"
                        onClick={clickConfirmPasswordHandler}
                      >
                        <EyeIcon />
                      </span>
                    }
                    {
                      values.confirmPassword.trim().length > 0 && showConfirmPassword  &&
                      <span
                        className="eye-lcon position-top"
                        onClick={clickConfirmPasswordHandler}
                      >
                        <EyeCloseLine />
                      </span>
                    }
                  </div>
                </Grid>

                <Grid item lg={12} md={12} xs={12} sm={12}>
                  <SigninButton className="landing-page-btn" type={"submit"}>
                    {"Proceed to sign in"}
                  </SigninButton>
                </Grid>
              </div>
            </Grid>

            <Grid item md={12} xs={12} sm={12}>
              <MySnackbar
                className="snack-bar"
                message={message}
                severity={severity}
                open={snackOpen}
                onClose={handleSnackbarClose}
              />
            </Grid>
          </form>
        </Grid>

        <Grid item md={6} lg={6} className="default-img">
          <img src={LayoutImg} width={545} height={545} />
        </Grid>

      </Grid>
    </>
  );
};
