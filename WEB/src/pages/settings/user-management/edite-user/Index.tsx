import React from "react";
import { Grid } from "@mui/material";
// import { SettingsLayout } from "../../styles/setting-styles/Settings";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
// import "../../styles/setting-styles/Account.css";
import "../../../../styles/setting-styles/Account.css";
// import SetAccount from "./account-settings/SetAccount";

// import RoleSettingsTables from "./user-management/user-settings/UserSettings";
import { SettingsLayout } from "../../../../styles/setting-styles/Settings";
import EditeUser from "./EditeUser";
// import RoleSettingsTables from "./user-management/user-settings/UserSettings";
import UserBanner from "../../../../assets/images/user-side-banner.png";
import "../../../../styles/user-management-styles/EditeIndex.css"
import ArrowBackward from "../../../../assets/icons/ArrowBackward";
import RouterBackArrow from "../../../../assets/icons/RouterBackArrow";
import RoleMappingTable from "./RoleMapping";
import { useNavigate } from 'react-router-dom';
import { useEffect,useState } from "react";
import { getQueryParam } from "../../../../helper/SearchParams";
import { useLocation } from "react-router-dom";
import { getProjectInfoRequest } from "../../../../redux/slice/project-slice/GetProjectInfoslice";
import { Dispatch } from "redux";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { profileInfoRequest } from "../../../../redux/slice/setting-slice/profile-setting/ProfileSettingSlice";


interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}
function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
 
  
  

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 2 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const RoleSettings = (isOpen:any) => {
  const [value, setValue] = React.useState(0);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const tab = getQueryParam('tab');

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    navigate(`/overview/user-management?id=${id}&name=user&tab=${newValue}`)
  };
  const handleBackArrow = ()=>{
    navigate(`/overview/settings?tab=1`)
  }
  const userName = getQueryParam("name")
  const id=getQueryParam("id")



  const location = useLocation();
  const [values, setValues] = useState(0);
  const { profileData,loading} = useSelector(
    (state: any) => state.profileInfo
  );

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tab = Number(searchParams.get("tab"));
    setValue(tab || 0);
  }, [location]);

  useEffect(()=>{
    dispatch(profileInfoRequest(id));
    if (![0,1].includes(+tab!)) {
      navigate(`*`)
    }
  },[])
  

  return (
<div>
    <Grid container >
      <Grid item md={9} lg={9} xs={12} sm={9} className="user-tabs-block">
      <Typography  className="user-account-nav"> <span className="router-back-arrow" onClick={handleBackArrow}><RouterBackArrow/> <span className="user-router-heading">User management / {profileData?.first_name}</span></span></Typography>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="basic tabs example"
              TabIndicatorProps={{ style: { backgroundColor: "black" } }}
            >
              <Tab disableRipple={true} label="Details" {...a11yProps(0)}/>
              <Tab disableRipple={true} label="Role Mapping" {...a11yProps(1)} />
            
            </Tabs>
          </Box>
          <TabPanel value={value} index={0}>
                    <EditeUser/>
          </TabPanel>
          <TabPanel value={value} index={1}>
                        <RoleMappingTable/> 
          </TabPanel>
        

      </Grid>
      <Grid className="fixed-right" item md={3} lg={3} xs={12} sm={3}>
        <div className='edite-user-image'>
           <img src={UserBanner} className='user-image-responsive role-mapping-img-position' alt="role mapping banner"/>
        </div> 
      </Grid>
    </Grid>
    </div>
  );
};

export default RoleSettings;
