import { Grid } from "@mui/material";
import Logo from "../../assets/images/logo.svg";
import { Label, SigninButton } from "../../styles/auth-styles/SigninStyles";
import { useState } from "react";
import { TextField, Typography } from "@material-ui/core";
import LogoText from "../../assets/images/LogoText.svg";
import "../../styles/auth-styles/SigninSso.css";
import "../../styles/common-styles/Common.css";
import LayoutImg from "../../assets/images/layoutLogin.png";
import { useNavigate } from "react-router";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import MySnackbar from "../../helper/SnackBar";
import { useEffect } from "react";
import { SSORequest } from "../../redux/action/auth-action/SsoTypes";
import { CustomBackdrop } from "../../helper/backDrop";
import PrivacyPolicy from "../../components/common/PrivacyPolicys";
import { fetchTermsAndConditionsRequest } from "../../redux/slice/cms-slice/TermsSlice";
import { PrivacyPolycyRequest } from "../../redux/slice/cms-slice/PrivacySlice";
import { getQueryParam } from "../../helper/SearchParams";

export const SigninSSO = () => {
  /*Initialize necessary variables using React hooks*/

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [snackOpen, setSnackOpen] = useState(false);
  const [severity, setSeverity] = useState("");
  const [message, setMessage] = useState("");
  const { success, error, loading } = useSelector((state: any) => state.sso);
  const [open, setOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: "", content: "" });
  const ssoError = getQueryParam("message");

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

  /*Define the validation schema for the form using Yup*/

  const validationSchema = Yup.object().shape({
    domain: Yup.string()
      // .domain("Invalid Email")
      // .matches(regex.dom, "Invalid Domain Name")
      .required("Domain Name is Required"),
  });

  /*Use the useFormik hook to handle form values and submission*/
  const { errors, handleChange, handleSubmit, touched, values, resetForm } =
    useFormik({
      initialValues: {
        domain: "",
      },
      validationSchema,
      onSubmit: (values: any) => {
        dispatch(SSORequest(values));
      },
    });
  const handleSnackbarClose = () => {
    setSnackOpen(false);
  };

  /*Severity Based snack Msg Access*/

  useEffect(() => {
    if (success) {
      setSnackOpen(true);
      setSeverity("success");
      setMessage("SSO Login Successfull!");
    } else if (error) {
      setSnackOpen(true);
      setSeverity("error");
      setMessage(error);
    }
  }, [success, error]);

  /*SSO Domain Mismatch Validation Error*/
  useEffect(() => {
    if (ssoError) {
      setSnackOpen(true);
      setSeverity("error");
      setMessage(ssoError);
    }
  }, [ssoError]);
  return (
    <Grid className="landing-page-container" container>
      <CustomBackdrop open={loading} />
      <Grid item lg={6} md={6} sm={12} xs={12}>
        <form onSubmit={handleSubmit}>
          <Grid container>
            <Grid className="tenant-logo" item lg={12} md={12} xs={12} sm={12}>
              <img src={Logo} width={32} height={32} />
              <img src={LogoText} />
            </Grid>
            <Grid item lg={12} md={12} xs={12} sm={12}>
              <Typography className="typo-login">Welcome Back</Typography>
              <Typography className="login-text">
                Don’t have an organization account?{" "}
                <span
                  className="sso-link"
                  onClick={() => {
                    navigate("/");
                  }}
                >
                  Sign In
                </span>
              </Typography>
            </Grid>
            <div>
              <Grid item lg={12} md={12} xs={12} sm={12}>
                <div className="landing-page-input-form">
                  <div>
                    <div className="p-b-8">
                      <Label className="font-lg">Domain Name</Label>
                    </div>

                    <TextField
                      name="domain"
                      // type="email"
                      placeholder="Domain Name"
                      onChange={handleChange}
                      error={Boolean(touched.domain && errors.domain)}
                      helperText={
                        touched.domain && errors.domain && errors.domain
                      }
                      value={values.domain.trim()}
                      autoComplete={"off"}
                      InputProps={{ disableUnderline: true }}
                      autoFocus
                    />
                  </div>
                </div>
              </Grid>
              <Grid item lg={12} md={12} xs={12} sm={12}>
                <SigninButton
                  disableRipple={true}
                  className="landing-page-btn"
                  type={"submit"}
                >
                  Proceed to Authentication
                </SigninButton>
              </Grid>
              <Grid item md={12} xs={12} sm={12}>
                <div className="terms-block">
                  <Typography className="terms-service">
                    By signing in you agree to the{" "}
                    <span>
                      <a
                        href="#"
                        className="terms-service"
                        onClick={(e) =>
                          handleTermsOpen(
                            termsData.page_title,
                            termsData.page_description
                          )
                        }
                      >
                      Terms of Service
                      </a>
                    </span>
                  </Typography>
                  <Typography className="terms-service">
                    and{" "}
                    <span>
                      <a
                        href="#"
                        className="terms-service"
                        onClick={(e) =>
                          handleTermsOpen(
                            privacyData.page_title,
                            privacyData.page_description
                          )
                        }
                      >
                        Privacy Policy
                      </a>
                    </span>
                  </Typography>
                </div>
              </Grid>
            </div>
            <Grid item lg={12} md={12} xs={12} sm={12}>
              <MySnackbar
                className="snack-bar"
                message={message}
                severity={severity}
                open={snackOpen}
                onClose={handleSnackbarClose}
              />
            </Grid>
          </Grid>
        </form>
      </Grid>
      <Grid item lg={6} md={6} className="default-img">
        <img src={LayoutImg} width={545} height={545} />
      </Grid>
      <PrivacyPolicy open={open} onClose={handleTermsClose} {...modalContent} />
    </Grid>
  );
};
function setOpen(arg0: boolean) {
  throw new Error("Function not implemented.");
}
