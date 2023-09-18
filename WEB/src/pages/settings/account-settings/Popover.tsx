import React, { useState, useRef } from "react";
import {
  Button,
  Popover,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import SettingIcon from "../../../assets/icons/SettingIcon";
import "../../../styles/setting-styles/Account.css";
import HelpIcon from "../../../assets/icons/HelpIcon";
import SignoutIcon from "../../../assets/icons/SignoutIcon";
import { useLocation, useNavigate } from "react-router-dom";
import { PrivacyPolycyRequest } from "../../../redux/slice/cms-slice/PrivacySlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import PrivacyPolicy from "../../../components/common/PrivacyPolicys";
import { CustomBackdrop } from "../../../helper/backDrop";
import { getQueryParam } from "../../../helper/SearchParams";
import { persistor, store } from "../../../redux/store";
import ConfirmLeaving from "../../../components/ConfirmLeaving";
interface CustomPopoverProps {
  isOpenn: boolean;
  onClose: () => void;
  onSettingsClick: (value: boolean) => void;
  anchorEl: any;
}

const CustomPopover = ({
  isOpenn,
  onClose,
  onSettingsClick,
  anchorEl
}: CustomPopoverProps) => {
  const buttonRef = useRef(null);
  const location = useLocation();
  const pathname = location.pathname;
  const isWorkloadScreen = pathname.includes("/overview/workload");
  // const [anchorEl, setAnchorEl] = useState(null);

  const [setting, setSetting] = useState(false);
  const [help, setHelp] = useState(false);
  const [signout, setSignout] = useState(false);
  const [open, setOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: "", content: "" });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const helps = getQueryParam('help')
  const [isResource, setIsResource] = useState<boolean>(false);
  const { privacyData ,isLoading} = useSelector((state: any) => state.privacyPolicy);

  const handleSettingsClick = () => {
    setSetting(true);
    onSettingsClick(true);
    onClose();
  };
  useEffect(() => {
    const payload: any = "help";
    dispatch(PrivacyPolycyRequest(payload));
  }, [helps]);

  // const handleHelpClick = () => {
  //   setHelp(true);
  //   onClose();
  // };
  const handleTermsClose = () => {
    setOpen(false);
  };

  const handleSignOutClick = () => {
    if (JSON.parse(localStorage.getItem('is_resource')!) &&
      isWorkloadScreen
    ) {
      setIsResource(true);
      return
    }
    setSignout(true);
    localStorage.clear();
    store.dispatch({ type: "reset", all: true });
    persistor.purge();
    onClose();
    window.location.href = '/';
    // navigate("/");
  };

  const handleHelpClick = (title: string, content: string) => {
    const payload: any = "help";

    dispatch(PrivacyPolycyRequest(payload));

    setHelp(true);
    onClose();

    setModalContent({ title, content });

    setOpen(true);
  };

  const stayOnWorkloadScreen = (): void => {
    localStorage.setItem('is_resource', JSON.stringify(false));
    handleSignOutClick();
  };

  const leaveWorkloadScreen = (): void => {
    setIsResource(false)
  };

  return (
    <>
      <CustomBackdrop open={isLoading} />
      <Popover
        open={isOpenn}
        onClose={onClose}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        className="popover-style"
      >
        <Box
          sx={{
            backgroundColor: " rgb(32, 38, 45)",
            color: "white",
          }}
        >
          <div className="popover-content">
            <div onClick={handleSettingsClick} className="popover-text">
              <div>
                <SettingIcon />
              </div>
              <span className="poppover-name">Settings</span>
            </div>
            <div
              onClick={(e) =>
                handleHelpClick(
                  privacyData.page_title,
                  privacyData.page_description
                )
              }
              className="popover-text"
            >
              <div>
                <HelpIcon />
              </div>
              <span className="poppover-name">Help</span>
            </div>
            <div onClick={handleSignOutClick} className="popover-text">
              <div>
                <SignoutIcon />
              </div>
              <span className="poppover-name">Sign Out</span>
            </div>
          </div>
        </Box>
      </Popover>
      <PrivacyPolicy open={open} onClose={handleTermsClose} {...modalContent} />
      <ConfirmLeaving
      isResource={isResource}
      leaveWorkloadScreen={leaveWorkloadScreen}
      stayOnWorkloadScreen={stayOnWorkloadScreen}
    />
    </>
  );
};

export default CustomPopover;
