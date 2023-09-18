import React from "react";
import { Grid } from "@mui/material";
import Divider from "@mui/material/Divider";
import "../../styles/common-styles/SearchBar.css";
import Settings from "../../pages/settings/Index";
import {
  SettingTypo,
  Wrappers,
  LayoutTypo,
} from "../../styles/setting-styles/AccountStyles";

// import styles 👇
import Drawer from "react-modern-drawer";
import "react-modern-drawer/dist/index.css";
import NavIcon from "../../assets/icons/NavIcon";
import SearchBar from "../../components/SearchBar";
import ThreeDot from "../../assets/icons/ThreeDot";
import CompLogo from "../../assets/icons/CompanyLogo";
import Logo from "../../assets/images/logo.png";
import LogoText from "../../assets/images/logoText.png";
import { useState } from "react";
import CustomPopover from "../../pages/settings/account-settings/Popover";
import "../../styles/project-styles/project.css";
import { ParentNodeComponent } from "../../pages/project/TreeView";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { CustomBackdrop } from "../../helper/backDrop";
import TopBar from "./TopBar";
import LandingDisplay from "./LandingDisplay";
import ApplicationDisplay from "./ApplicationDisplay";
import { getQueryParam } from "../../helper/SearchParams";
import { appListRequest } from "../../redux/action/app-action/AppListAction";
import WorkloadLists from "../workload/WorkloadList";
import { getProjectRequest } from "../../redux/action/project-action/GetProjectAction";
import _ from "lodash";

export const ProjectLanding = ({
  projectdata,
  handleEditAppData,
  editProjectBooleanVal,
}: {
  projectdata: any;
  handleEditAppData: any;
  editProjectBooleanVal: any;
}) => {
  const [isOpen, setIsOpen] = React.useState(true);
  const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);
  const [setting, setSetting] = useState(false);
  const [parentNode, setParentNode] = useState([]);
  const location = useLocation();
  const project_id = getQueryParam("projectId");
  const searchParams = new URLSearchParams(location.search);
  const sso = searchParams.get("sso");
  const dispatch = useDispatch();
  const update = getQueryParam("projectUpdate");
  const [userId, setUserId] = useState<any>(null);
  const [editProject, setEditProject] = useState(false);
  const [deleteInitData, setDeleteInitData] = useState<boolean>(false);

  const { success, loading, projectData } = useSelector(
    (state: any) => state.getProject
  );

  const projectId = getQueryParam("projectId");

  const { appListSuccess, appListLoading, appListData } = useSelector(
    (state: any) => state.appList
  );

  const { projectInfoData } = useSelector((state: any) => state.getProjectInfo);

  const toggleDrawer = () => {
    setIsOpen((prevState) => !prevState);
  };

  const handleSettings = () => {
    setIsPopoverOpen(true);
  };
  const handlePopoverClose = () => {
    setIsPopoverOpen(false);
  };
  const handleSettingChange = (newValue: any) => {
    setSetting(newValue);
  };

  useEffect(() => {
    if (!_.isNil(project_id)) {
      const role_name = projectData?.projectDtl?.find(
        (data: Record<string, any>) => data?._id === project_id
      )?.roledtl?.role_name;
      dispatch(
        appListRequest({
          project_id,
          role_name,
        })
      );
    } else if (!_.isNil(projectData)) {
      dispatch(
        appListRequest({
          project_id: projectData?.projectDtl[0]?._id,
          role_name: projectData?.projectDtl[0]?.roledtl?.role_name,
        })
      );
    }
  }, [project_id, projectData]);

  const render = projectdata?.project_name;

  const [breadCrumbValRoute] = useState("");

  const handleEditProjectData = (bool: boolean) => {
    handleEditAppData(bool);
  };

  useEffect(() => {
    if (!project_id) {
      setDeleteInitData(true);
    } else {
      setDeleteInitData(false);
    }
  }, [project_id]);

  return (
    <div>
      <Grid container>
        <CustomBackdrop open={loading || appListLoading} />

        <Grid item md={12} lg={12} sm={12} xs={12}>
          {setting ? (
            <Settings isOpen={isOpen} />
          ) : (
            <div>
              <TopBar
                initialProject={projectData?.projectDtl[0]}
                currentBreadCrumbProject={projectData?.projectDtl?.find(
                  (val: any) => val?._id === projectId
                )}
                currentBreadCrumbRoute={breadCrumbValRoute}
                onButtonClick={""}
                onCancel={""}
                workload_name={""}
              />
              <LandingDisplay
                landingDisplayData={projectData?.projectDtl?.find(
                  (val: any) => val?._id === projectId
                )}
              />
              <div className="app-work-container">
                <div className="applicationDisplay-container">
                  <ApplicationDisplay
                    initialProject={projectData?.projectDtl[0]}
                    appData={appListData}
                    handleEditProject={handleEditProjectData}
                  />
                </div>
                <div className="workloadDisplay-container">
                  {/* <WorkloadDisplay /> */}
                  <WorkloadLists initialProject={projectData?.projectDtl[0]} />
                </div>
              </div>
            </div>
          )}{" "}
        </Grid>
      </Grid>
    </div>
  );
};
