//import { LinkedInCallback } from "react-linkedin-login-oauth2";
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
  Link,
} from "react-router-dom";
import {
  LOGIN,
  FORGOT_PASSWORD,
  LOGIN_SSO,
  SETTINGS_PROFILE,
  SETTINGS,
  TEMPLATE,
  CHANGE_PASSWORD,
  PROJECT_LANDING,
  SETTINGS_OVERVIEW,
  USER_MANAGEMENT,
  MANAGE_USER,
  PASSWORD_EXPIRY,
  CLOUD,
  APPLICATION_LANDING,
} from "./RoutePath";
import ForgotPassword from "../pages/auth/ForgotPassword";
import PageNotFound from "../components/common/PageNotFound";
import { SigninSSO } from "../pages/auth/SsoSignin";
import { Signin } from "../pages/auth/SignIn";
import SetAccount from "../pages/settings/account-settings/SetAccount";
import Settings from "../pages/settings/Index";
import Layout from "../Layout/Index";
import { ChangePassword } from "../pages/auth/ChangePassword";
import { ProjectLanding } from "../pages/project/ProjectLanding";
import LandingDisplay from "../pages/project/LandingDisplay";
import RoleSettings from "../pages/settings/user-management/edite-user/Index";
import ProtectedRoute from "./ProtectedRoute";
import { PwdExpiry } from "../components/common/PwdExpiry";
import CloudPlatForm from "../pages/cloud/CloudPlatform";
import CloudOnboarding from "../pages/cloud/CloudOnboarding";
import AuthenticationDetails from "../pages/cloud/AuthenticationDetails";
import CloudAccount from "../pages/cloud/CloudAccount";
import EditCloudDetails from "../pages/cloud/EditCloudDetails";
import { AppLanding } from "../pages/application/AppLanding";
import WorkloadSideBar from "../pages/workload/WorkloadSideBar";

function AppRouter() {
  // useUserLocationQuery();
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path={LOGIN} element={<Signin />} />
          <Route path={FORGOT_PASSWORD} element={<ForgotPassword />} />
          <Route path={LOGIN_SSO} element={<SigninSSO />} />
          <Route path={PROJECT_LANDING} element={<LandingDisplay />} />
          <Route path={SETTINGS_PROFILE} element={<SetAccount />} />
          {/* <Route path ={SETTINGS} element={</>}/> */}
          <Route element={<ProtectedRoute />}>
            <Route path={TEMPLATE} element={<Layout />}>
              
              <Route path={SETTINGS_OVERVIEW} element={<Settings />} />
              <Route path={USER_MANAGEMENT} element={<RoleSettings />} />
              <Route path={APPLICATION_LANDING} element = {<AppLanding/>}/>
              {/* <Route path="/overview/manage-users" element = {<}/> */}
            <Route path='workload' element={<WorkloadSideBar />} />
            </Route>
            <Route path={USER_MANAGEMENT} element={<RoleSettings />} />

            {/** Cloud Route start */}

            <Route path={CLOUD.PLATFORM} element={<CloudPlatForm />} />
            <Route path={CLOUD.ONBOARDING} element={<CloudOnboarding />} />
            <Route path={CLOUD.AUTHENTICATION_DETAILS} element={<AuthenticationDetails />} />
            <Route path={CLOUD.ACCOUNT} element={<CloudAccount />} />
            <Route path={CLOUD.EDIT_CLOUD} element={<EditCloudDetails />} />

            {/** Cloud Route END */}

          </Route>

          <Route path={CHANGE_PASSWORD} element={<ChangePassword />} />
          <Route path="*" element={<PageNotFound />} />
          <Route path={PASSWORD_EXPIRY} element={<PwdExpiry/>}/>

          {/* <Route path={FORGOT_PASSWORD} element={<ForgotPassword />} /> */}
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default AppRouter;
// function useUserLocationQuery() {
//   throw new Error("Function not implemented.");
// }
