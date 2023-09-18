import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/scrollbar";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "../../styles/workload-styles/WorkloadLists.css";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import { useSelector } from "react-redux";
import WorklodListIcon from "../../assets/icons/WorklodListIcon";
import ThreeDotVertical from "../../assets/icons/ThreeDotVertical";
import ThreeDote from "../../assets/icons/ThreeDote";
import { useDispatch } from "react-redux";
import { getWorkloadRequest } from "../../redux/action/workload-action/getWorkloadAction";
import EyeIcon from "../../assets/icons/EyeIcon";
import RenameIcon from "../../assets/icons/RenameIcon";
import EditProjectIcon from "../../assets/icons/EditeProjectIcon";
import DeleteUserIcon from "../../assets/icons/DeleteProjectIcon";
import { Popover } from "@mui/material";
import RbacPopover from "../../components/common/RbacPopover";
import ConfirmationDialog from "../project/ProjectDelete";
import EmptyBox from "../../assets/icons/EmptyBox";
import WorkloadBreadcrum from "./WorkloadBreadcrum";
import WorkloadCreate from "./WorkloadCreate";
import { getQueryParam } from "../../helper/SearchParams";
import { deleteWorkloadRequest } from "../../redux/action/workload-action/DeleteWorkloadAction";
import { useNavigate } from "react-router-dom";
import { ConfirmDialog } from "primereact/confirmdialog";
import { Button } from "primereact/button";
import MySnackbar from "../../helper/SnackBar";
import { renameReset } from "../../redux/slice/workload-slice/renameWorkloadSlice";
import { deleteWorkloadReset } from "../../redux/slice/workload-slice/DeleteWorkloadSlice";
import CustomTooltip from "../../components/CustomTooltip";
import React from "react";
import { getWorkloadReset } from "../../redux/slice/workload-slice/GetWorkloadSlice";


const WorkloadLists = ({
  initialProject
}: {
  initialProject: Record<string, any>
}) => {

  const { getWorkloadData, workloadLoading } = useSelector(
    (state: any) => state.getWorkload
  );
  const { appListLoading } = useSelector(
    (state: any) => state.appList
  );
  
  const appsId = useSelector((state:any)=> state.APPNAMESS.appsId);

  /*Snakbar */
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("");
  const { renameType, renameSuccess, renameError,renameLoading } = useSelector(
    (state: any) => state.rename
  );
  const { DeleteWorkload, error, deleteLoading } = useSelector(
    (state: any) => state.deleteWorkload
  );
  /**Carosal pagination **/
  const [workLoadData, setWorkLoadData] = useState<any[]>([]);
  const dispatch = useDispatch();
  const [snackOpen, setSnackOpen] = useState(false);
  const workloadList = getWorkloadData?.workloadList || [];
  // const app_id = getWorkloadData?.workloadList[0]?.app_id;
  const app_id = appsId;
  const [nextPage, setNextPage] = useState<any>(0);
  
  // const [appId, setAppId] = useState()
  // setAppId(app_id)
  useEffect(() => {
    dispatch(renameReset())
  }, [])
  useEffect(() => {
    if (renameSuccess) {
      setSnackOpen(true);
      setMessage(renameType);
      setSeverity("success");
    } else if (renameError) {
      setSnackOpen(true);
      setMessage(renameError);
      setSeverity("error");
    }
    return () => {
      dispatch(renameReset())
    };
  }, [renameSuccess, renameError]);


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
  }, [DeleteWorkload]);

  const handleSnackbarClose = () => {
    setSnackOpen(false);
  };

  useEffect(() => {
    if (parseInt(getWorkloadData?.currentPage) !== nextPage) {
      getWorkloadData?.currentPage === 1
        ? setWorkLoadData(workloadList)
        : setWorkLoadData((prev) => [...workloadList]);
      setNextPage(parseInt(getWorkloadData?.currentPage) + 1);
    } else {
      setWorkLoadData([]);
    }
  }, [getWorkloadData]);

  useEffect(() => {
    setWorkLoadData([]);
    const initialPayload = {
      app_id,
      page: 0,
      limit: 0,
    }; 
    if (app_id) {
      dispatch(getWorkloadRequest(initialPayload));
    }
  }, [renameType,DeleteWorkload]);


  /** popover  **/
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );
  const [workloadVal, setWorkLoadVal] = useState<any>('');
  const [showDropDown, setShowDropDown] = useState(false);
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  
  // const slidOpen = 4;
  // const slidClose =5;
  // const responsiveCard = useSelector((state:any) => state.APPNAMESS.sideOpen);
  // const itemsPerPage =responsiveCard ? slidOpen : slidClose;

  


  /** swiper atribut **/
  const swiperOptions = {
    // id:"swiper",
    // virtual:true,
    modules: [Navigation, Pagination, Scrollbar, A11y],
    // loop:true,
    spaceBetween: 16,
    centeredSlides: false,
    grabCursor: true,
    // slidesPerView: itemsPerPage,
    keyboard: {
      enabled: true
    },
    breakpoints: {
      1536: {
        slidesPerView: 5,
        slidesPerGroup: 1,
      },
      1200: {
        slidesPerView: 3,
        slidesPerGroup: 1,
      },
      700: {
        slidesPerView: 1,
        slidesPerGroup: 1,
      },
    },
    navigation: true,
    pagination: {
      clickable: true,
    },
  };
  /**Delete workload */
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

  const handleDeleteWorkload =
    (data: string | any): React.MouseEventHandler<HTMLDivElement> =>
      (event) => {
        setAnchorEl(null);
        setDeleteId(data._id);
        setShowDropDown(false);
        setDialogOpen(true);
      };

  /**Aarback */
  const handleWorkloadAction = (event: any, item: any) => {
    setAnchorEl(event.currentTarget);
    setShowDropDown(true);
    setWorkLoadVal(item);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setShowDropDown(false);
  };
  // *create workload modal*//
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [renameFlag, setRenameFlag] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState<any>("");
  const projectId = getQueryParam("projectId");
  // const ProjectID = useSelector((state:any) => state.APPNAMESS.ProjectID);
  // const projectId = ProjectID;


  const handleShowModal = () => {
    setIsModalVisible(true);
    setRenameFlag(false)
  };

  const handleHideModal = () => {
    setIsModalVisible(false);
    setRenameFlag(false);
  };

  //rename model
  const handleRename =
  (data: any): React.MouseEventHandler<HTMLDivElement> =>
  (event: any) => {
    setIsModalVisible(true);
    setShowDropDown(false);
    setRenameFlag(true);
  };

  // *view workload*//
  const navigate = useNavigate();
  const [workloadData, setWorkloadId] = useState<any>('');

  const handleView =
  (data: any): React.MouseEventHandler<HTMLDivElement> =>
  (event: any) => {
    navigate(
      `workload?app_id=${workloadData?.app_id||data?.app_id}&projectId=${projectId}&workload=${workloadData?.workload_name||data?.workload_name}&view=true&workloadId=${workloadData._id||data?._id
      
      }`
    );
  };

  // *edite workload*//
  const handleEdit =
  (data: any): React.MouseEventHandler<HTMLDivElement> =>
  (event: any) => {
    navigate(
      `workload?app_id=${workloadData?.app_id}&projectId=${projectId}&workload=${workloadData?.workload_name}&edit=true&workloadId=${workloadData._id}`
    );
  };
  

  return (
    <>
      <div className="carousel-container">
        <div ><WorkloadBreadcrum handleShowModal={handleShowModal} application={app_id}/></div>
        {
        
        workloadLoading || appListLoading ? (
            <div className="applicationDisplay-loader">
              <div className={`loader-content`}></div>
            </div>
        ) :
          getWorkloadData?.workloadList?.length === 0 || getWorkloadData=== null ? (
          <div className="workloadDisplay">
            <div className="workloadDisplay-headers">
            </div>
            <div className="workloadDisplay-emptyBox">
              <EmptyBox />
            </div>
            <div className="workloadDisplay-emptyBox-text">
              <div className="width-spec">
                <div>No workload created yet, application specific</div>
                <div>workloads will be listed here</div>
              </div>
            </div>
          </div>
        ) : (

          <>
            <Swiper
              {...swiperOptions}
              className="mySwiper"

              // onSlideChange={handleSlideChange}
            >
              {workLoadData?.map((item: any, index: any) =>{
                    const handleRenameWorkload = handleRename(item);
                    const handleViewWorkload = handleView(item);
                    const handleEditWorkload = handleEdit(item);
                return(
                <SwiperSlide key={index} className="swiper-slid" 
                // onClick={handleView(item)}
                 >
                
                  <div className="workload-list-icon">
                    <div className="workload-list-iconces">
                      <WorklodListIcon />
                    </div>
                    <div
                    className="workload-carosal-dotes"
                      onClick={(event) => {
                        handleWorkloadAction(event, item);
                        setWorkloadId(item);
                      }}>
                      <ThreeDotVertical />
                    </div>
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

                      <RbacPopover
                        menuItems={[
                          {
                            icon: <span className="workload-icons"><RenameIcon /></span>,
                            label: "Rename",
                            accessLevel: "workload_access_lvl",
                            requiredPermissions: ["edit"],
                            onClick: handleRenameWorkload,
                          },
                          {
                            icon: <span className="workload-icons"><EyeIcon /></span>,
                            label: "View Workload",
                            accessLevel: "workload_access_lvl",
                            requiredPermissions: ["view"],
                            onClick: handleViewWorkload,
                          },
                          {
                            icon: <span className="workload-icons"><EditProjectIcon /></span>,
                            label: "Edit Workload",
                            accessLevel: "workload_access_lvl",
                            requiredPermissions: ["edit"],
                            onClick: handleEditWorkload,
                          },
                          {
                            icon: <span className="workload-icons"><DeleteUserIcon /></span>,
                            label: "Delete Workload",
                            accessLevel: "workload_access_lvl",
                            requiredPermissions: ["delete"],
                            itemClassName: "delete-project-name",
                            onClick: handleDeleteWorkload(workloadVal),
                          },
                        ]}
                        roleName={workloadVal?.role_name}
                      />
                    </Popover>
                  </div>
                  <CustomTooltip title={item.workload_name} placement="top">
                  <div className="workload-bottom-content">
                    <div className="word-break-all" onClick={handleView(item)}>{item.workload_name}</div>
                    <span className="workload-bottom-time">{item.created_at}</span>
                  </div>
                  </CustomTooltip>
                
                </SwiperSlide>
              );
                      })}
              <div className="workload-data-loding">
                <div
                  className={`${workloadLoading && `workload-loader-content`}`}
                ></div>
              </div>
            </Swiper>
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
            <Button className='p-button-text'>No, Keep it</Button>
            <Button className='p-button-text'>Yes, Delete</Button>
          </div>
        </template>
      </ConfirmDialog>
              {/* <WorkloadCreate
                visible={isModalVisible}
                onHide={handleHideModal}
                renameFlag={renameFlag}
                workloadData={workloadVal}
                showSnackbar={showSnackbar} // Pass the state variable to the WorkloadCreate component
                appid={app_id!}
                projectid={projectId!}
                setShowSnackbar={setShowSnackbar}
              /> */}
          </>
        )}
          <WorkloadCreate
                visible={isModalVisible}
                onHide={handleHideModal}
                renameFlag={renameFlag}
                workloadData={workloadVal}
                showSnackbar={showSnackbar} // Pass the state variable to the WorkloadCreate component
                appid={app_id!}
                projectid={projectId! || initialProject?._id}
                setShowSnackbar={setShowSnackbar}
               
              />
      <MySnackbar
        className="snack-bar"
        message={message}
        severity={severity}
        open={snackOpen}
        onClose={handleSnackbarClose}
      />
      </div>
    </>
  );
};

export default WorkloadLists;
