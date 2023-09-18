import React, { useEffect, useState } from "react";
import EmptyBox from "../../assets/icons/EmptyBox";
import PlusIconOrange from "../../assets/icons/PlusIconOrange";
import Popover from "@mui/material/Popover";
import EditProjectIcon from "../../assets/icons/EditeProjectIcon";
import DeleteUserIcon from "../../assets/icons/DeleteProjectIcon";
import RbacPopover from "../../components/common/RbacPopover";
import ThreeDote from "../../assets/icons/ThreeDote";
import { useNavigate, useSearchParams } from "react-router-dom";
import ReactDOMServer from "react-dom/server";
import { ReactComponent as EmtyAPP } from "../../assets/icons/EmtyAPP.svg";
import { getWorkloadRequest } from "../../redux/action/workload-action/getWorkloadAction";
import { useDispatch } from "react-redux";
import { getQueryParam } from "../../helper/SearchParams";
import { useSelector } from "react-redux";
import { deleteAppRequest } from "../../redux/action/app-action/DeleteAppAction";
import ConfirmationDialog from "./ProjectDelete";
import DialogModal from "../application/AppModal";
import { createAppRequest } from "../../redux/slice/app-slice/CreateProjectSlice";
import { setAppsId, setAppsname } from "../../redux-local/AppNames";
import _ from "lodash";
import { ConfirmDialog } from "primereact/confirmdialog";
import { Button } from "primereact/button";
import VisibleFeatures from "../../helper/visibleFeatures";
import { getWorkloadReset } from "../../redux/slice/workload-slice/GetWorkloadSlice";

const ApplicationDisplay = ({
  appData,
  handleEditProject,
  initialProject,
}: {
  appData: any;
  handleEditProject: any;
  initialProject: Record<string, any>;
}) => {
  const EMTYAPPLICATION = `data:image/svg+xml;base64,${btoa(
    ReactDOMServer.renderToString(<EmtyAPP />)
  )}`;

  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );

  const { appListLoading } = useSelector((state: any) => state.appList);

  const [dialogVisible, setDialogVisible] = useState(false);

  const navigate = useNavigate();
  const projectId = getQueryParam("projectId");

  const [isProjectAction, setIsProjectAction] = useState<any>(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [showDropDown, setShowDropDown] = useState(false);
  const [editProject, setEditProject] = useState<any>();
  const [applicationVal, setApplicationVal] = useState<any>("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { projectData } = useSelector((state: any) => state.getProject);

  const Project_id = !_.isNil(projectId) ? projectId : initialProject?._id;

  const projectRole = projectData?.projectDtl?.find(
    (data: any) => data?._id === Project_id
  );

  const accessLevels = VisibleFeatures(Project_id);

  const dispatch = useDispatch();

  const handleSettings = (event: any, application: any) => {
    setApplicationVal(application);
    setAnchorEl(event.currentTarget);
    setIsProjectAction(true);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setIsProjectAction(false);
    setModalOpen(false);
    setShowDropDown(false);
  };

  const handleEditApp = () => {
    handleEditProject(true);
    navigate(
      `?application-landing=true&app_id=${applicationVal?._id}&projectId=${projectId}&app_edit=true`
    );
    setIsProjectAction(false);
  };
  const handleDeleteApp = () => {
    setDeleteDialogOpen(true);
    setIsProjectAction(false);
  };

  const handleDeleteConfirm = () => {
    setDeleteDialogOpen(false);
    dispatch(deleteAppRequest(applicationVal?._id));
    navigate(`/overview?projectId=${projectId}`);
  };

  // pass  application id to workloadlist&saga
  // const [appsname,setAppsname ] = useState();
  // const appsname = useSelector((state:any)=> state.APPNAMESS.appsname);
  // const dispatch = useDispatch();

  const handleApplicationClick = (app_id: any, app_name: any) => {
    // setAppsname(app_name);
    dispatch(setAppsId(app_id));
    dispatch(setAppsname(app_name));
    const initialPayload = {
      app_id,
      limit: 0,
      page: 0,
    };
    dispatch(getWorkloadRequest(initialPayload));
  };

  useEffect(() => {
    if (appData?.length > 0) {
      const firstApplicationId = appData[0]._id;
      const firstApplicationname = appData[0].app_name;
      handleApplicationClick(firstApplicationId, firstApplicationname);
    } else {
      dispatch(getWorkloadReset());
      const app_id = "";
      const app_name = "";
      dispatch(setAppsId(app_id));
      dispatch(setAppsname(app_name));
    }
  }, [appData]);

  ///
  const hideDialog = (data: any) => {
    setDialogVisible(false);
  };

  const handleCreateApp = (values: any) => {
    let createAppObj: any = {
      app_name: values?.applicationName,
      description: values?.description,
      project_id: Project_id,
    };
    const formData = new FormData();

    formData.append("File", values?.file);
    formData.append("appData", JSON.stringify(createAppObj));

    const appData = new FormData();
    appData.append("appData", JSON.stringify(createAppObj));

    dispatch(createAppRequest(formData));
  };
  const handleApplication = (event: any, application: any) => {
    navigate(
      `?application-landing=true&app_id=${
        application?.application
          ? application.application?._id
          : application?._id
      }&projectId=${projectId}`
    );
  };
  return (
    <>
      {appListLoading ? (
        <div className="applicationDisplay">
          <div className="applicationDisplay-header">
            <div className="applicationDisplay-heading">Applications</div>
          </div>
          <div className="applicationDisplay-loader">
            <div className={`loader-content`}></div>
          </div>
        </div>
      ) : (
        <>
          {appData?.length == 0 ? (
            <div className="applicationDisplay">
              <div className="applicationDisplay-header">
                <div className="applicationDisplay-heading">Applications</div>
                {accessLevels?.createApplicationLevelRbac && (
                  <div className="applicationDisplay-new" 
                  onClick={() => {
                    setDialogVisible(true);
                  }}
                  >
                    <span>
                      <PlusIconOrange />
                    </span>
                    New
                  </div>
                )}
              </div>
              <div className="applicationDisplay-emptyBox">
                <EmptyBox />
              </div>
              <div className="applicationDisplay-emptyBox-text">
                No Application created yet
              </div>
            </div>
          ) : (
            <>
              <div className="applicationDisplay">
                <div className="applicationDisplay-header">
                  <div className="applicationDisplay-heading">Applications</div>
                  {accessLevels?.createApplicationLevelRbac && (
                    <div
                      className="applicationDisplay-new"
                      onClick={() => {
                        setDialogVisible(true);
                      }}
                    >
                      <span>
                        <PlusIconOrange />
                      </span>
                      New
                    </div>
                  )}
                </div>
                <div className="app_list">
                  {appData?.map((application: any) => {
                    return (
                      <div
                        key={application?._id}
                        className="applicationDisplay-item"
                        // onClick={(event) =>
                        //   handleApplication(
                        //     event,
                        //     application
                        //   )
                        // }
                      >
                        <img
                          src={
                            application?.app_img
                              ? application?.app_img
                              : EMTYAPPLICATION
                          }
                          width={20}
                          height={20}
                        ></img>

                        <div
                          className="applicationDisplay-app_name"
                          onClick={() =>
                            handleApplicationClick(
                              application?._id,
                              application?.app_name
                            )
                          }
                        >
                          {application?.app_name ??
                            application?.application?.app_name}
                        </div>
                        {(projectData?.user_type === "A" ||
                          projectData?.projectDtl?.find(
                            (item: Record<string, any>) =>
                              item?._id === application?.project_id
                          )?.roledtl?.role_name === "Project_Admin") && (
                          <div
                            className="threedot-appDisplay"
                            onClick={(event) =>
                              handleSettings(event, application)
                            }
                          >
                            <span>
                              <ThreeDote />
                            </span>
                          </div>
                        )}

                        <Popover
                          className="edit-app-poppover-landing"
                          open={isProjectAction}
                          anchorEl={anchorEl}
                          onClose={handleClose}
                          anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "right", // Align to the left
                          }}
                          transformOrigin={{
                            vertical: "top",
                            horizontal: "right", // Align to the left
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
                                onClick: handleDeleteApp,
                              },
                            ]}
                            roleName={projectRole?.roledtl?.role_name}
                          />
                        </Popover>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </>
      )}

      <ConfirmDialog
        className="confirm-dialog-cloud-onboarding"
        visible={deleteDialogOpen}
        onHide={() => setDeleteDialogOpen(false)}
        accept={() => setDeleteDialogOpen(false)}
        reject={handleDeleteConfirm}
        acceptLabel={"No, Keep It"}
        rejectLabel={"Yes, Delete"}
        position="center"
        message={
          <>
            <span className="confirm-dialog-normal">
              Are you sure want to delete the{" "}
              <span className="confirm-dialog-italic">
                {applicationVal?.app_name}
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
            <Button className="p-button-text">No, Keep It</Button>
            <Button className="p-button-text">Yes, Delete</Button>
          </div>
        </template>
      </ConfirmDialog>
      <DialogModal
        visible={dialogVisible}
        onHide={hideDialog}
        handleForm={handleCreateApp}
      />
    </>
  );
};

export default ApplicationDisplay;
