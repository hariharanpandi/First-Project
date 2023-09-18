import PlusIconWhite from "../../assets/icons/PlusIconWhite";
import SettingIcon from "../../assets/icons/SettingIcon";
import { useSelector } from "react-redux";
import React , {useEffect} from 'react';
import { CustomBackdrop } from "../../helper/backDrop";
import { getQueryParam } from "../../helper/SearchParams";
import { getProjectRequest } from "../../redux/slice/project-slice/GetProjectSlice";
import { Dispatch } from "react";
import { useDispatch } from "react-redux";
import DialogModal from "../application/AppModal";
import { useState } from "react";
import {

  Navigate,
 
} from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { createAppRequest } from "../../redux/slice/app-slice/CreateProjectSlice";
import { getProjectInfoRequest } from "../../redux/action/project-action/GetProjectInfoAction";
import _ from "lodash";
import { getProjectInfoInitReset } from "../../redux/slice/project-slice/GetProjectInfoInitSlice";
import CustomTooltip from "../../components/CustomTooltip";


const LandingDisplay = (landingDisplayData: any) => {
  const allAccessLevel = useSelector((state: any) => state.accessLevels);
  const { projectData } = useSelector((state: any) => state.getProject);
  const { projectInfoData,loading } = useSelector((state: any) => state.getProjectInfo);
  const update = getQueryParam("projectUpdate")
  const { projectInfoInitData,initloading } = useSelector(
    (state: any) => state.getProjectInfoInit
  );
  const navigate = useNavigate();
  const projectId = getQueryParam('projectId')
  const [dialogVisible, setDialogVisible] = useState(false);
  const handleSetting = () => {
    const project_id = !_.isNil(projectId) ? projectId : projectInfoInitData?.data?._id;
    navigate(`/overview?cloud-account=true&projectId=${project_id}`);
  };
  const [deleteInitData, setDeleteInitData] = useState<boolean>(false);
  

  const showDialog = () => {
    setDialogVisible(true);
    const project_id = !_.isNil(projectId) ? projectId : projectInfoInitData?.data?._id;
    navigate(`/overview?projectId=${project_id}`)
  };

  const hideDialog = () => {
    setDialogVisible(false);
  };
  const dispatch=useDispatch();

  const handleCreateApp = (values: any) => {
    let createAppObj: any = {
      app_name: values?.applicationName,
      description: values?.description,
      project_id: projectId,
    };
    const formData = new FormData();

    formData.append("File", values?.file);
    formData.append("appData", JSON.stringify(createAppObj));

    const appData = new FormData();
    appData.append("appData", JSON.stringify(createAppObj));

    dispatch(createAppRequest(formData));
  };

  const { editSuccess, editLoading, editError, projectEditType } = useSelector(
    (state: any) => state.editProject
  );

  useEffect(() => {
    dispatch(getProjectRequest())
  }, [projectEditType])

  const render = landingDisplayData?.project_name

  useEffect(() => {
    dispatch(getProjectInfoRequest(projectId!));

  }, [render])

  useEffect(() => {
  if(!projectId) {
setDeleteInitData(true);
  } else {
    setDeleteInitData(false);
  }
  }, [projectId])

  useEffect(() => {
    if (!_.isNil(projectId)) {
      dispatch(getProjectInfoInitReset());
    }
  }, [dispatch, projectId]);

  return (
    <div>
      <CustomBackdrop open={loading||initloading}/>
      <div className="landingDisplay">
        <div className="landingDisplay-bg-linear">
          {
            landingDisplayData?.landingDisplayData &&
            <>
              <div className="landingDisplay-heading">
                {
                  landingDisplayData?.landingDisplayData?.project_name ??
                  landingDisplayData?.landingDisplayData?.project?.name
                }
              </div>
              <div className="landingDisplay-disc">
                {
                  landingDisplayData.landingDisplayData?.description ??
                  landingDisplayData.landingDisplayData?.project?.description
                }
              </div>
            </>
          }

          <div className="new-application">
            {
              allAccessLevel?.createApplicationLevelRbac &&
            <button className="landingDisplay-btn" onClick={showDialog}>
              <span
                style={{
                  color: "White",
                }}
                className="plus-icon-new-app"
              >
                <PlusIconWhite />
              </span>{" "}
              New Application
            </button>
            }
             <CustomTooltip
                title={"Discovery"}
                placement="top"
              >
                 <button
              className="landingDisplay-settings-btn"
              onClick={handleSetting}
            >
              <SettingIcon />
            </button>
              </CustomTooltip>
           
          </div>
        </div>
      </div>
      <DialogModal visible={dialogVisible} onHide={hideDialog} handleForm={handleCreateApp}/>
    </div>
  );
};

export default LandingDisplay;