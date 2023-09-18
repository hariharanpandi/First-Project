import React, { useCallback, useEffect, useState } from "react";
import { Grid, Popover } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import AddIcon from "@mui/icons-material/Add";
import { EmptyWorkload } from "../../assets/icons/EmptyWorkload";
import { useDispatch } from "react-redux";
import { getWorkloadRequest } from "../../redux/action/workload-action/getWorkloadAction";
import { getQueryParam } from "../../helper/SearchParams";
import { useSelector } from "react-redux";
import SiteMapLine from "../../assets/icons/SiteMapLine";
import ThreeDotVertical from "../../assets/icons/ThreeDotVertical";
import DeleteUserIcon from "../../assets/icons/DeleteProjectIcon";
import RenameIcon from "../../assets/icons/RenameIcon";
import EyeIcon from "../../assets/icons/EyeIcon";
import EditProjectIcon from "../../assets/icons/EditeProjectIcon";
import RbacPopover from "../../components/common/RbacPopover";
import WorkloadCreate from "../workload/WorkloadCreate";
import { useNavigate } from "react-router-dom";
import MySnackbar from "../../helper/SnackBar";
import _ from "lodash";
import { renameReset } from "../../redux/slice/workload-slice/renameWorkloadSlice";
//
import ConfirmationDialog from "../project/ProjectDelete";
import { deleteWorkloadRequest } from "../../redux/action/workload-action/DeleteWorkloadAction";
import { deleteWorkloadReset } from "../../redux/slice/workload-slice/DeleteWorkloadSlice";
import { CustomBackdrop } from "../../helper/backDrop";
import DiscoveryStatusIcon from "../../assets/icons/DiscoveryStatusIcon";
import { ConfirmDialog } from "primereact/confirmdialog";
import { Button } from "primereact/button";
import CustomTooltip from "../../components/CustomTooltip";

const debounce = (callback: Function, delay: number) => {
  let timerId: any;
  return (...args: any[]) => {
    if (timerId) {
      clearTimeout(timerId);
    }
    timerId = setTimeout(() => {
      callback(...args);
    }, delay);
  };
};

export const WorkLoadInfo = () => {
  const app_id = getQueryParam("app_id");
  const projectId = getQueryParam("projectId");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const navigate = useNavigate();
  const [severity, setSeverity] = useState("");
  const [message, setMessage] = useState("");
  const [snackOpen, setSnackOpen] = useState(false);
  const [renameFlag, setRenameFlag] = useState(false);
  const allAccessLevel = useSelector((state: any) => state.accessLevels);
  useEffect(() => {
    dispatch(renameReset())
  }, [])

  const handleShowModal = () => {
    setIsModalVisible(true);
    setSnackOpen(false);
    return () => {
      dispatch(renameReset());
    };
  };

  const handleHideModal = () => {
    setIsModalVisible(false);
    setRenameFlag(false)
  };
  const dispatch = useDispatch();
  const { getWorkloadData, workloadLoading } = useSelector(
    (state: any) => state.getWorkload
  );
  const { projectData } = useSelector((state: any) => state.getProject);

  const editProject = projectData?.projectDtl?.find(
    (data: any) => data?._id === projectId
  );

  const [workLoadData, setWorkLoadData] = useState<any[]>([]);
  const [showDropDown, setShowDropDown] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );
  const [limitData, setLimitData] = useState(0);
  const [workloadVal, setWorkLoadVal] = useState<any>("");
  const { renameType, renameSuccess, renameError,renameLoading } = useSelector(
    (state: any) => state.rename
  );

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const nextPage = parseInt(getWorkloadData?.currentPage) + 1;
  const [workloadData, setWorkloadId] = useState<any>('');

  const [showSnackbar, setShowSnackbar] = useState<any>("");

  const [screenSize, setScreenSize] = useState({ width: 0, height: 0 });
  useEffect(() => {
    if (renameSuccess) {
      setSnackOpen(true);
      setMessage(renameType);
      setSeverity("success");
    } else if (renameError) {
      setSnackOpen(true);
      setMessage(renameError);
      setSeverity("error");

      // setMessage()
    }
    return () => {
      dispatch(renameReset());
      // dispatch(deleteAppReset());
    };
  }, [renameSuccess, renameError]);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      setScreenSize({ width, height });
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    // Define a configuration object for dynamic limits
    const limitConfig = [
      { maxWidth: 950, limit: 5 },
      { maxWidth: 1165, limit: 7 },
      { maxWidth: 1380, limit: 9 },
      { maxWidth: 1598, limit: 9 },
      { maxWidth: Infinity, limit: 13 }, // Default if none of the conditions match
    ];
  
    // Find the appropriate limit based on screen width
    const dynamicLimit = limitConfig.find(({ maxWidth }) => screenSize.width < maxWidth)?.limit || 13;
  
    setLimitData(dynamicLimit);
  }, [screenSize]);
  

  useEffect(() => {
    if (getWorkloadData) {
      +getWorkloadData?.currentPage === 1
        ? setWorkLoadData(getWorkloadData?.workloadList)
        : setWorkLoadData((prev) => [...prev, ...getWorkloadData?.workloadList]);
    }
  }, [getWorkloadData]);

  useEffect(() => {
    setWorkLoadData([]);
    const initialPayload = {
      app_id,
      page: 1,
      limit: limitData,
    };
    dispatch(getWorkloadRequest(initialPayload));
  }, [app_id, dispatch, limitData,renameType]);

  const debouncedHandleScroll = useCallback(
    debounce((e: any) => {
      const { scrollTop, scrollHeight, clientHeight } = e.target;
      if (
        scrollTop + clientHeight + 50 >= scrollHeight - 0 &&
        nextPage <= getWorkloadData?.totalPages
      ) {
        try {
          const scrollPayload = {
            app_id,
            page: nextPage,
            limit: limitData,
          };
          dispatch(getWorkloadRequest(scrollPayload));
        } catch (err) {
          console.log(err);
        }
      }
    }, 500),
    [app_id, getWorkloadData, nextPage, dispatch,renameType]
  );

  useEffect(() => {
    const scrollableDiv = document.getElementById("scrollableDiv");
    if (scrollableDiv) {
      scrollableDiv.addEventListener("scroll", debouncedHandleScroll);

      return () => {
        scrollableDiv.removeEventListener("scroll", debouncedHandleScroll);
      };
    }
  }, [debouncedHandleScroll]);

  const handleWorkloadAction = (event: any) => {
    setAnchorEl(event.currentTarget);
    setShowDropDown(true);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setShowDropDown(false);
  };
  const handleEdit =
    (data: any): React.MouseEventHandler<HTMLDivElement> =>
    (event: any) => {
      navigate(
        `workload?app_id=${workloadData?.app_id}&projectId=${data?.project_id}&workload=${workloadData?.workload_name}&edit=true&workloadId=${workloadData._id}`
      );
    };
  const handleView =
    (data: any): React.MouseEventHandler<HTMLDivElement> =>
    (event: any) => {
     
      navigate(
        `workload?app_id=${workloadData?.app_id||data?.app_id}&projectId=${data?.project_id}&workload=${workloadData?.workload_name||data?.workload_name}&view=true&workloadId=${workloadData._id||data?._id}`
      );
    };
  const handleRename =
    (data: any): React.MouseEventHandler<HTMLDivElement> =>
    (event: any) => {
      setIsModalVisible(true);
      setShowDropDown(false);
      setRenameFlag(true);

      // navigate(`workload?app_id=${data?.app_id}&projectId=${data?.project_id}&workload=${data?.workload_name}&workloadId=${data?._id}`)
    };
  const handleAction =
    (data: any): React.MouseEventHandler<HTMLDivElement> =>
    (event: any) => {
      handleWorkloadAction(event);
      setWorkLoadVal(data);

      // navigate(`workload?app_id=${data?.app_id}&projectId=${data?.project_id}&workload=${data?.workload_name}&workloadId=${data?._id}`)
    };
  /**Delete workload */
  const { DeleteWorkload, error, deleteLoading } = useSelector(
    (state: any) => state.deleteWorkload
  );

  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<any>();

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleConfirm = () => {
    dispatch(deleteWorkloadRequest(deleteId));
    setDialogOpen(false);
    handleCloseDialog();
    dispatch(deleteWorkloadRequest(deleteId));
    setWorkLoadData((prevWorkLoadData) =>
      prevWorkLoadData.filter((workload) => workload._id !== deleteId)
    );
  };

  const handleCancel = () => {
    handleCloseDialog();
  };

  const handleDeleteWorkload =
    (data: any): React.MouseEventHandler<HTMLDivElement> =>
    (event) => {
      setAnchorEl(null);
      setDeleteId(data._id);
      setShowDropDown(false);
      setDialogOpen(true);
    };
  useEffect(() => {
    if (DeleteWorkload) {
      setSeverity("success");
      setSnackOpen(true);
      setMessage("Workload deleted successfully !");
    } else if (error) {
      setSeverity(error);
      setSnackOpen(false);
      setMessage(error);
    }
    return () => {
      dispatch(deleteWorkloadReset());
    };
  }, [DeleteWorkload, error]);

  const handleSnackbarClose = () => {
    setSnackOpen(false);
  };

  return (
    <>
      <main>
        <CustomBackdrop open={deleteLoading||renameLoading} />
        {workLoadData ? (
          <div className="workload-info-container" id="scrollableDiv">
            <Grid item md={12} className="workload-info-heading">
                <div>Workloads</div><div className="ifo-creat-new" onClick={handleShowModal}><AddIcon/>New</div>
            </Grid>
            <Grid
              container
              className="overal-workload-card workload-info-data"
            >
              {
                allAccessLevel?.createWorkLoadLevelRbac &&
              <div className="discovery-card-ifo">
                <Card className="specific-workload-card">
                  <CardContent
                    className="card-content"
                    onClick={handleShowModal}
                  >
                    <div className="summary-add-icon">
                      <AddIcon />
                    </div>
                    <div className="summary-add-text"> Add New</div>
                  </CardContent>
                </Card>
              </div>
              }
              {workLoadData.length > 0 &&
                workLoadData.map((data: any) => {
                  const handleRenameWorkload = handleRename(data);
                  const handleViewWorkload = handleView(data);
                  const handleEditWorkload = handleEdit(data);
                  // const handleDeleteWorkload = () => { };
                  const handleWorkloadAction = handleAction(data);
                  return (
                    <div
                      key={data?._id}
                      // className="discovery-card"
                    >
                      <Card className="specific-mapd-workload-card" 
                      // onClick={handleView(data)}
                       
                       >
                        <CardContent className="workload-card-content" >
                          <div className="workload-header-icons">
                            <div className="workload-sitemapline">
                              <SiteMapLine />
                            </div>
                            <div
                              className="workload-threeDotVertical"
                              onClick={(e) => {
                                handleView(undefined)
                                handleWorkloadAction(e);
                                setWorkloadId(data);
                              }}
                            >
                              <ThreeDotVertical />
                            </div>
                          </div>
                          <div className="workload-list-name" onClick={handleView(data)}>
                            {data?.workload_name}
                          </div>

                          <div className="workload-createdAt">
                            <div>{data.created_at}</div>{data?.discover_sync_flag &&  <CustomTooltip title={"Possible changes to workload resources following a recent cloud account rediscovery"} placement="top"><div><DiscoveryStatusIcon /></div></CustomTooltip>}
                          </div>
                        </CardContent>
                        {/* <div
                              className="workload-threeDotVertical"
                              onClick={(e) => {
                                handleWorkloadAction(e);
                                setWorkloadId(data);
                              }}
                            >
                              <ThreeDotVertical />
                            </div> */}
                       
                        <Popover
                          className="workload-poppover"
                          id={id}
                          open={showDropDown}
                          anchorEl={anchorEl}
                          onClose={handleClose}
                          anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "left", // Align to the left
                          }}
                          transformOrigin={{
                            vertical: "top",
                            horizontal: "left", // Align to the left
                          }}
                        >
                          {
                            <RbacPopover
                              menuItems={[
                                {
                                  icon: (
                                    <span className="workload-icons">
                                      <RenameIcon />
                                    </span>
                                  ),
                                  label: "Rename",
                                  directaccesslevel: workloadVal,
                                  accessLevel: "workload_access_lvl",
                                  requiredPermissions: ["edit"],
                                  onClick: handleRenameWorkload,
                                },
                                {
                                  icon: (
                                    <span className="workload-icons">
                                      <EyeIcon />
                                    </span>
                                  ),
                                  label: "View Workload",
                                  directaccesslevel: workloadVal,
                                  accessLevel: "workload_access_lvl",
                                  requiredPermissions: ["view"],
                                  onClick: handleViewWorkload,
                                },
                                {
                                  icon: (
                                    <span className="workload-icons">
                                      <EditProjectIcon />
                                    </span>
                                  ),
                                  label: "Edit Workload",
                                  directaccesslevel: workloadVal,
                                  accessLevel: "workload_access_lvl",
                                  requiredPermissions: ["edit"],
                                  onClick: handleEditWorkload,
                                },
                                {
                                  icon: (
                                    <span className="workload-icons">
                                      <DeleteUserIcon />
                                    </span>
                                  ),
                                  label: "Delete Workload",
                                  directaccesslevel: workloadVal,
                                  accessLevel: "workload_access_lvl",
                                  requiredPermissions: ["delete"],
                                  itemClassName: "delete-project-name",
                                  onClick: handleDeleteWorkload(workloadVal),
                                },
                              ]}
                              roleName={workloadVal?.role_name}
                            />
                          }
                        </Popover>
                      </Card>
                      
                    </div>
                  );
                })}
            </Grid>
            <div className="workload-pagination-loader">
              <div className={`${workloadLoading && `loader-content`}`}></div>
            </div>
          </div>
        ) : (
          <Grid container padding={4}>
            <Grid item md={12}>
              Workloads
            </Grid>
            <Grid item md={12}>
              <div className="empty-workload">
                <div>
                  <EmptyWorkload />
                </div>
              </div>
              <div className="ntg-create">Nothing Created yet</div>
              <div className="ntg-create">You haven't created any</div>
              <div className="ntg-create">workloads yet</div>
            </Grid>
          </Grid>
        )}
     {/* For delete workload model */}
          <ConfirmDialog
          className="confirm-dialog-cloud-onboarding"
          visible={dialogOpen}
          onHide={() => setDialogOpen(false)}
          accept={() => setDialogOpen(false)}
          reject={handleConfirm}
          acceptLabel={'No, Keep It'}
          rejectLabel={'Yes, Delete'}
          position='center'
          message={
            <>
              <span className='confirm-dialog-normal'>
                Are you sure want to delete the <span className="confirm-dialog-italic">{
                  workloadVal?.workload_name
                }</span> workload, all the data will be lost
              </span>
            </>
          }
          header="Delete workload"
          icon="pi pi-exclamation-triangle"
        >
        <template>
          <div className='p-d-flex p-jc-between'>
            <Button className='p-button-text'>No, Keep It</Button>
            <Button className='p-button-text'>Yes, Delete</Button>
          </div>
        </template>
      </ConfirmDialog>


      </main>
      <WorkloadCreate
        visible={isModalVisible}
        onHide={handleHideModal}
        renameFlag={renameFlag}
        workloadData={workloadVal}
        showSnackbar={showSnackbar} // Pass the state variable to the WorkloadCreate component
        appid={app_id!}
        projectid={projectId!}
        setShowSnackbar={setShowSnackbar}
   
        
      />
      <MySnackbar
        className="snack-bar"
        message={message}
        severity={severity}
        open={snackOpen}
        onClose={handleSnackbarClose}
      />
    </>
  );
};
