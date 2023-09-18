import React, { useState } from "react";
import { Button, List, ListItem } from "@mui/material";
import "../../styles/project-styles/project.css";
import { FolderIcon } from "../../assets/icons/FolderIcon";
import { DotIcon } from "../../assets/icons/DotIcon";
import ThreeDote from "../../assets/icons/ThreeDote";
import Popover from "@mui/material/Popover";
import { useEffect } from "react";
import ProjectModal from "./ProjectModal";
import {
  deleteProjectRequest,
  deleteProjectReset,
} from "../../redux/slice/project-slice/DeleteProjectSlice";
import MySnackbar from "../../helper/SnackBar";
import DeleteUserIcon from "../../assets/icons/DeleteProjectIcon";
import ManageUserIcon from "../../assets/icons/ManageUserIcon";
import DiscoveryIcon from "../../assets/icons/DiscoveryIcon";
import { useDispatch, useSelector } from "react-redux";
import { getProjectRequest } from "../../redux/slice/project-slice/GetProjectSlice";
import TreeArrowRight from "../../assets/icons/TreeArrowRight";
import TreeArrowDown from "../../assets/icons/TreeArrowDown";
import ProjectEditModal from "./EditProject";
import { editProjectRequest } from "../../redux/slice/project-slice/EditProjectSlice";
import { useNavigate } from "react-router-dom";
import RbacPopover from "../../components/common/RbacPopover";
import { Projects } from "../../redux/@types/project-types/GetProjectTypes";
import EditProjectIcon from "../../assets/icons/EditeProjectIcon";
import DialogModal from "../application/AppModal";
import { getQueryParam } from "../../helper/SearchParams";
import { appListRequest, appListReset } from "../../redux/slice/app-slice/AppListSlice";
import { updateAppRequest } from "../../redux/slice/app-slice/UpdateAppSlice";
import { deleteAppRequest } from "../../redux/action/app-action/DeleteAppAction";
import { deleteAppReset } from "../../redux/slice/app-slice/DeleteAppSlice";
import { getProjectInfoRequest } from "../../redux/action/project-action/GetProjectInfoAction";
import ReactDOMServer from "react-dom/server";
import { ReactComponent as EmtyAPP } from "../../assets/icons/EmtyAPP.svg";
import CustomTooltip from "../../components/CustomTooltip";
import { ConfirmDialog } from "primereact/confirmdialog";
import ProjectView from "../../assets/icons/ProjectView";
import _ from "lodash";
import { setProjectID } from "../../redux-local/AppNames";
import { createProjectReset } from "../../redux/slice/project-slice/CreateProjectSlice";
import { useLocation } from 'react-router-dom';
import { GetAppRequest } from "../../redux/slice/app-slice/GetAppInfoSlice";
import { createAppReset } from "../../redux/slice/app-slice/CreateProjectSlice";
import { getLocalStorage } from "../../helper/LocalStorage";
import ConfirmLeaving from "../../components/ConfirmLeaving";

interface ParentNodeProps {
  parentNode: Projects["data"]["projectDtl"];
  _id: string;
  projct_name: string;
  onChildData: (data: any) => void;
  handleAppDialog: any;
}

export const ParentNodeComponent = ({
  parentNode,
  onChildData,
  handleAppDialog,
}: ParentNodeProps) => {
  const location = useLocation();
  const pathname = location.pathname;
  const isWorkloadScreen = pathname.includes("/overview/workload");
  const dispatch = useDispatch();
  const [Iconopen, setIconOpen] = useState(false);
  const [isProjectAction, setIsProjectAction] = useState<any>(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [editProject, setEditProject] =
    useState<any>(); /*Project specific node*/
  const appEdit: string = getQueryParam("app_edit")!;
  const discovery = getQueryParam("cloud-account");
  const manageuser = getQueryParam("manageuser");
  const appLanding = getQueryParam("application-landing");
  const [editApp, setEditApp] = useState<any>();
  const [deleteId, setDeleteId] = useState<any>();
  const [severity, setSeverity] = useState("");
  const [message, setMessage] = useState("");
  const [snackOpen, setSnackOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [expandedProject, setExpandedProject] = useState<any | null>(null);
  const [applicationList, setApplicationList] = useState<any[]>([]);
  const [deleteOpen, setDeleteOpen] = useState<any>();
  const project_id: any = getQueryParam("projectId");
  const project_view = getQueryParam("project-view");
  const appId: any = getQueryParam("app_id");
  const EMTYAPPLICATION = `data:image/svg+xml;base64,${btoa(
    ReactDOMServer.renderToString(<EmtyAPP />)
  )}`;
  const [isAppAction, setIsAppAction] = useState<any>(false);
  const hideDialog = () => {
    setDialogVisible(false);
  };
  const navigate = useNavigate();

  useEffect(() => {
    onChildData(editProject);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editProject])

  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );
  const userId = getLocalStorage("userId");
  const [projectId, setProjectId] = useState<any>();
  const [projectRoute, setProjectRoute] = useState<any>();

  const [appRoute, setAppRoute] = useState<any>();
  const { DeleteProject, error } = useSelector(
    (state: any) => state.deleteProject
  );
  const { projectData } = useSelector((state: any) => state.getProject);
  const { appListData } = useSelector((state: any) => state.appList);
  const { appData } = useSelector((state: any) => state.createApp);
  const { appData: selectedApplication } = useSelector((state: any) => state.GetApp);
  const { createSuccess } = useSelector((state: any) => state.createProject);
  const { updateSuccess } = useSelector(
    (state: any) => state.updateApp
  );
  const { DeleteApp, deleteAppError } = useSelector(
    (state: any) => state.deleteApp
  );
  const [isResource, setIsResource] = useState<boolean>(false);
  const [isProjectRowSelect, setIsProjectRowSelect] = useState<any>(null);
  const [isProjectMenu, setIsProjectMenu] = useState<any>(null);
  const [isDiscovery, setIsDiscovery] = useState<any>(null);
  const [isHandleManageUsers, setIsHandleManageUsers] = useState<boolean>(false);
  const [isHandleAddNewProject, setIsHandleAddNewProject] = useState<any>(null);
  const [isHandleApplication, setIsHandleApplication] = useState<any>(null);

  useEffect(() => {
    const role_name = projectData?.projectDtl?.find(
      (data: Record<string, any>) => data?._id === project_id
    )?.roledtl?.role_name;
    dispatch(
      appListRequest({
        project_id,
        role_name,
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appData, updateSuccess, DeleteApp, projectData]);

  useEffect(() => {
    if (DeleteApp) {
      setSeverity("success");
      setSnackOpen(true);
      setMessage("Application deleted successfully !");
    } else if (deleteAppError) {
      setSeverity(error);
      setSnackOpen(false);
      setMessage(deleteAppError);
    }
    return () => {
      dispatch(deleteAppReset());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [DeleteApp, deleteAppError]);

  const handleClose = () => {
    setAnchorEl(null);
    setIsProjectAction(false);
    setModalOpen(false);
    setIsAppAction(false);
  };
  useEffect(() => {
    if (DeleteProject) {
      setMessage("Project Deleted Succesfully");
      setSeverity("success");
      setSnackOpen(true);
      dispatch(getProjectRequest());
    } else if (error) {
      setMessage(error);
      setSeverity("error");
      setSnackOpen(true);
    }
    return () => {
      dispatch(deleteProjectReset());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [DeleteProject, error]);

  useEffect(() => {
    setApplicationList(appListData);
  }, [appListData]);

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  const handleProjectAction = (event: any, node: any) => {
    setIsProjectAction(true);
    setAnchorEl(event.currentTarget);
    setEditProject(node);
    setProjectId(node?._id);
    if (expandedProject?._id !== node?._id) {
      navigate(`/overview?projectId=${node?._id}`);
      setExpandedProject(node);
    }
  };

  const handleProjectLanding = (event: any, node: any) => {
    setAnchorEl(event.currentTarget);
    setEditProject(node);
    setDeleteId(node?._id ?? project_id);
    setProjectId(node?._id);
    navigate(`/overview?projectId=${node?._id}`);
  };

  const handleClicke = (event: any, node: any) => {
    if (expandedProject?._id === node?._id) {
      // If the project is already expanded, collapse it
      setExpandedProject(null);
      setAnchorEl(event.currentTarget);
    } else {
      if (JSON.parse(localStorage.getItem('is_resource')!) &&
        isWorkloadScreen) {
        setIsResource(true);
        setIsProjectRowSelect({
          event,
          node
        });
        setIsProjectMenu(null);
        setIsDiscovery(null);
        setIsHandleManageUsers(false);
        setIsHandleAddNewProject(null);
        setIsHandleApplication(null);
        return
      }
      dispatch(appListReset())
      setAnchorEl(event.currentTarget);
      setIconOpen(!Iconopen);
      setExpandedProject(node);
      dispatch(
        appListRequest({
          project_id: node?._id,
          role_name: node?.roledtl?.role_name,
        })
      );
    }
  };
  const handleEditProject =
    (
      node: Projects["data"]["projectDtl"][number]
    ): React.MouseEventHandler<HTMLDivElement> =>
    (event) => {
      setModalOpen(true);
      setIsProjectAction(false);
      if (expandedProject?._id !== projectRoute?._id) {
        navigate(`/overview?projectId=${projectRoute?._id}&projectUpdate=true`);
      }
    };

  const handleEditApp = () => {
    navigate(
      `/overview?application-landing=true&app_id=${appRoute?._id}&projectId=${editProject?._id}&app_edit=true`
    );
    setIsAppAction(false);
    //  dispatch(updateAppRequest(node?._id));
    setDialogVisible(true);
  };
  const handleDeleteApp = (application: any) => {
    setDeleteOpen(true);
    setIsAppAction(false);
  };

  const handleDeleteProject =
    (deleteId: string): React.MouseEventHandler<HTMLDivElement> =>
    (event) => {
      setDialogOpen(true);
      setIsProjectAction(false);
    };
  const handleSnackbarClose = () => {
    setSnackOpen(false);
  };
  const handleCloseDialog = () => {
    setDialogOpen(false);
    setDeleteOpen(false);
  };
  const handleConfirm = () => {
    setExpandedProject(null);
    dispatch(deleteProjectRequest(deleteId ?? project_id));
    setIsProjectAction(false);
    setDialogOpen(false);
    handleCloseDialog();
    const findInitialProject = projectData?.projectDtl?.filter(({_id}: {_id: string}) => (deleteId ?? project_id) !== _id);
    if (!_.isNil(findInitialProject) && findInitialProject?.length > 0) {
      navigate(`/overview?projectId=${findInitialProject?.[0]?._id}`);
      dispatch(getProjectInfoRequest(findInitialProject?.[0]?._id));
    } else {
      navigate(`/overview`);
    }
  };
  const handleUpdateProject = (values: any) => {
    dispatch(editProjectRequest(values));
    setIsProjectAction(false);
    setDialogOpen(false);
    setModalOpen(false);
  };

  const handleManageUsers = () => {
    if (JSON.parse(localStorage.getItem('is_resource')!) &&
      isWorkloadScreen
    ) {
      setIsResource(true);
      setIsProjectRowSelect(null);
      setIsProjectMenu(null);
      setIsDiscovery(null);
      setIsHandleManageUsers(true);
      setIsHandleAddNewProject(null);
      setIsHandleApplication(null);
      return
    }
    if (manageuser) {
      navigate(
        `/overview?project-view=true&projectId=${editProject?._id}`
      );
    } else {
      navigate(
        `/overview?manageuser=true&projectId=${editProject?._id}`
      );
    }
    setIsProjectAction(false);
  };
  const handleApplication = (application: any) => {
    if (JSON.parse(localStorage.getItem('is_resource')!) &&
      isWorkloadScreen
    ) {
      setIsHandleApplication(application);
      setIsResource(true);
      setIsProjectRowSelect(null);
      setIsProjectMenu(null);
      setIsDiscovery(null);
      setIsHandleManageUsers(false);
      setIsHandleAddNewProject(null);
      return
    }
    navigate(
      `/overview?application-landing=true&app_id=${
        application?.application
          ? application.application?._id
          : application?._id
      }&projectId=${project_id ?? expandedProject?._id}`
    );
    setEditApp(application);
  };
  const handleAppAction = (event: any, application: any) => {
    if (JSON.parse(localStorage.getItem('is_resource')!) &&
      isWorkloadScreen
    ) {
      setIsHandleApplication(application);
      setIsResource(true);
      setIsProjectRowSelect(null);
      setIsProjectMenu(null);
      setIsDiscovery(null);
      setIsHandleManageUsers(false);
      setIsHandleAddNewProject(null);
      return
    }
    navigate(
      `/overview?application-landing=true&app_id=${
        application?.application
          ? application.application?._id
          : application?._id
      }&projectId=${project_id ?? expandedProject?._id}`
    );
    setIsAppAction(true);
    setAnchorEl(event.currentTarget);
    //setEditProject(application);
    //setDeleteId(application?._id);
  };
  const handleEditAppCallBack = (values: any) => {
    let createAppObj: any = {
      app_name: values?.applicationName,
      description: values?.description,
      project_id: project_id,
      ...(values?.file === null  &&{imageremove: true}) ,
      ...(values?.file   &&{imageremove: false}) ,
    };
    const formData = new FormData();

    formData.append("File", values?.file);
    formData.append("appData", JSON.stringify(createAppObj));

    const appData = new FormData();
    appData.append("appData", JSON.stringify(createAppObj));

    dispatch(updateAppRequest(formData));
  };
  const handleDeleteConfirm = () => {
    setDeleteOpen(false);
    dispatch(deleteAppRequest(appId));
    navigate(`/overview?projectId=${projectId ?? project_id}`);
  };
  const handleDiscovery =
    (node: any): React.MouseEventHandler<HTMLDivElement> =>
    (event) => {
      if (discovery) {
        navigate(`/overview?project-view=true&projectId=${editProject?._id}`);
      } else {
        if (JSON.parse(localStorage.getItem('is_resource')!) &&
          isWorkloadScreen && expandedProject?._id !== node?._id) {
          setIsResource(true);
          setIsProjectRowSelect(null);
          setIsProjectMenu(null);
          setIsDiscovery(node);
          setIsHandleManageUsers(false);
          setIsHandleAddNewProject(null);
          setIsHandleApplication(null);
          return
        }
        navigate(`/overview?cloud-account=true&projectId=${editProject?._id}`);
      }
      setIsProjectAction(false);
    };

  

  const handleProjectMenu = (event: any, node: any) => {
    if (JSON.parse(localStorage.getItem('is_resource')!) &&
      isWorkloadScreen && expandedProject?._id !== node?._id) {
      setIsResource(true);
      setIsProjectRowSelect(null);
      setIsProjectMenu({
        event,
        node
      });
      setIsDiscovery(null);
      setIsHandleManageUsers(false);
      setIsHandleAddNewProject(null);
      setIsHandleApplication(null);
      return
    }
    handleProjectAction(event, node)
    setDeleteId(node?._id ?? project_id);
    setProjectRoute(node)
    if (expandedProject?._id !== node?._id) {
      dispatch(getProjectInfoRequest(node?._id));
    }
  };

  const handleAddNewProject = (event: React.MouseEvent<HTMLElement>, node: any) => {
    // navigate(`/overview?projectId=${node?._id}`);
    if (JSON.parse(localStorage.getItem('is_resource')!) &&
      isWorkloadScreen) {
      setIsResource(true);
      setIsProjectRowSelect(null);
      setIsProjectMenu(null);
      setIsDiscovery(null);
      setIsHandleManageUsers(false);
      setIsHandleAddNewProject({
        event,
        node
      });
      setIsHandleApplication(null);
      return
    }

    if(appId){
    navigate(`/overview?application-landing=true&app_id=${appId}&projectId=${project_id}`);
    }
    dispatch(getProjectInfoRequest(node?._id));
    handleProjectAction(event, node);
    handleAppDialog();
    setIsProjectAction(false);
  };

  const handleProjectRowSelect = (
    event: React.MouseEvent<HTMLElement>,
    node: any
  ) => {
    handleClicke(event, node);
    if (expandedProject?._id !== node?._id) {
      if (JSON.parse(localStorage.getItem('is_resource')!) &&
        isWorkloadScreen
      ) {
        setIsResource(true);
        setIsProjectRowSelect({
          event,
          node
        });
        setIsProjectMenu(null);
        setIsDiscovery(null);
        setIsHandleManageUsers(false);
        setIsHandleAddNewProject(null);
        setIsHandleApplication(null);
        return
      }
      handleProjectLanding(event, node);
      setApplicationList([]);
      dispatch(getProjectInfoRequest(node?._id));
    }
  };

  // *pass project id*//
  const handlProjectClick = (project_id: any) => {
    dispatch(setProjectID(project_id));
  };

  const handleNavigation = (expandedProject: Record<string, any>): void => {
    navigate(`/overview?projectId=${expandedProject._id}`);
  };

  useEffect(() => {
    if (parentNode?.length > 0) {
      const firstProjectId = parentNode[0]._id;
      handlProjectClick(firstProjectId);
    }
    if ( location.pathname !== "/overview/settings" && location.pathname === '/overview' && userId && !project_view) {
      if (!_.isNil(createSuccess) && parentNode?.length > 0) {
        if (!discovery && !manageuser && !appLanding) {
          const expandedProject = parentNode.at(-1);
          setExpandedProject(expandedProject);
          handleNavigation(expandedProject!);
        }
        dispatch(createProjectReset());
      } else if (_.isNil(project_id) && parentNode?.length > 0) {
        const expandedProject = parentNode.at(0);
        setExpandedProject(expandedProject!);
        handleNavigation(expandedProject!);
        setEditProject(expandedProject);
      } else if (!_.isNil(project_id) && parentNode?.length > 0) {
        const expandedProject = parentNode.find(({ _id }) => _id === project_id);
        if (expandedProject) {
          setExpandedProject(expandedProject);
          setEditProject(expandedProject);
          if (appId && applicationList?.length > 0) {
            setEditApp(applicationList?.find(({ _id }) => _id === appId));
            if (appEdit) {
              dispatch(GetAppRequest(appId));
            }
          }
        }
      }
    } else if (location.pathname !== "/overview/settings" && location.pathname === '/overview/workload' && userId) {
      const expandedProject = parentNode.find(({ _id }) => _id === project_id);
      if (expandedProject) {
        setExpandedProject(expandedProject);
        if (appId && applicationList?.length > 0) {
          setEditApp(applicationList?.find(({ _id }) => _id === appId))
          dispatch(GetAppRequest(appId))
        }
      };
    } else {
      dispatch(createProjectReset());
    }

    if ( location.pathname !== "/overview/settings" && location.pathname === '/overview' && applicationList?.length > 0 && appData && userId) {
      const newApplication = applicationList?.find(({ _id }) => appData?.data?._id === _id);
      navigate(
        `/overview?application-landing=true&app_id=${newApplication?._id}&projectId=${project_id}`
      );
      dispatch(createAppReset());
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parentNode, applicationList, userId, appId])

  const stayOnWorkloadScreen = (): void => {
    localStorage.setItem('is_resource', JSON.stringify(false));
    if (isProjectRowSelect) {
      handleProjectRowSelect(isProjectRowSelect?.event, isProjectRowSelect?.node)
    } else if (isProjectMenu) {
      handleProjectMenu(isProjectMenu?.event, isProjectMenu?.node)
    } else if (isDiscovery) {
      navigate(`/overview?cloud-account=true&projectId=${editProject?._id}`);
      handleDiscovery(isDiscovery?.node);
    } else if (isHandleManageUsers) {
      handleManageUsers()
    } else if (isHandleAddNewProject) {
      handleAddNewProject(isHandleAddNewProject?.event, isHandleAddNewProject?.node)
    } else if (isHandleApplication) {
      handleApplication(isHandleApplication)
    }
  };

  const leaveWorkloadScreen = (): void => {
    setIsResource(false)
  };
  

  return (
    <div className="tree-view">
      <List
        className="list-scroll"
        sx={{
          display: "flex !important",
          justifycontent: "space-around!important",
          flexDirection: "column !important",
          fontSize: "13px !important",
          fontFamily: "Inter !important",
          fontWeight: "20 !important",
        }}
      >
        {parentNode?.map((node, index) => {
          const handleClickEditProject = handleEditProject(node);
          const handleClickDeleteProject = handleDeleteProject(node?._id);
          const handleClickDiscovery = handleDiscovery(node);
          return (
            <div key={node?._id}>
              <div>
                <CustomTooltip
                  title={node?.project?.name ?? node?.project_name}
                  placement="top"
                >
                  <ListItem
                    className={
                      expandedProject?._id === node?._id
                        ? "project-view active-state-bg"
                        : "project-view"
                    }
                  >
                    <div
                      className="icon-folder-text"
                      onClick={(event) => {
                        handleProjectRowSelect(event, node);
                        handlProjectClick(node._id);
                      }}
                    >
                      <strong
                        className="icon-folder-text-inline"
                        // onClick={(event) => handleClicke(event, node)}
                      >
                        {expandedProject?._id === node?._id ? (
                          <div>
                            <TreeArrowDown />
                          </div>
                        ) : (
                          <div>
                            <TreeArrowRight />
                          </div>
                        )}
                      </strong>
                      <strong className="icon-folder-text-inline project-folder-icon">
                        <FolderIcon />{" "}
                      </strong>
                      <strong className="icon-folder-text-inline">
                        <div className="project_app">
                          <div className="project-collapse">
                            <span className="project-name project-text-overflow">
                              {node?.project?.name ?? node?.project_name}
                            </span>
                          </div>
                        </div>
                      </strong>
                    </div>

                    <div className="threedot-pluseicon">
                      <strong
                        className={
                          (projectId ?? project_id) === node?._id && isProjectAction
                            ? "threedot-icon-inline-top active-state-highlight-bg"
                            : "threedot-icon-inline-top"
                        }
                        onClick={(event) => handleProjectMenu(event, node)}
                      >
                        <ThreeDote />
                      </strong>
                      {(projectData?.user_type === "A" ||
                        node?.roledtl?.role_name === "Project_Admin") && (
                        <strong
                          className="pluseicon-inline"
                          onClick={(event) => handleAddNewProject(event, node)}
                        >
                          <DotIcon />
                        </strong>
                      )}
                    </div>

                    {/* <DotIcon /> */}
                  </ListItem>
                </CustomTooltip>
                {expandedProject && node?._id === expandedProject?._id && (
                  <div className="application-list">
                    <>
                      {applicationList?.length > 0 &&
                        applicationList?.map((application) => {
                          return (
                            node?._id === expandedProject?._id && (
                              <React.Fragment key={application?._id}>
                                <CustomTooltip
                                  title={
                                    application?.app_name ??
                                    application?.application?.app_name
                                  }
                                  placement="top"
                                >
                                  <div
                                    className={
                                      editApp &&
                                        appId &&
                                        application?._id ===
                                        selectedApplication?._id
                                        ? "active-state-bg"
                                        : ""
                                    }
                                    onClick={(event) =>
                                      handleApplication(application)
                                    }
                                  >
                                      <div className="app-view">
                                        <div
                                          className="apps-name"
                                        >
                                          <img
                                            src={
                                              application?.app_img
                                                ? application?.app_img
                                                : EMTYAPPLICATION
                                            }
                                            alt="no img"
                                            width={16}
                                            height={16}
                                            className="app-image"
                                          />
                                          <div className="project-text-overflow">
                                            {`${application?.app_name ??
                                              application?.application?.app_name
                                              }`}
                                          </div>
                                        </div>
                                        {(projectData?.user_type === "A" ||
                                          node?.roledtl?.role_name ===
                                          "Project_Admin") && (
                                            <div className="threedot-pluseicon">
                                              <strong
                                                className={
                                                  node?._id ===
                                                    expandedProject?._id &&
                                                    isAppAction &&
                                                    selectedApplication?._id ===
                                                    application?._id
                                                    ? "threedot-icon-inline active-state-highlight-bg"
                                                    : "threedot-icon-inline"
                                                }
                                                onClick={(event) => {
                                                  handleAppAction(
                                                    event,
                                                    application
                                                  );
                                                  setAppRoute(application);
                                                }}
                                              >
                                                <ThreeDote />
                                              </strong>
                                            </div>
                                          )}
                                      </div>
                                  </div>
                                </CustomTooltip>
                                <Popover
                                  className="edit-app-poppover"
                                  id={id}
                                  open={isAppAction}
                                  anchorEl={anchorEl}
                                  onClose={handleClose}
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
                                        onClick: handleEditApp,
                                      },
                                      {
                                        icon: <DeleteUserIcon />,
                                        label: "Delete Application",
                                        accessLevel: "app_access_lvl",
                                        requiredPermissions: ["delete"],
                                        itemClassName: "delete-project-name",
                                        onClick: () => {
                                          handleDeleteApp(appRoute);
                                        },
                                      },
                                    ]}
                                    roleName={editProject?.roledtl?.role_name}
                                  />
                                </Popover>
                              </React.Fragment>
                            )
                          );
                        })}
                      {applicationList?.length === 0 &&
                        !_.isNil(appListData) &&
                        appListData?.length === 0 && (
                          <div className="no-data-found applicaton-not-found">
                            No data found
                          </div>
                        )}
                    </>
                  </div>
                )}
              </div>

              <Popover
                className="create-project-poppover"
                id={id}
                open={isProjectAction}
                anchorEl={anchorEl}
                onClose={handleClose}
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
                      onClick: handleClickEditProject,
                    },
                    {
                      icon: discovery ? <ProjectView /> : <DiscoveryIcon />,
                      label: discovery ? "Project View" : "Discovery",
                      accessLevel: "project_access_lvl",
                      requiredPermissions: ["view"],
                      onClick: handleClickDiscovery,
                    },
                    {
                      icon: manageuser ? <ProjectView /> : <ManageUserIcon />,
                      label: manageuser ? "Project view" : "Manage Users",
                      accessLevel: "project_access_lvl",
                      requiredPermissions: ["create"],
                      onClick: handleManageUsers,
                    },
                    {
                      icon: <DeleteUserIcon />,
                      label: "Delete Project",
                      accessLevel: "project_access_lvl",
                      requiredPermissions: ["delete"],
                      itemClassName: "delete-project-name",
                      onClick: handleClickDeleteProject,
                    },
                  ]}
                  roleName={editProject?.roledtl?.role_name}
                />
              </Popover>
            </div>
          );
        })}

        <DialogModal
          visible={dialogVisible}
          onHide={hideDialog}
          handleForm={handleEditAppCallBack}
        />
        {/* <ProjectModal
          modalOpen={modalOpen}
          handleClose={handleClose}
          handleCreate={handleEditProject}
          isEdit={null}
          editProject={null}
        /> */}
        <ProjectEditModal
          modalOpen={modalOpen}
          handleClose={handleClose}
          handleCreate={handleEditProject}
          isEdit={null}
          editProject={editProject}
          handleUpdate={handleUpdateProject}
          projectId={projectId ?? project_id}
        />

        <MySnackbar
          className="snack-bar"
          message={message}
          severity={severity}
          open={snackOpen}
          onClose={handleSnackbarClose}
        />
        <ConfirmDialog
          className="confirm-dialog-cloud-onboarding"
          visible={dialogOpen}
          onHide={handleCloseDialog}
          accept={handleCloseDialog}
          reject={handleConfirm}
          acceptLabel={"No, Keep It"}
          rejectLabel={"Yes, Delete"}
          position="center"
          message={
            <>
              <span className="confirm-dialog-normal">
                Are you sure want to delete the{" "}
                <span className="confirm-dialog-italic">
                  {expandedProject?.project_name ||
                    expandedProject?.project?.name}
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
          visible={deleteOpen}
          onHide={() => setDeleteOpen(false)}
          accept={() => setDeleteOpen(false)}
          reject={handleDeleteConfirm}
          acceptLabel={"No, Keep It"}
          rejectLabel={"Yes, Delete"}
          position="center"
          message={
            <>
              <span className="confirm-dialog-normal">
                Are you sure want to delete the{" "}
                <span className="confirm-dialog-italic">
                  {selectedApplication?.application_name}
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
      </List>
      <ConfirmLeaving
        isResource={isResource}
        leaveWorkloadScreen={leaveWorkloadScreen}
        stayOnWorkloadScreen={stayOnWorkloadScreen}
      />
    </div>
  );
};
