/* Import necessary modules from Material UI and other libraries*/

import { Grid } from "@mui/material";
import BackArrow from "../../assets/images/backArrow.png";
import Logo from "../../assets/images/logo.svg";
import { Label, SigninButton } from "../../styles/auth-styles/SigninStyles";
import { TextField, Typography } from "@material-ui/core";
import LogoText from "../../assets/images/LogoText.svg";
import "../../styles/auth-styles/ForgotPassword.css";
import "../../styles/common-styles/Common.css"
import { forgotPwdReset } from "../../redux/slice/auth-slice/ForgotPasswordSlice";

import LayoutImg from "../../assets/images/layoutLogin.png";
import { useNavigate } from "react-router";
import { forgotPwdRequest } from "../../redux/action/auth-action/ForgotPwdAction";
import * as Yup from "yup";
import { useFormik } from "formik";
import { ForgotPwdUser } from "../../redux/@types/auth-types/ForgotPwdTypes";
import { regex } from "../../helper/RegEx";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import MySnackbar from "../../helper/SnackBar";
import { CustomBackdrop } from "../../helper/backDrop";

const ForgotPassword = () => {
  /*Initialize necessary variables using React hooks*/

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [severity, setSeverity] = useState("");
  const [message, setMessage] = useState("");

  /*Extract data from ForgotPassword redux*/

  const { success, error, isLoggedIn, isLoading } = useSelector(
    (state: any) => state.forgotPwd
  );

  /*Use the useFormik hook to handle form values and submission*/

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid Email")
      .matches(regex.email, "Invalid Email")
      .required("Email is Required"),
  });
  const handleSnackbarClose = () => {
    setOpen(false);
  };

  /*Severity Based access*/

  useEffect(() => {
    if (success) {
      setMessage(success);
      setSeverity("success");
      setOpen(true);
      setTimeout(() => {
        navigate("/");
      }, 2000);
      
    } else if (error) {
      setMessage(error);
      setSeverity("error");
      setOpen(true);
    }
    return () => {
      // reset forgotPwdState object
      dispatch(forgotPwdReset());
    };
  }, [success, error]);

  const { errors, handleChange, handleSubmit, touched, values, resetForm } =
    useFormik({
      initialValues: {
        email: "",
      },
      validationSchema,
      onSubmit: (values: ForgotPwdUser) => {
        dispatch(forgotPwdRequest(values));
      },
    });

  return (
    <Grid container
    className="landing-page-container">
      <CustomBackdrop open ={isLoading}/>
      <Grid item lg={6} md={6} xs={12} sm={12}>
        <form onSubmit={handleSubmit}>
          <Grid container>
            <Grid className="tenant-logo" item lg={12} md={12} xs={12} sm={12}>
              <img src={Logo} width={32} height={32} />
              <img src={LogoText} />
            </Grid>
            <Grid item md={12} xs={12} sm={12}></Grid>
            <Grid item md={12} xs={12} sm={12}>
              <Typography
                className="typo-login"
                onClick={() => {
                  navigate("/forgot-password");
                }}
              >
                Forgot password?
              </Typography>
              <Typography className="login-text">
                No worries, we’ll send you reset instructions
              </Typography>
            </Grid>
            <div className="widt-100pre max-width-382px">
              <Grid item lg={12} md={12} xs={12} sm={12}>
                <div className="landing-page-input-form">
                  <div>
                    <div className="p-b-8">
                      <Label className="font-lg">Email</Label>
                    </div>
                    <TextField
                      name="email"
                      type="email"
                      placeholder="email@example.com"
                      onChange={handleChange}
                      error={Boolean(touched.email && errors.email)}
                      helperText={touched.email && errors.email && errors.email}
                      value={values.email.trim()}
                      autoComplete={"off"}
                      InputProps={{ disableUnderline: true }}
                      autoFocus
                    />
                  </div>
                </div>
              </Grid>
              <Grid item lg={12} md={12} sm={12} xs={12}>
                <SigninButton 
                disableRipple={true}
                className="landing-page-btn font-lg"
                type={"submit"}>Reset Password</SigninButton>
              </Grid>
              <Grid item md={12}>
                <div className="backto-sign-block">
                  <Typography
                    className="backto-sign"
                  >
                    <span className="custom-cursor" onClick={() => {
                      navigate("/");
                    }}>
                      <img src={BackArrow} alt="Back to sign in" className="backArrow"></img>
                    </span>
                    Back to sign in
                  </Typography>
                </div>
              </Grid>
            </div>
          </Grid>
          <Grid item md={12} xs={12} sm={12}>
            <MySnackbar
              className="snack-bar"
              message={message}
              severity={severity}
              open={open}
              onClose={handleSnackbarClose}
            />
          </Grid>
        </form>
      </Grid>
      <Grid item md={6} lg={6} className="default-img">
        <img src={LayoutImg} width={545} height={545} />
      </Grid>
    </Grid>
  );
};

export default ForgotPassword;
