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
import { regex } from "../../helper/RegEx";
import "../../styles/auth-styles/Signin.css";
import "../../styles/common-styles/Common.css";
import { User } from "../../redux/@types/auth-types/AuthTypes";
import { useEffect } from "react";
import MySnackbar from "../../helper/SnackBar";
import LayoutImg from "../../assets/images/layoutLogin.png";
import "../../styles/common-styles/Modal.css";
import { getLocalStorage } from "../../helper/LocalStorage";
import Cookies from "js-cookie";
import { log } from "console";
import { setCookie } from "../../helper/Cookie";
import { loginReset } from "../../redux/slice/auth-slice/AuthSlice";
import { Loaders } from "../../components/Loader";
import { CustomBackdrop } from "../../helper/backDrop";
import EyeIcon from "../../assets/icons/EyeIcon";
import PrivacyPolicy from "../../components/common/PrivacyPolicys";
import { fetchTermsAndConditionsRequest } from "../../redux/slice/cms-slice/TermsSlice";
import { PrivacyPolycyRequest } from "../../redux/slice/cms-slice/PrivacySlice";
import EyeCloseLine from "../../assets/icons/EyeCloseLine";

/* Define the Signin component*/

export const Signin = () => {
  /*Initialize necessary variables using React hooks*/

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [snackOpen, setSnackOpen] = useState(false);
  const [severity, setSeverity] = useState("");
  const [message, setMessage] = useState("");
  const [checked, setChecked] = React.useState(false);
  const savedEmail = Cookies.get("email");
  const savedPassword = Cookies.get("password");
  const [showPassword, setShowPossword] = useState<boolean>(false);
  const [open, setOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', content: '' });

  /*Remember Me checkbox validation*/
  const handleRememberme = () => {
    setChecked(!checked);
  };

    /* "modal data" Extract data Terms Slice*/
    const { termsData } = useSelector((state: any) => state.termsAndConditions);
    /*Extract Priavcy data*/
    const { privacyData } = useSelector((state: any) => state.privacyPolicy);

    useEffect(() => {
      dispatch(fetchTermsAndConditionsRequest());
   }, [dispatch]);

   useEffect(() => {
    const payload:any = 'policy'
    dispatch(PrivacyPolycyRequest(payload));
     }, [dispatch]);

    

      /*Modal Open close dispatch api data*/
    const handleTermsOpen = (title: string, content: string) => {
    setModalContent({ title, content });
    setOpen(true);
    };

    const handleTermsClose = () => {
      setOpen(false);
    };


  /*Extract data from login redux*/
  const { user, isLoggedIn, error, loginResponse, isLoading } = useSelector(
    (state: any) => state.auth
  );

  /*Define the function to handle closing the snackbar*/

  const handleSnackbarClose = () => {
    setSnackOpen(false);
  };

  /* Use the useEffect hook to set check the local storage token to navigate login|| Dashboard*/

  useEffect(() => {
    if (getLocalStorage("token") !== null) {
      navigate("/overview");
    } else {
    }
  }, []);

  useEffect(() => {
    if (checked) {
      setCookie("email", values.email);
      setCookie("password", values.password);
    }
  }, [checked]);

  useEffect(() => {
    if ((isLoggedIn && localStorage.getItem("token") !== null) || "") {
      setSeverity("success");
      setMessage("Login successful!");
      setSnackOpen(true);
      setTimeout(() => {
        navigate("/overview");
      }, 1500);
    }
    return () => {
      dispatch(loginReset());
    };
  }, [isLoggedIn]);
  
  useEffect(() => {
    if ((error && localStorage.getItem("token") === null) || "") {
      setMessage(error);
      setSeverity("error");
      setSnackOpen(true);
      localStorage.clear();
    }
    return () => {
      dispatch(loginReset());
    };
  }, [error]);

  const clickPasswordHandler = () => setShowPossword((preState) => !preState);

  /*Define the validation schema for the form using Yup*/

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid Email")
      .matches(regex.email, "Invalid Email")
      .required("Email is Required"),
    password: Yup.string().required("Password is Required"),
  });

  /*Use the useFormik hook to handle form values and submission*/

  const { errors, handleChange, handleSubmit, touched, values, resetForm } =
    useFormik({
      initialValues: {
        email: savedEmail || "",
        password: savedPassword || "",
      },
      validationSchema,
      onSubmit: (values?: User) => {
        dispatch(loginRequest(values));
        setTimeout(() => {
          if ((isLoggedIn && localStorage.getItem("token") !== null) || "") {
            setSeverity("success");
            setMessage("Login successful!");
            setSnackOpen(true);
            setTimeout(() => {
              navigate("/overview");
            }, 1500);
          }
          //  else if (
          //   (!isLoggedIn && localStorage.getItem("token") === null) ||
          //   ""
          // ) {
          //   setSeverity("error");
          //   setMessage("Email or password is not valid");
          //   setSnackOpen(true);
          //   localStorage.clear();
          // }
          else if ((error && localStorage.getItem("token") === null) || "") {
            setSeverity("error");
            setMessage(error);
            setSnackOpen(true);
            localStorage.clear();
          }
        }, 2000);
      },
    });

    const checkBoxStylee = {
      '& .MuiSvgIcon-root': {
        fontSize: 20,
      },
      '&.MuiCheckbox-colorPrimary.Mui-checked': {
        color: '#F46662 !important',
        position: 'relative',
        left: '3.6px',
      },
      '&.MuiCheckbox-colorPrimary': {
        color: '#ffff',
        position: 'relative',
        left: '3.6px',
        right:'-4px',
      },
    };

  /*Return the component JSX*/

  return (
    <>
     
      
        <Grid 
        className="landing-page-container" 
        container>
        <CustomBackdrop open={isLoading}/>
          <Grid item md={6} sm={12} xs={12} lg={6}>
            {/* <Layout> */}
            <form onSubmit={handleSubmit}>
              <Grid container>
                <Grid item className="tenant-logo"
                lg={12} md={12} xs={12} sm={12}>
                  <img src={Logo} width={32} height={32} />
                  <img src={LogoText} />
                </Grid>
                <Grid item md={12} xs={12} sm={12}>
                  <Typography className="typo-login">Welcome back</Typography>
                </Grid>
                <Grid item lg={12} md={12} xs={12} sm={12}>
                  <Typography className="login-text">
                    Have an organization account, use{" "}
                    <span
                      className="sso-link"
                      onClick={() => {
                        navigate("/login-sso");
                      }}
                    >
                      Single Sign On
                    </span>
                  </Typography>
                </Grid>
                <div>
                  <Grid item lg={12} md={12} xs={12} sm={12}>
                    <div className="landing-page-input-form">
                      <div>
                        <Label className="font-lg">Email</Label>
                      </div>

                      <TextField
                        className="landing-page-input-form"
                        name="email"
                        type="email"
                        placeholder="email@address.com"
                        inputProps={{ maxLength: 50 }}
                        onChange={handleChange}
                        error={Boolean(touched.email && errors.email)}
                        helperText={
                          touched.email && errors.email && errors.email
                        }
                        value={values.email.trim()}
                        autoComplete={"off"}
                        InputProps={{ disableUnderline: true }}
                        autoFocus
                      />
                      
                    </div>
                  </Grid>
                  <Grid item lg={12} md={12} xs={12} sm={12}>
                    <div className="landing-page-input-form p-b-0">
                      <div>
                        <Label className="font-lg">Password</Label>
                      </div>
                      <TextField
                        name="password"
                        type={ showPassword ? "text" : "password"}
                        placeholder="**************"
                        inputProps={{ maxLength: 50 }}
                        onChange={handleChange}
                        error={Boolean(touched.password && errors.password)}
                        helperText={
                          touched.password && errors.password && errors.password
                        }
                        value={values.password.trim()}
                        autoComplete={"off"}
                        InputProps={{ disableUnderline: true }}
                      />
                    {
                      values.password.trim().length > 0 && !showPassword  && (
                        <span className="eye-lcon"
                          onClick={clickPasswordHandler}>
                          <EyeIcon />
                        </span>
                      )
                    }
                    {
                      values.password.trim().length > 0 && showPassword &&
                      <span className="eye-lcon"
                        onClick={clickPasswordHandler}>
                        <EyeCloseLine />
                      </span>
                    }
                    </div>
                  </Grid>
                  <Grid item
                  className="p-b-8"
                  paddingBottom={2.5}
                   md={12} xs={12} sm={12}>
                    <div className="password-block">
                      <div className="remember-text">
                        <Checkbox
                          checked={checked}
                          onChange={handleRememberme}
                          sx={checkBoxStylee}
                          disableRipple={true}
                        />
                        Remember Me
                      </div>
                      <div className="link-text">
                        <a
                          href="#"
                          className="forgot-text"
                          onClick={() => {
                            navigate("/forgot-password");
                          }}
                        >
                          Forgot Password?
                        </a>
                      </div>
                    </div>
                  </Grid>

                  <Grid item lg={12} md={12} xs={12} sm={12}>
                    <SigninButton 
                      disableRipple={true}
                      className="landing-page-btn"
                      type={"submit"}>{"Sign In"}
                    </SigninButton>
                  </Grid>

                  <Grid item md={12} className="font-lg">
                    <div className="terms-block">
                      <Typography className="terms-service">
                        By signing in you agree to the{" "}
                        <span>
                          <a
                            href="#"
                            // onClick={handleClickOpen("paper")}
                            className="terms-service"
                            onClick={() => handleTermsOpen(termsData.page_title, termsData.page_description )}
                          >
                            Terms of service
                          </a> 
                        </span>
                      </Typography>
                      <Typography className="terms-service">
                        and{" "}
                        <span>
                          <a
                            href="#"
                            className="terms-service"
                            // onClick={handlePrivacyOpen("paper")}
                            onClick={() => handleTermsOpen(privacyData.page_title, privacyData.page_description )}
                          >
                            Privacy Policy
                          </a>
                        </span>
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
                  open={snackOpen}
                  onClose={handleSnackbarClose}
                />
              </Grid>
            </form>
          </Grid>

          <Grid item md={6} lg={6} className="default-img">
            <img src={LayoutImg} width={545} height={545} />
          </Grid>

         <PrivacyPolicy  open={open} onClose={handleTermsClose} {...modalContent}/>

        </Grid>
    
    </>
  );
};
