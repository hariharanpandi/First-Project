import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import AddIcon from "@mui/icons-material/Add";
import KMSICON from "../../../assets/icons/KmsIcon.svg";
import CardLineIcon from "../../../assets/icons/CardLineIcon";
import "../../../styles/cloud-account-style/CloudApp.css";
import { useEffect } from "react";
import { Dispatch } from "react";
import { useDispatch } from "react-redux";
import { GetAppRequest } from "../../../redux/slice/app-slice/GetAppInfoSlice";
import { getQueryParam } from "../../../helper/SearchParams";
import { useSelector } from "react-redux";
import { appListRequest } from "../../../redux/slice/app-slice/AppListSlice";
import ReactDOMServer from "react-dom/server";
import  {ReactComponent as EmtyAPP}  from "../../../assets/icons/EmtyAPP.svg";
import DialogModal from "../../application/AppModal";
import { useState } from "react";
import { createAppRequest } from "../../../redux/slice/app-slice/CreateProjectSlice";
import { useNavigate, useSearchParams } from "react-router-dom";
import CustomTooltip from "../../../components/CustomTooltip";

interface CardData {
  title: string;
  image: string;
}

const cardData: CardData[] = [
  { title: "LMS", image: KMSICON },
  { title: "KMS", image: KMSICON },
];




export default function CloudApp() {
  const allAccessLevel = useSelector((state: any) => state.accessLevels);
  const projectId: any = getQueryParam("projectId");
  const [dialogVisible, setDialogVisible] = useState(false);
  const { appListData, appListLoading } = useSelector((state: any) => state.appList);
  const EMTYAPPLICATION = `data:image/svg+xml;base64,${btoa(ReactDOMServer.renderToString(<EmtyAPP/>))}`;
  const { projectData } = useSelector(
    (state: any) => state.getProject
  );
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const role_name = projectData?.projectDtl?.find((data: Record<string, any>) => data?._id === projectId)?.roledtl?.role_name;
    dispatch(appListRequest({
      project_id: projectId,
      role_name
    }));
  }, [projectData]);
  const hideDialog = (data: any) => {
    setDialogVisible(false);
  };
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
  const handleApplication = (event: any, application: any) => {
    navigate(
      `?application-landing=true&app_id=${
        application?.application
          ? application.application?._id
          : application?._id
      }&projectId=${projectId}`
    );
   // setEditApp(application);
  };
 
  return (
    <div>
      <div className="cloud-application-heading">Cloud Application</div>

      <Grid container className="overal-applicatin-card">
      {
        allAccessLevel?.createApplicationLevelRbac &&
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          lg={3}
          className="cloud-application-list"
        >
         
          <Card className="specific-application-card"  onClick={() => setDialogVisible(true)}>
            <div className="application-add-icon">
              <AddIcon />
            </div>
            <div className="application-add-text" >New Application</div>
          </Card>
       
        </Grid>
        }

        {appListData?.map((app:any) => (
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            lg={3}
            key={app?.app_name}
            className="cloud-app-map-list"
          >
            <Card className="specific-mapd-application"  onClick={(event) =>
                                            handleApplication(
                                              event,
                                              app
                                            )
                                          } >
              <div className="application-cloud-img">
                <img
                 src={app.app_img ? app.app_img : EMTYAPPLICATION}
                 alt={app.title}
                 width={50}
                 height={50}
                     />
              </div>
              <div>
              <CustomTooltip title={app.app_name} placement="top">
                <div className="application-card-title">{app.app_name}</div>
                </CustomTooltip>
                <div className="total-application-account">{app?.count} workloads</div>
              </div>
            </Card>
          </Grid>
        ))}
      </Grid>
      <DialogModal
        visible={dialogVisible}
        onHide={hideDialog}
        handleForm={handleCreateApp}
      />
    </div>
  );
}
