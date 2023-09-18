import React, { useState } from 'react';
import ThreeDote from '../../assets/icons/ThreeDote';
import { Popover } from '@mui/material';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getQueryParam } from '../../helper/SearchParams';
import PlusIconOrange from '../../assets/icons/PlusIconOrange';
import ThreeDot from '../../assets/icons/ThreeDot';
import VisibleFeatures from '../../helper/visibleFeatures';

const WorkloadBreadcrum = ({handleShowModal,application}:any) => {
    

    const [anchorEl2, setAnchorEl2] = React.useState<HTMLButtonElement | null>(null);
    const [showPopover, setShowPopover] = useState(false);
    const open2 = Boolean(anchorEl2);
    const id2 = open2 ? "simple-popover" : undefined;
    const projectId = getQueryParam("projectId");
    const appsname = useSelector((state:any) => state.APPNAMESS.appsname);
    // const ProjectID = useSelector((state:any) => state.APPNAMESS.ProjectID);
    // const projectId = ProjectID;
    const { appListData } = useSelector((state: any) => state.appList);
    const accessLevels = VisibleFeatures(projectId!);

  

/** popover three dot **/
    const handleDoteAction = (event: any) => {
        setAnchorEl2(event.currentTarget);
        setShowPopover(true);
    };

// *view all*//
const [editApp, setEditApp] = useState<any>();
const navigate = useNavigate();
const [deleteId, setDeleteId] = useState<any>();

const handleApplication = (event: any, application: any) => {
    navigate(
      `?application-landing=true&app_id=${
        application
      }&projectId=${projectId}`
    );
    
    // setEditApp(application);
  };



    return (
        <div className="workload-cards-head">
            <div className="workload-class-path">
                {appsname && appsname + ' / '} Workloads
            </div>
            <div className="workload-head-left">
                {
                  (accessLevels.createWorkLoadLevelRbac &&
                    appListData?.length > 0 ) &&
                <div className="worload-new-creation" onClick={handleShowModal}>
                    <span className='plusorange-icon'><PlusIconOrange /></span>
                       New
                     </div>
                }
                {
                     appListData?.length > 0 &&
                <div className="workload-threedote-icon"
                    onClick={(event) => {
                        handleDoteAction(event)
                    }}
                >
                    <ThreeDote />

                </div>
                }
                <Popover
                    className="workload-popover"
                    id={id2}
                    open={showPopover}
                    anchorEl={anchorEl2}
                    onClose={() => setShowPopover(false)}
                    anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "left", // Align to the left
                    }}
                    transformOrigin={{
                        vertical: "top",
                        horizontal: "right", // Align to the left
                    }}
                >
                    <div className='view-all-popover'
                     onClick={(event) =>
                        handleApplication(event, application)
                    }
                    >
                    View all</div>
                </Popover>
            </div>
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
        </div>
    )
}

export default WorkloadBreadcrum;
