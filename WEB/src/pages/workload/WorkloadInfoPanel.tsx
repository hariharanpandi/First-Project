import React from "react";
import Drawer from "@mui/material/Drawer";
import "../../styles/workload-styles/WorkloadInfoPanel.css";
import WarnIcon from "../../assets/icons/WarnIcon";
import CloseIcon from "../../assets/icons/CloseIcon";
import { useSelector } from "react-redux";

interface WorkloadInfoPanelProps {
  isDrawerOpen: boolean;
  handleToggleDrawer: (
    open: boolean
  ) => (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

const WorkloadInfoPanel: React.FC<WorkloadInfoPanelProps> = ({
  isDrawerOpen,
  handleToggleDrawer,
}) => {
  const { getWorkloadInfo, workloadInfoLoading } = useSelector(
    (state: any) => state.getWorkloadInfo
  );

  return (
    <div>
      <Drawer
        anchor="right"
        open={isDrawerOpen}
        onClose={handleToggleDrawer(false)}
        ModalProps={{
          keepMounted: true,
        }}
        className="workload-info-drawer"
      >
        <div className="workload-info-drawer-heading">
          <div className="div_head">Info Panel</div>
          <div className="div_icon" onClick={handleToggleDrawer(false)}>
            <CloseIcon />
          </div>
        </div>
        {workloadInfoLoading ? (
          <div className="workload-info-panel-loader">
            <div className={`loader-content`}></div>
          </div>
        ) : (
          <>
            {getWorkloadInfo ? (
              <div>
                {
                  getWorkloadInfo?.message &&
                <div className="workload-info-drawer-note-alert">
                  <div className="heading">
                    <span className="span_icon">
                      <WarnIcon />
                    </span>{" "}
                    <span className="span_head">Note</span>
                  </div>
                  <div className="info">
                    <div className="info-div-1">
                      The resource has been already used in
                    </div>
                    <div className="info-div-2">
                      {getWorkloadInfo?.message?.replace(
                        new RegExp(
                          "The resource has been already used in",
                          "g"
                        ),
                        ""
                      )}
                    </div>
                  </div>
                </div>
                }
                <div className="workload-info-drawer-details">
                  <div className="heading">Details</div>
                  <>
                    <>
                      {Object.keys(getWorkloadInfo).map((key) => (
                        <>
                          {key !== "message" && (
                            <div className="points">
                              <div className="key">{key}: </div>
                              <div className="value">
                                {getWorkloadInfo[key] ? getWorkloadInfo[key] : <div style={{visibility: 'hidden'}}>.</div>}
                              </div>
                            </div>
                          )}
                        </>
                      ))}
                    </>
                  </>
                </div>
              </div>
            ) : (
              <div className="no-data-found-container">
                <div className="no-data-found">No Data found</div>
              </div>
            )}
          </>
        )}
      </Drawer>
    </div>
  );
};

export default WorkloadInfoPanel;
