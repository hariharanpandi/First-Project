import * as React from "react";
import { Card } from "primereact/card";
import { getQueryParam } from "../../helper/SearchParams";
import { useEffect } from "react";
import { GetAppRequest } from "../../redux/slice/app-slice/GetAppInfoSlice";
import { Dispatch } from "redux";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useState } from "react";
import { UserIcon } from "../../assets/icons/UserIcon";
import { DataIcon } from "../../assets/icons/DataIcon";
import { CustomBackdrop } from "../../helper/backDrop";
import { Grid } from "@mui/material";
import { WorkLoadInfo } from "./WorkLoadInfo";
import TopBar from "../project/TopBar";
import ReactDOMServer from "react-dom/server";
import  {ReactComponent as EmtyAPP}  from "../../assets/icons/EmtyAPP.svg";
import { Skeleton } from "primereact/skeleton";
import _ from "lodash";

export const AppLanding = (render:any, isOpen:boolean) => {
  const appId: any = getQueryParam("app_id");
  const projectId: any = getQueryParam("projectId");
  const dispatch = useDispatch();
  const [appInfo, setAppInfo] = useState<any>();
  const { appData, appLoading } = useSelector((state: any) => state.GetApp);
  const EMTYAPPLICATION = `data:image/svg+xml;base64,${btoa(ReactDOMServer.renderToString(<EmtyAPP/>))}`;

  const { projectData } = useSelector(
    (state: any) => state.getProject
  );


  useEffect(() => {
    dispatch(GetAppRequest(appId));
  }, [appId]);

  useEffect(() => {
    window.scrollTo(0, 0)
    setAppInfo(appData);
  }, [appData]);

  return (
    <>
      <TopBar
        currentBreadCrumbProject={
          projectData?.projectDtl?.find((val: any) => val?._id === projectId)
        }
        currentBreadCrumbRoute={appInfo}
        onButtonClick={""}
        onCancel={""}
        workload_name={""}
      />
      {
        appLoading || _.isNil(appInfo) ? (
          <>
          <CustomBackdrop open={appLoading} />
            <Skeleton width="auto" className="application-skeleton" height="13.1875rem">
              <div className="applicationDisplay-loader">
                <div className={`loader-content`}></div>
              </div>
            </Skeleton>
          </>
        ) :
          <>
            <main className="app-landing">
              <div className="app-landing-info">
                <div>
                  <img
                    src={appInfo?.app_img ? appInfo.app_img : EMTYAPPLICATION}
                    className="app-landing-info-appimg"
                  />
                </div>
                <div className="app-landing-info-name">
                  <div> {appInfo?.application_name}</div>
                  <div className="app-landing-info-name-user">
                    <div className="app-landing-info-name-user-update">
                      <p className="app-usertext">
                        <UserIcon />
                      </p>
                      <p className="app-usertext"> Users:</p>
                      <div className="app-landing-info-name-user-count">
                        {appInfo?.user_count}
                      </div>

                    </div>

                    <div className="app-landing-info-name-user-update">
                      <p className="app-landing-info-name-user-date app-usertext">
                        <DataIcon />
                      </p>
                      <p className="app-usertext">Last Updated:</p>
                      <div>
                        {appInfo?.updated_at}
                      </div>
                    </div>

                  </div>
                </div>
              </div>
              <div className="app-landing-desc">{appInfo?.description}</div>
            </main>
          </>
      }
      <WorkLoadInfo />
    </>
  );
};
