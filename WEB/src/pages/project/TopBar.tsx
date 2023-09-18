import React, { useEffect, useState } from "react";
import "../../styles/project-styles/project.css";
import BackSlash from "../../assets/icons/BackSlash";
import { getQueryParam } from "../../helper/SearchParams";
import { useLocation, useNavigate } from "react-router-dom";
import ManageUserIcon from "../../assets/icons/ManageUserIcon";
import PlusIcon from "../../assets/icons/PlusIcon";
import ThreeDote from "../../assets/icons/ThreeDote";
import Popover from "@mui/material/Popover";
import EditProjectIcon from "../../assets/icons/EditeProjectIcon";
import DiscoveryIcon from "../../assets/icons/DiscoveryIcon";
import DeleteUserIcon from "../../assets/icons/DeleteProjectIcon";
import RbacPopover from "../../components/common/RbacPopover";
import ProjectEditModal from "./EditProject";
import { editProjectRequest } from "../../redux/slice/project-slice/EditProjectSlice";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "primereact/button";
import { ConfirmDialog } from "primereact/confirmdialog";
import { deleteAppRequest } from "../../redux/action/app-action/DeleteAppAction";
import { deleteProjectRequest } from "../../redux/slice/project-slice/DeleteProjectSlice";
import DialogModal from "../application/AppModal";
import { createAppRequest } from "../../redux/slice/app-slice/CreateProjectSlice";
import WorkloadCreate from "../workload/WorkloadCreate";
import { updateAppRequest } from "../../redux/slice/app-slice/UpdateAppSlice";
import CustomTooltip from "../../components/CustomTooltip";
import VisibleFeatures from "../../helper/visibleFeatures";
import { setaccessLevels } from "../../redux/action/auth-action/AccessLevelsAction";
import ProjectView from "../../assets/icons/ProjectView";
import { renameReset } from "../../redux/slice/workload-slice/renameWorkloadSlice";
import { Grid } from "@mui/material";
import Logo from "../../assets/images/logo.svg";
import LogoText from "../../assets/images/LogoText.svg";
import ConfirmLeaving from "../../components/ConfirmLeaving";
import _ from "lodash";
import { GetAppRequest } from "../../redux/slice/app-slice/GetAppInfoSlice";

const TopBar = ({
  currentBreadCrumbProject,
  currentBreadCrumbRoute,
  onButtonClick,
  onCancel,
  workload_name,
  initialProject,
}: {
  initialProject?: any;
  currentBreadCrumbRoute: any;
  currentBreadCrumbProject: any;
  onButtonClick: any;
  onCancel: any;
  workload_name: any;
}) => {
  const location = useLocation();
  const pathname = location.pathname;
  const isSettingsSection = pathname.includes("/settings");
  const isWorkloadScreen = pathname.includes("/overview/workload");
  const dispatch = useDispatch();
  const workload = getQueryParam("workload");
  const edit = getQueryParam("edit");
  const create = getQueryParam("create");
  const view = getQueryParam("view");
  const appId = getQueryParam("app_id");
  const discovery = getQueryParam("cloud-account");
  const projectId = getQueryParam("projectId");
  const [applicationDialog, setApplicationDialog] = useState(false);
  const [isProjectAction, setIsProjectAction] = useState<any>(false);
  const [isAppAction, setIsAppAction] = useState<any>(false);
  const [projectDeleteOpen, setProjectDeleteOpen] = useState<any>(false);
  const [applicationDeleteOpen, setApplicationDeleteOpen] =
    useState<any>(false);
  const [appUpdateDialogVisible, setAppUpdateDialogVisible] =
    useState<any>(false);
  const [isResource, setIsResource] = useState<boolean>(false);
  const [clickedBreadcrumb, setClickedBreadcrumb] = useState<Record<string, string> | null>(null);
  const [isWorkLoadModal, setIsWorkLoadModal] = useState(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [editProjectDetails, setEditProjectDetails] = useState<any>({});
  const [editApplicationDetails, setEditApplicationDetails] = useState<any>({});
  const manageuser = getQueryParam("manageuser");
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const { projectData } = useSelector((state: any) => state.getProject);

  const breadcrumbs: any[] = [];
  if (currentBreadCrumbProject) {
    breadcrumbs.push(currentBreadCrumbProject);
  } else {
    breadcrumbs.push(initialProject);
  }
  if (currentBreadCrumbRoute) breadcrumbs.push(currentBreadCrumbRoute);
  if (workload_name) breadcrumbs.push(workload_name);

  useEffect(() => {
    dispatch(renameReset())
  }, [])


  const handleNavigation = (breadcrumb: Record<string, string>): void => {
    if (JSON.parse(localStorage.getItem('is_resource')!) &&
      isWorkloadScreen
    ) {
      setIsResource(true);
      setClickedBreadcrumb(breadcrumb);
      return
    }
    switch (breadcrumb?._id) {
      case appId:
        navigate(
          `/overview?application-landing=true&app_id=${appId}&projectId=${breadcrumbs[0]?._id}`
        );
        break;
      case projectId:
        navigate(`/overview?projectId=${breadcrumbs[0]?._id}`);
        break;
      default:
        break;
    }
  };

  const accessLevels = VisibleFeatures(breadcrumbs[0]?._id);

  useEffect(() => {
    if (accessLevels) {
      dispatch(setaccessLevels(accessLevels));
    }
  }, [accessLevels, dispatch]);

  const handleProjectMenuClick = (event: any) => {
    setIsProjectAction(true);
    setAnchorEl(event.currentTarget);
  };

  const handleAppMenuClick = (event: any) => {
    setIsAppAction(true);
    setAnchorEl(event.currentTarget);
  };

  const handleProjectClose = () => {
    setAnchorEl(null);
    setIsProjectAction(false);
    setModalOpen(false);
  };

  const handleAppClose = () => {
    setAnchorEl(null);
    setIsAppAction(false);
    setModalOpen(false);
  };

  const handleEditProject = (projectData: Record<string, any>) => {
    if (_.isNil(projectData)) return;
    setModalOpen(true);
    setEditProjectDetails(projectData);
    if (discovery) {
      navigate(`?cloud-account=true&projectId=${projectData?._id}`)
    } else if (manageuser) {
      navigate(`?manageuser=true&projectId=${projectData?._id}`)
    } else {
      navigate(`?projectId=${projectData?._id}`)
    }
  };

  const handleEditApp = (appDetails: Record<string, any>) => {
    navigate(
      `?application-landing=true&app_id=${appDetails?._id}&projectId=${breadcrumbs[0]?._id}&app_edit=true`
    );
    setIsAppAction(false);
    setAppUpdateDialogVisible(true);
    setEditApplicationDetails(appDetails);
    dispatch(GetAppRequest(appDetails?._id));
  };

  const handleDeleteProject = (projectData: Record<string, any>) => {
    setProjectDeleteOpen(true);
    setAnchorEl(null);
    setIsProjectAction(false);
    setEditProjectDetails(projectData);
  };

  const handleDeleteApp = (appDetails: Record<string, any>) => {
    setIsAppAction(false);
    setEditApplicationDetails(appDetails);
    setApplicationDeleteOpen(true);
  };

  const handleProjectDelete = () => {
    setProjectDeleteOpen(false);
    dispatch(deleteProjectRequest(editProjectDetails?._id));
    navigate("/overview");
  };

  const handleApplicationDelete = () => {
    setApplicationDeleteOpen(false);
    dispatch(deleteAppRequest(appId!));
    navigate(`/overview?=${breadcrumbs[0]?._id}`);
  };

  const handleCreateApp = (values: any) => {
    let createAppObj: any = {
      project_id: breadcrumbs[0]?._id,
      app_name: values?.applicationName,
      description: values?.description,
    };
    const formData = new FormData();

    formData.append("File", values?.file);
    formData.append("appData", JSON.stringify(createAppObj));

    const appData = new FormData();
    appData.append("appData", JSON.stringify(createAppObj));

    dispatch(createAppRequest(formData));
  };

  const handleUpdateApp = (values: any) => {
    let createAppObj: any = {
      app_name: values?.applicationName,
      description: values?.description,
      project_id: breadcrumbs[0]?._id,
      ...(values?.file === null  &&{imageremove: true}),
      ...(values?.file   &&{imageremove: false}),
    };
    const formData = new FormData();

    formData.append("File", values?.file);
    formData.append("appData", JSON.stringify(createAppObj));

    const appData = new FormData();
    appData.append("appData", JSON.stringify(createAppObj));

    dispatch(updateAppRequest(formData));
  };

  const handleUpdateProject = (appDetails: Record<string, any>) => {
    const updateProjectRequest = {
      project_id: breadcrumbs[0]?._id,
      name: appDetails.name,
      description: appDetails.description,
    };
    dispatch(editProjectRequest(updateProjectRequest));
    setIsProjectAction(false);
    setModalOpen(false);
    setAnchorEl(null);
  };

  const stayOnWorkloadScreen = (): void => {
    localStorage.setItem('is_resource', JSON.stringify(false));
    if (clickedBreadcrumb) {
      handleNavigation(clickedBreadcrumb);
    }
  };

  const leaveWorkloadScreen = (): void => {
    setIsResource(false)
  };

  return (
    <div className="resposive-topbar-fixed">
      <div className="responsive-topbar">
        <Grid container className="header-container">
          <Grid className="responsive-header-tenant-logo" item md={12}>
            <img
              className="custom-cursor tenent-logo"
              // onClick={handelClickOverview}
              src={Logo}
              alt="tenant logo"
            />
            <img
              // onClick={handelClickOverview}
              src={LogoText}
              className="header-tenant-name custom-cursor"
              alt="tenant name"
            />
          </Grid>
        </Grid>
      </div>
      <div className="topBar">
        <div className="topBar-contents">
          <div className="topBar-heading">
            {breadcrumbs.map((breadcrumb, index) => (
              <React.Fragment key={index}>
                {index > 0 && (
                  <span className="topBar-heading-backslash">
                    <BackSlash />
                  </span>
                )}
                                <CustomTooltip
                  title={breadcrumb?.project_name ||
                    breadcrumb?.project?.name ||
                    breadcrumb?.app_name ||
                    breadcrumb?.application_name ||
                    breadcrumb}
                  placement="top"
                >
                <span
                  className={
                    index === breadcrumbs.length - 1
                      ? `active-breadcrumb ${workload ? 'custom-cursor-breadcrumb-res-workload' : index == 0 ? 'custom-cursor-breadcrumb-single' : 'custom-cursor-breadcrumb-res'}`
                      : `custom-cursor ${workload ? 'custom-cursor-breadcrumb-res-workload' : 'custom-cursor-breadcrumb-res'}`
                  }
                >
                  {index !== breadcrumbs.length - 1 && (
                    <span onClick={() => handleNavigation(breadcrumb)}>
                      {breadcrumb?.project_name ||
                        breadcrumb?.project?.name ||
                        breadcrumb?.app_name ||
                        breadcrumb?.application_name ||
                        breadcrumb ||
                        ""}
                    </span>
                  )}
                  {
                    <>
                      {index === breadcrumbs.length - 1 && (
                        <span>
                          {breadcrumb?.project_name ||
                            breadcrumb?.project?.name ||
                            breadcrumb?.app_name ||
                            breadcrumb?.application_name ||
                            breadcrumb ||
                            ""}
                        </span>
                      )}
                    </>
                  }
                </span>
                </CustomTooltip>
              </React.Fragment>
            ))}
          </div>
          {workload && (edit ?? create ?? view) && (
            <div className="workload-block">
              <button className="canvas-button-cancel" onClick={onCancel}>
                Cancel
              </button>
              {view ? (
                ""
              ) : (
                <button
                  className="canvas-button-update-create"
                  onClick={onButtonClick}
                >
                  {edit ? "Update" : "Create"}
                </button>
              )}
            </div>
          )}
          {!appId && !isSettingsSection && (
            <div className="workload-block">
              {discovery && accessLevels?.createApplicationLevelRbac && (
                <span
                  className="graph-container"
                  onClick={() => setApplicationDialog(true)}
                >
                  <span className="position-app-icon">
                    <PlusIcon />
                  </span>
                  <button className="p-l-29 canvas-button-create">
                    <span className="res-new-application">New Application</span>
                  </button>
                </span>
              )}
              {!manageuser && accessLevels?.createProjectLevelRbac && (
                <CustomTooltip title={"Manage Users"} placement="bottom">
                  <span
                    onClick={() => {
                      navigate(
                        `/overview?manageuser=true&projectId=${breadcrumbs[0]?._id}`
                      );
                    }}
                    className="custom-cursor threedot-icon-inline-top"
                  >
                    <ManageUserIcon />
                  </span>
                </CustomTooltip>
              )}
              <span className="custom-cursor">
                <span
                  className={
                    isProjectAction
                      ? "custom-cursor threedot-icon-inline-top active-menu-bar"
                      : "custom-cursor threedot-icon-inline-top"
                  }
                  onClick={(event) => handleProjectMenuClick(event)}
                >
                  <ThreeDote />
                </span>
                <>
                  <Popover
                    className="topbar-create-project-poppover"
                    id={id}
                    open={isProjectAction}
                    anchorEl={anchorEl}
                    onClose={handleProjectClose}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "center",
                    }}
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "center",
                    }}
                  >
                    <RbacPopover
                      menuItems={[
                        {
                          icon: <EditProjectIcon />,
                          label: "Edit Project",
                          accessLevel: "project_access_lvl",
                          requiredPermissions: ["edit"],
                          onClick: () => handleEditProject(breadcrumbs[0]),
                        },
                        {
                          icon: discovery ? <ProjectView /> : <DiscoveryIcon />,
                          label: discovery ? "Project View" : "Discovery",
                          accessLevel: "project_access_lvl",
                          requiredPermissions: ["view"],
                          onClick: () => {
                            if (discovery) {
                              navigate(
                                `/overview?project-view=true&projectId=${breadcrumbs[0]?._id}`
                              );
                            } else {
                              navigate(
                                `/overview?cloud-account=true&projectId=${breadcrumbs[0]?._id}`
                              );
                            }
                          },
                        },
                        {
                          icon: manageuser ? <ProjectView /> : <ManageUserIcon />,
                          label: manageuser ? "Project view" : "Manage Users",
                          accessLevel: "project_access_lvl",
                          requiredPermissions: ["create"],
                          onClick: () => {
                            if (manageuser) {
                              navigate(
                                `/overview?project-view=true&projectId=${breadcrumbs[0]?._id}`
                              );
                            } else {
                              navigate(
                                `/overview?manageuser=true&projectId=${breadcrumbs[0]?._id}`
                              );
                            }
                          },
                        },
                        {
                          icon: <DeleteUserIcon />,
                          label: "Delete Project",
                          accessLevel: "project_access_lvl",
                          requiredPermissions: ["delete"],
                          itemClassName: "delete-project-name",
                          onClick: () => handleDeleteProject(breadcrumbs[0]),
                        },
                      ]}
                      roleName={
                        projectData?.projectDtl?.find(
                          (val: any) => val?._id === breadcrumbs[0]?._id
                        )?.roledtl?.role_name
                      }
                    />
                  </Popover>
                </>
              </span>
            </div>
          )}
          {appId && !workload && (
            <div className="workload-block">
              {accessLevels?.createWorkLoadLevelRbac && (
                <span
                  className="graph-container"
                  onClick={() => setIsWorkLoadModal(true)}
                >
                  <span className="position-app-icon">
                    <PlusIcon />
                  </span>
                  <button className="p-l-29 canvas-button-create">
                    New Workload
                  </button>
                </span>
              )}
              {(accessLevels?.editApplicationLevelRbac ||
                accessLevels?.deleteApplicationLevelRbac) && (
                <span className="custom-cursor">
                  <span
                    className={
                      isAppAction
                        ? "custom-cursor threedot-icon-inline-top active-menu-bar"
                        : "custom-cursor threedot-icon-inline-top"
                    }
                    onClick={(event) => handleAppMenuClick(event)}
                  >
                    <ThreeDote />
                  </span>
                </span>
              )}
              <>
                <Popover
                  className="topbar-create-project-poppover"
                  id={id}
                  open={isAppAction}
                  anchorEl={anchorEl}
                  onClose={handleAppClose}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "center",
                  }}
                >
                  <RbacPopover
                    menuItems={[
                      {
                        icon: <EditProjectIcon />,
                        label: "Edit Application",
                        accessLevel: "app_access_lvl",
                        requiredPermissions: ["edit"],
                        onClick: () => handleEditApp(breadcrumbs[1]),
                      },
                      {
                        icon: <DeleteUserIcon />,
                        label: "Delete Application",
                        accessLevel: "app_access_lvl",
                        requiredPermissions: ["delete"],
                        itemClassName: "delete-project-name",
                        onClick: () => handleDeleteApp(breadcrumbs[1]),
                      },
                    ]}
                    roleName={
                      projectData?.projectDtl?.find(
                        (val: any) => val?._id === breadcrumbs[0]?._id
                      )?.roledtl?.role_name
                    }
                  />
                </Popover>
              </>
            </div>
          )}
        </div>
        <ProjectEditModal
          modalOpen={modalOpen}
          handleClose={handleProjectClose}
          handleCreate={false}
          isEdit={null}
          editProject={editProjectDetails}
          handleUpdate={handleUpdateProject}
          projectId={breadcrumbs[0]?._id}
        />
        <DialogModal
          visible={applicationDialog}
          onHide={() => setApplicationDialog(false)}
          handleForm={handleCreateApp}
        />
        <WorkloadCreate
          visible={isWorkLoadModal}
          onHide={() => setIsWorkLoadModal(false)}
          renameFlag={false}
          workloadData={""}
          showSnackbar={true}
          appid={appId!}
          projectid={breadcrumbs[0]?._id!}
          setShowSnackbar={""}
        />
        <DialogModal
          visible={appUpdateDialogVisible}
          onHide={() => setAppUpdateDialogVisible(false)}
          handleForm={handleUpdateApp}
        />
        <ConfirmDialog
          className="confirm-dialog-cloud-onboarding"
          visible={projectDeleteOpen}
          onHide={() => setProjectDeleteOpen(false)}
          accept={() => setProjectDeleteOpen(false)}
          reject={handleProjectDelete}
          acceptLabel={"No, Keep It"}
          rejectLabel={"Yes, Delete"}
          position="center"
          message={
            <>
              <span className="confirm-dialog-normal">
                Are you sure want to delete the{" "}
                <span className="confirm-dialog-italic">
                  {editProjectDetails?.project_name ||
                    editProjectDetails?.project?.name}
                </span>{" "}
                project, all the data will be lost
              </span>
            </>
          }
          header="Delete Project"
          icon="pi pi-exclamation-triangle"
        >
          <template>
            <div className="p-d-flex p-jc-between">
              <Button className="p-button-text">No, Keep it</Button>
              <Button className="p-button-text">Yes, Delete</Button>
            </div>
          </template>
        </ConfirmDialog>

        <ConfirmDialog
          className="confirm-dialog-cloud-onboarding"
          visible={applicationDeleteOpen}
          onHide={() => setApplicationDeleteOpen(false)}
          accept={() => setApplicationDeleteOpen(false)}
          reject={handleApplicationDelete}
          acceptLabel={"No, Keep It"}
          rejectLabel={"Yes, Delete"}
          position="center"
          message={
            <>
              <span className="confirm-dialog-normal">
                Are you sure want to delete the{" "}
                <span className="confirm-dialog-italic">
                  {editApplicationDetails?.application_name}
                </span>{" "}
                application, all the data will be lost
              </span>
            </>
          }
          header="Delete application"
          icon="pi pi-exclamation-triangle"
        >
          <template>
            <div className="p-d-flex p-jc-between">
              <Button className="p-button-text">No, Keep it</Button>
              <Button className="p-button-text">Yes, Delete</Button>
            </div>
          </template>
        </ConfirmDialog>
        <ConfirmLeaving
          isResource={isResource}
          leaveWorkloadScreen={leaveWorkloadScreen}
          stayOnWorkloadScreen={stayOnWorkloadScreen}
        />
      </div>
    </div>
  );
};

export default TopBar;
