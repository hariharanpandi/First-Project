import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import AddIcon from "@mui/icons-material/Add";
import "../../../styles/cloud-account-style/CloudSummary.css";
import aws from "../../../assets/icons/AmazonIcon.svg";
import azure from "../../../assets/icons/AzureIcon.svg";
import gci from "../../../assets/icons/GcloudIcon.svg";
import oci from "../../../assets/icons/OciClodIcon.svg";
import CardLineIcon from "../../../assets/icons/CardLineIcon";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { fetchCloudCountRequest } from "../../../redux/slice/discovery-slice/CloudCountSlice";
import { useSelector } from "react-redux";
import { getQueryParam } from "../../../helper/SearchParams";
import { useNavigate } from "react-router-dom";
import { resetCloudPersistData } from "../../cloud/ResetCloudPersistData";
import CloudAccount from "./CloudAccounts";
import CloudEmtyIcon from "../../../assets/icons/CloudEmtyIcon";
import CloudApp from "./CloudApps";

export default function CloudSummary() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const allAccessLevel = useSelector((state: any) => state.accessLevels);
  const { success, loading, countData } = useSelector(
    (state: any) => state.cloudcounts
  );
  const projectId = getQueryParam("projectId");
  const projectName = getQueryParam("projectName");
  useEffect(() => {
    dispatch(fetchCloudCountRequest(projectId));
    resetCloudPersistData(dispatch);
  }, [projectId]);

  const handleNavigation = (): void =>
    navigate(`/overview/discovery/${projectId}/cloud-platform/aws`);

  // *pass props as cloudAccounts*//
  const imageMap: any = {
    aws: aws,
    azure: azure,
    gcp: gci,
    oci: oci,
  };
  const codeMap = {
    aws: "ec2",
    azure: "azure_arm",
    gcp: "gcp",
    oci: "oci",
  };
  const CLOUDS = countData
    ? Object.entries(countData).map(([key, value]) => {
        let upperCaseKey;
        if (key === "azure") {
          upperCaseKey = "Azure";
        } else if (key === "aws") {
          upperCaseKey = "AWS";
        } else {
          upperCaseKey = key;
        }
        return {
          name: upperCaseKey,
          code: codeMap[key as keyof typeof codeMap],
          cloudImg: imageMap[key as keyof typeof imageMap],
        };
      })
    : [];

  return (
    <div>
      {countData && Object.keys(countData).length > 0 && (
        <>
          <div className="cloud-accound-summary">Cloud Account Summary</div>

          <Grid container className="overal-discovery-card">
            {allAccessLevel?.createProjectLevelRbac && (
              <Grid item xs={3} sm={2} className="discovery-card">
                <Card className="specific-card">
                  <CardContent className="card-content">
                    <div
                      className="summary-add-icon"
                      onClick={handleNavigation}
                    >
                      <AddIcon />
                    </div>
                    <div className="summary-add-text">Add New</div>
                  </CardContent>
                </Card>
              </Grid>
            )}
            {countData &&
              typeof countData === "object" &&
              Object.entries(countData).map(
                ([key, value]: any, index: number) => {
                  let upperCaseKey;
                  if (key === "azure") {
                    upperCaseKey = "Azure";
                  } else if (key === "aws") {
                    upperCaseKey = "AWS";
                  } else {
                    upperCaseKey = key;
                  }
                  return (
                    <Grid
                      item
                      xs={3}
                      sm={2}
                      key={key}
                      className="discovery-card"
                    >
                      <Card className="specific-mapd-card">
                        <CardContent className="maped-card-content">
                          <div className="card-cloud-img">
                            <img src={imageMap[key]} alt={key} />
                          </div>
                          <div className="summary-card-title">{upperCaseKey}</div>
                          <div className="summary-card-line">
                            <CardLineIcon />
                          </div>
                          <div className="cloud-account-text">
                            Total Cloud Accounts
                          </div>
                          <div className="cloud-count">{value}</div>
                        </CardContent>
                      </Card>
                    </Grid>
                  );
                }
              )}
          </Grid>
          <div>
            <CloudAccount CLOUDS={CLOUDS} />
          </div>
          <>
            <CloudApp />
          </>
        </>
      )}

      {countData && Object.keys(countData).length === 0 && (
        <>
          <div className="cloud-ant">Cloud Accounts</div>
          <div className="emty-cloud-accountces">
            <div className="new-cloud-onbording">
              <CloudEmtyIcon />
              <div className="nothing-onboard-it">Nothing onboarded yet</div>
              <div className="Onbord-new-cloud-text">
                Onboard new cloud accounts to get access to cloud services
              </div>
              {allAccessLevel?.createProjectLevelRbac && (
                <div
                  onClick={handleNavigation}
                  className="add-new-cloud-button"
                >
                  + Add new
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
