import React, { useEffect } from "react";
import { Grid } from "@mui/material";
import { SettingsLayout } from "../../styles/setting-styles/Settings";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import "../../styles/setting-styles/Account.css";
import SetAccount from "./account-settings/SetAccount";
 import RoleSettingsTables from "./user-management/user-settings/UserSettings";
import { getLocalStorage } from "../../helper/LocalStorage";
import { useNavigate } from "react-router-dom";
import { getQueryParam } from "../../helper/SearchParams";
import TopBar from "../project/TopBar";
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

const Settings = (isOpen:any) => {
  const [value, setValue] = React.useState(0);
  const navigate = useNavigate();
  const tab = getQueryParam('tab');

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    navigate(`/overview/settings?tab=${newValue}`)
  };

  useEffect(() => {
    setValue(+tab!);
    if (![0,1].includes(+tab!)) {
      navigate(`*`)
    }
  }, [navigate, tab])

  const role = getLocalStorage('user_type')
  return (
    <Grid container >
      <Grid
        item
        lg={12}
        md={12}
        xs={12}
        sm={12}
        sx={{ backgroundColor: "#161C23" }}
       className="setting-sticky"
      >
        <TopBar
          currentBreadCrumbProject={'Settings'}
          currentBreadCrumbRoute={""}
          onButtonClick={""}
          onCancel={""}
          workload_name={""}
        />

      </Grid>
      <Grid item md={12} lg={12} xs={12} sm={12} className="tabs-block">
        {/* <Box sx={{ width: "100%" }} className="tabs-block"> */}
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="basic tabs example"
              TabIndicatorProps={{ style: { backgroundColor: "black" } }}
            >
              <Tab disableRipple={true} label="Account" {...a11yProps(0)} />
              {
                role === "A" ? <Tab disableRipple={true} label="User Management" {...a11yProps(1)} />  : ''
              }
              
            </Tabs>
          </Box>
          <TabPanel value={value} index={0}>
            <SetAccount />
          </TabPanel>
          <TabPanel value={value} index={1}>
         <RoleSettingsTables/>
          </TabPanel>
        
        {/* </Box> */}
      </Grid>
    </Grid>
  );
};

export default Settings;