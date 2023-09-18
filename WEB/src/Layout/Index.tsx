import React from "react";

// import component 👇
import Drawer from "react-modern-drawer";

import { Grid, IconButton } from "@mui/material";

import NavIcon from "../assets/icons/NavIcon";
import Logo from "../assets/images/logo.svg";
import LogoText from "../assets/images/LogoText.svg";
import Divider from "@mui/material/Divider";
import "../styles/common-styles/SearchBar.css";
import Settings from "../pages/settings/Index";
import NewProject from "../assets/icons/CreateProject";
import { Button } from "@mui/material";
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
} from "react-router-dom";

import {
  ContentFlex,
  DrawerFlex,
  Flex,
  FlexEnd,
  FlexView,
  IconBlock,
  ProfileFlex,
  SearchFlex,
  SettingTypo,
  Typocast,
  Wrappers,
  Project,
  ProjectTypo,
  ProjectDesc,
  LayoutTypo,
} from "../styles/setting-styles/AccountStyles";
import MySnackbar from "../helper/SnackBar";

// import styles 👇
import "react-modern-drawer/dist/index.css";
import SearchBar from "../components/SearchBar";
import ThreeDot from "../assets/icons/ThreeDot";
import CompLogo from "../assets/icons/CompanyLogo";
import { Typo } from "../styles/setting-styles/AccountStyles";
import { useState } from "react";
import CustomPopover from "../pages/settings/account-settings/Popover";
import CreateProject from "../assets/icons/CreateProject";
import PlusIcon from "../assets/icons/PlusIcon";
import "../styles/project-styles/project.css";
import { ParentNodeComponent } from "../pages/project/TreeView";
import { useDispatch, useSelector } from "react-redux";
import { getProjectRequest } from "../redux/action/project-action/GetProjectAction";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getLocalStorage, setLocalStorage } from "../helper/LocalStorage";

import { CustomBackdrop } from "../helper/backDrop";
import ProjectModal from "../pages/project/ProjectModal";
import { projectCreationRequest } from "../redux/action/project-action/CreateProjectAction";
import {
  createProjectRequest,
  createProjectReset,
} from "../redux/slice/project-slice/CreateProjectSlice";
import {
  editProjectRequest,
  editProjectReset,
} from "../redux/slice/project-slice/EditProjectSlice";
import { ProjectLanding } from "../pages/project/ProjectLanding";

import ProjectEditModal from "../pages/project/EditProject";
import { DotIcon } from "../assets/icons/DotIcon";
import { useNavigate } from "react-router-dom";
import { profileInfoRequest } from "../redux/action/setting-action/profile-setting/ProfileSettingAction";

import { getProjectInfoRequest } from "../redux/action/project-action/GetProjectInfoAction";
import { getProjectInfoInitRequest } from "../redux/action/project-action/GetProjectInfoInitaction";
import { getQueryParam } from "../helper/SearchParams";
import RoleSettingsTables from "../pages/settings/user-management/user-settings/UserSettings";
import DiscoveryPage from "../pages/settings/cloud-account";
import { pwdExpiryRequest } from "../redux/slice/auth-slice/PwdExpirySlice";
import DialogModal from "../pages/application/AppModal";
import {
  createAppRequest,
  createAppReset,
} from "../redux/slice/app-slice/CreateProjectSlice";
import { AppLanding } from "../pages/application/AppLanding";
import {
  updateAppRequest,
  updateAppReset,
} from "../redux/slice/app-slice/UpdateAppSlice";
import TopBar from "../pages/project/TopBar";
import WorkloadSideBar from "../pages/workload/WorkloadSideBar";
import ProfileEmpty from "../assets/images/EmtyUser.png";
import _ from "lodash";
import { setSideOpen } from "../redux-local/AppNames";
import ConfirmLeaving from "../components/ConfirmLeaving";

const Layout = () => {
  const manageUser = getQueryParam("manageuser");
  const discoveryUser = getQueryParam("cloud-account");
  const projectView = getQueryParam("project-view");
  const [isOpen, setIsOpen] = React.useState(true);
  const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);
  const [setting, setSetting] = useState(false);
  const [parentNode, setParentNode] = useState([]);
  const location = useLocation();
  const pathname = location.pathname;
  const isWorkloadScreen = pathname.includes("/overview/workload");
  const settingsPage = location.pathname.includes("settings");
  const searchParams = new URLSearchParams(location.search);
  const sso = searchParams.get("sso");
  const dispatch = useDispatch();
  const [userId, setUserId] = useState<any>(null);
  const [isProjectAction, setIsProjectAction] = useState<any>(false);
  const [create, setCreate] = useState(false);
  const [severity, setSeverity] = useState("");
  const [message, setMessage] = useState("");
  const [snackOpen, setSnackOpen] = useState(false);
  const [updateMode, setUpdateMode] = useState<any>(false);
  const [projectdata, setProjectData] = useState<any>();
  const navigate = useNavigate();
  const update = getQueryParam("projectUpdate");
  const role = getLocalStorage("user_type");
  const project_id: any = getQueryParam("projectId");
  const isAppPage = getQueryParam("application-landing");
  const isWorkload = getQueryParam("workload");
  const settingsTables = getQueryParam("tab");
  const [val, setVal] = useState<any>();

  useEffect(() => {
  dispatch(setSideOpen(isOpen))

  }, [isOpen])
  const { success, loading, projectData } = useSelector(
    (state: any) => state.getProject
  );
  const { projectCreationType, createLoading, createSuccess, error } =
    useSelector((state: any) => state.createProject);
  const { editSuccess, editLoading, editError, projectEditType } = useSelector(
    (state: any) => state.editProject
  );
  const { loading: projectInfoLoading, projectDataInfo } = useSelector(
    (state: any) => state.getProjectInfo
  );

  const { profileData } = useSelector((state: any) => state.profileInfo);
  // const [profiledata, setProfiledata] = useState();

  // useEffect(() => {
  //   setProfiledata()
  // })

  const { projectDataInfoInit } = useSelector(
    (state: any) => state.getProjectInfoInit
  );
  const { appData, appError, appLoading,appSuccess } = useSelector((state: any) => state.createApp);
  const { updateSuccess, updateError, updateLoading } = useSelector(
    (state: any) => state.updateApp
  );
  const [isResource, setIsResource] = useState<boolean>(false);
  const [isHandelClickOverview, setIsHandelClickOverview] = useState<boolean>(false);
  const [ishandleSettingChange, setIshandleSettingChange] = useState<any>(null);
 

  useEffect(() => {
    const user_id: any = localStorage.getItem('userId')
    dispatch(profileInfoRequest(user_id));
  }, []);

  const userName = localStorage.getItem("user_name")?.replace(/"/g, "");
  const editApp = getQueryParam("app_edit");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const projectId: any = getQueryParam("projectId");
  const [editProjectBoolean, setEditProject] = useState(false);
  const [editProjectBooleanVal, setEditProjectBoolean] = useState<any>("");
  const [anchorEl, setAnchorEl] = useState(null);

  const showDialog = () => {
    setDialogVisible(true);
  };
  const [renderApp, setRenderApp] = useState(false);

  const hideDialog = (data: any) => {
    setDialogVisible(false);
    setRenderApp(data);
    setEditProject(false);
  };

  const { deleteApplication } = useSelector(
    (state: any) => state.deleteApp
  );

  /*SSO user Redirection */
  useEffect(() => {


    if ((sso && sso == 'true') && ((searchParams.get("token") !== undefined) || (searchParams.get("token") !== null))) {
      try {

        const user_name = searchParams.get("user_name");
        const userId: any = searchParams.get("id")
        setLocalStorage("userId", userId);
        setLocalStorage("user_type", searchParams.get("user_type"));
        setLocalStorage("token", searchParams.get("token"));
        setLocalStorage("user_name", user_name);
        dispatch(profileInfoRequest(userId));
      } catch (err) {
        //console.log(err)
      }
    } 
  }, []);

  useEffect(() => {
    if (projectData?._id) {
      dispatch(profileInfoRequest(projectData?._id));
    }


  }, [projectData])

  useEffect(() => {
    dispatch(getProjectRequest());
  }, []);

  useEffect(() => {
    if (projectData?.projectDtl) {
      setParentNode(projectData?.projectDtl);
    }
  }, [projectData]);

  const handleProjectCreate = () => {
    setCreate(true);
  };

  useEffect(() => {
    if (projectView) {
      setIsOpen(false);
    } else {
      setIsOpen(true);
    }
  }, [projectView])

  const toggleDrawer = () => {
    setIsOpen((prevState) => !prevState);
  };

  const handleSettings = (e:any) => {
    setIsPopoverOpen(true);
    setAnchorEl(e.currentTarget);
  };
  const handlePopoverClose = () => {
    setIsPopoverOpen(false);
    setAnchorEl(null)
  };
  const handleSettingChange = (newValue: any) => {
    if (JSON.parse(localStorage.getItem('is_resource')!) &&
      isWorkloadScreen
    ) {
      setIsResource(true);
      setIsHandelClickOverview(false);
      setIshandleSettingChange(newValue);
      return
    }
    setSetting(newValue);
    if (!_.isNil(projectId)) {
      navigate(`/overview/settings?projectId=${projectId}`);
    } else {
      navigate("/overview/settings");
    }

  };
  const handleProjectAction = () => {
    setIsProjectAction(true);
  };
  const handleClose = () => {
    setCreate(false);
  };
  const handleCreateProject = (values: any) => {
    dispatch(createProjectRequest(values));
    setCreate(false);
  };

  useEffect(() => {
    if (createSuccess) {
      setMessage("Project Created Succesfully");
      setSeverity("success");
      setSnackOpen(true);
    } else if (error) {
      setMessage(error);
      setSeverity("error");
      setSnackOpen(true);
      dispatch(createProjectReset());
    }
  }, [createSuccess, error]);
  useEffect(() => {
    if (updateSuccess) {
      setSeverity("success");
      setSnackOpen(true);
      setMessage("Application updated successfully !");
    } else if (updateError) {
      setSeverity(error);
      setSnackOpen(true);
      setMessage(updateError);
    }
    return () => {
      dispatch(updateAppReset());
      // dispatch(deleteAppReset());
    };
  }, [updateSuccess, updateError]);
  useEffect(() => {
    if (editSuccess) {
      setMessage(editSuccess?.message);
      setSeverity("success");
      setSnackOpen(true);
      dispatch(getProjectRequest());
    } else if (editError) {
      setMessage(editError?.response?.data);
      setSeverity("error");
      setSnackOpen(true);
    }
    return () => {
      dispatch(editProjectReset());
    };
  }, [editSuccess, editError]);

  useEffect(() => {
    if (appSuccess) {
      setMessage(appData?.message);
      setSeverity("success");
      setSnackOpen(true);
    } else if (appError) {
      setMessage(appError);
      setSeverity("error");
      setSnackOpen(true);
      dispatch(createAppReset());
    }
  }, [appError, appSuccess]);

  const handleSnackbarClose = () => {
    setSnackOpen(false);
  };
  useEffect(() => {
    if (createSuccess) {
      dispatch(getProjectRequest());
    }
  }, [createSuccess]);
  const handleUpdateProject = (values: any) => {
    setCreate(false);
    setEditProjectBoolean(values);
    dispatch(editProjectRequest(values));
    dispatch(getProjectInfoRequest(projectId));
  };
  const handleChildData = (data: string) => {
    setProjectData(data);
  };
  useEffect(() => {
    dispatch(getProjectInfoInitRequest());
  }, [dispatch]);

  const handleCreateApp = (values: any) => {
    let createAppObj: any = {
      app_name: values?.applicationName,
      description: values?.description,
      project_id: project_id,
    };
    const formData = new FormData();

    formData.append("File", values?.file);
    formData.append("appData", JSON.stringify(createAppObj));

    const appData = new FormData();
    appData.append("appData", JSON.stringify(createAppObj));
    dispatch(createAppRequest(formData));
  };

  const handelClickOverview = () => {
    if (JSON.parse(localStorage.getItem('is_resource')!) &&
      isWorkloadScreen) {
      setIsResource(true);
      setIshandleSettingChange(false);
      setIsHandelClickOverview(true);
      return
    }
    setSetting(false);
    if (projectData?.projectDtl && projectData?.projectDtl?.length > 0) {
      navigate(`/overview?projectId=${projectData?.projectDtl?.[0]?._id}`);
    } else {
      navigate(`/overview`);
    }
  };

  const stayOnWorkloadScreen = (): void => {
    localStorage.setItem('is_resource', JSON.stringify(false));
    if (ishandleSettingChange) {
      handleSettingChange(ishandleSettingChange);
    } else if (isHandelClickOverview) {
      handelClickOverview();
    }
  };

  const leaveWorkloadScreen = (): void => {
    setIsResource(false)
  };

  const handleEditAppData = (booleanVal: boolean) => {
    setEditProject(booleanVal);
  };

  const handleEditApp = (values: any) => {
    let createAppObj: any = {
      app_name: values?.applicationName,
      description: values?.description,
      project_id: project_id,
    };
    const formData = new FormData();


    formData.append("File", values?.file);
    formData.append("appData", JSON.stringify(createAppObj));

    const appData = new FormData();
    appData.append("appData", JSON.stringify(createAppObj));

    dispatch(updateAppRequest(formData));
  };


  return (
    <>
      <Grid container>
        <CustomBackdrop
          open={loading || createLoading || editLoading || updateLoading || appLoading || deleteApplication}
        />
        <Grid item lg={2} md={2} xs={2} sm={2}>
          <div
            onClick={toggleDrawer}
            className={isOpen ? "nav-over-icon" : "nav-over-icon-after"}
          >
            <NavIcon onClick={toggleDrawer} />
          </div>

          <Drawer
            open={isOpen}
            onClose={toggleDrawer}
            direction="left"
            className="bla bla bla"
          >
            <Grid container className="header-container">
              <Grid className="header-tenant-logo" item md={12}>
                <img
                  className="custom-cursor tenent-logo"
                  onClick={handelClickOverview}
                  src={Logo}
                  alt="tenant logo"
                />
                <img
                  onClick={handelClickOverview}
                  src={LogoText}
                  className="header-tenant-name custom-cursor"
                  alt="tenant name"
                />
              </Grid>
              <Grid className="header-search-bar" item md={12} padding={1}>
                <SearchBar />
              </Grid>
              <Grid item md={12}>
                <Divider className="divider" />
              </Grid>
              <Grid item md={12} className="sidebar-res">
                <div className="project-title">
                  <LayoutTypo> Projects</LayoutTypo>
                  {role === "A" ? (
                    <div
                      onClick={handleProjectCreate}
                      className="plus-icon custom-cursor"
                    >
                      <span className="span-plus-icon">
                        <DotIcon />
                      </span>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
                <div
                  className="tree-list"
                  onClick={() => {
                    setSetting(false);
                  }}
                >
                  <ParentNodeComponent
                    onChildData={handleChildData}
                    parentNode={parentNode}
                    _id={""}
                    projct_name={""}
                    handleAppDialog={showDialog}
                  />
                </div>
              </Grid>
              <Grid item md={12} className="sidebar-bottom-grid">
                <Wrappers className="sidebar-bottom-container">
                  {profileData?.user_img ? (
                    <div className="sidebar_user_profile_img">
                      <img src={profileData?.user_img ?? profileData?.data?.user_img} alt="user_img" />
                    </div>
                  ) : (
                    <div className="sidebar_user_profile_img_empty">
                      <img src={ProfileEmpty} alt="user_ig" />
                    </div>
                  )}
                  <SettingTypo className="sidebar-bottom-username">{profileData && profileData?.user_name}</SettingTypo>
                  <div className="custom-cursor threedot-pluseicon" onClick={(e: any) => handleSettings(e)}>
                    <strong className={
                      isPopoverOpen ? "threedot-icon-inline-top active-state-highlight-bg" : "threedot-icon-inline-top"
                    }>
                      <ThreeDot onClick={(e: void) => handleSettings(e)} />
                    </strong>
                  </div>
                </Wrappers>
              </Grid>
            </Grid>

            <Divider />

            <CustomPopover
              isOpenn={isPopoverOpen}
              onClose={handlePopoverClose}
              onSettingsClick={handleSettingChange}
              anchorEl={anchorEl}
            />
          </Drawer>
        </Grid>
        <Grid
          className={
            isOpen ? "top-bar-container is-side-bar-View" : "top-bar-container is-full-view"
          }
          item
          md={12}
          lg={12}
          sm={12}
        // sx={{
        //   width: isOpen ? "calc(100% - 900px)" : "100%",
        //   marginLeft: isOpen ? "calc(0% + 264px)" : "0%",
        // }}
        >
          {settingsPage ? (
            <Outlet />
          ) : (
            <>
              {isWorkload ? (
                <WorkloadSideBar />
              ) : isAppPage ? (
                <AppLanding />
              ) : manageUser ? (
                <>
                  <TopBar
                    currentBreadCrumbProject={projectData?.projectDtl?.find(
                      (val: any) => val?._id === projectId
                    )}
                    currentBreadCrumbRoute={"Manage Users"}
                    onButtonClick={""}
                    onCancel={""}
                    workload_name={""}
                  />
                  <div style={{ padding: "1.5rem" }}>
                    <RoleSettingsTables />
                  </div>
                </>
              ) : discoveryUser ? (
                <div>
                  <DiscoveryPage projectdata={projectdata} />
                </div>
              ) : ((parentNode?.length > 0 &&
                 !_.isNil(project_id) &&
                 ((location.pathname === '/overview' &&
                 location.search.startsWith("?projectId"))
                 || (projectView)))
              ) ? (
                <ProjectLanding
                  projectdata={projectdata}
                  handleEditAppData={handleEditAppData}
                  editProjectBooleanVal={editProjectBooleanVal}
                />
              ) : parentNode?.length > 0 && pathname === '/overview/settings' && settingsTables === '1' ? (
                <div style={{ display: "flex", padding: "20%" }}>
                  <RoleSettingsTables />
                </div>
              ) : projectData?.projectDtl && projectData?.projectDtl?.length === 0 ? (
                <div className="project-new">
                  <div className="project-icon">
                    <NewProject />
                  </div>

                  <ProjectTypo>Nothing created yet</ProjectTypo>
                  <ProjectDesc>
                    You haven't created any projects yet, let's
                  </ProjectDesc>
                  <ProjectDesc> leverage platform's full potential</ProjectDesc>
                  <div className="project-icons">
                    {role === "A" ? (
                      <Button
                        variant="outlined"
                        startIcon={<PlusIcon />}
                        className="create-new"
                        onClick={handleProjectCreate}
                      >
                        Create new
                      </Button>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              ): ''}
            </>
          )}{" "}
        </Grid>
        <DialogModal
          visible={dialogVisible}
          onHide={hideDialog}
          handleForm={handleCreateApp}
        />

        <DialogModal
          visible={editProjectBoolean}
          onHide={hideDialog}
          handleForm={handleEditApp}
        />

        <ProjectModal
          modalOpen={create}
          handleClose={handleClose}
          handleCreate={handleCreateProject}
          isEdit={false}
          editProject={null}
        />
        <ProjectEditModal
          modalOpen={false}
          handleClose={handleClose}
          handleCreate={handleCreateProject}
          isEdit={false}
          editProject={null}
          handleUpdate={handleUpdateProject}
          projectId={projectId}
        />
        <ConfirmLeaving
          isResource={isResource}
          leaveWorkloadScreen={leaveWorkloadScreen}
          stayOnWorkloadScreen={stayOnWorkloadScreen}
        />
        <MySnackbar
          className="snack-bar"
          message={message}
          severity={severity}
          open={snackOpen}
          onClose={handleSnackbarClose}
        />
      </Grid>
    </>
  );
};

export default Layout;
