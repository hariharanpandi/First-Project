// Import Material-UI icons
import BlockIcon from "@material-ui/icons/Block";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";


// Import lodash utility library
import _ from "lodash";

// Import PrimeReact components
import { Chip } from "primereact/chip";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { PaginatorPageChangeEvent } from "primereact/paginator";
import { ProgressBar } from "primereact/progressbar";
import { Button } from "primereact/button";

// Import React components and hooks
import { SetStateAction, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

// Import custom icons and images
import SearchIcon from "../../../assets/icons/SearchIcon";
import ProgressIcon from "../../../assets/images/Progress.svg";
import Discovery from "../../../assets/images/discovery.svg";
import Failure from "../../../assets/images/failure.svg";
import Success from "../../../assets/images/success.svg";
import profilePlaceHolder from "../../../assets/images/user-profile-placeholder.svg";
import LockIcon from "../../../assets/icons/LockIcon";

// Import custom components
import CustomPaginator from "../../../components/CustomPaginator";
import CustomTooltip from "../../../components/CustomTooltip";
import PreventSpaceAtFirst from "../../../components/PrventSpaceAtFirst";
import ConfirmationDialog from "../../project/ProjectDelete";
import { ConfirmDialog } from "primereact/confirmdialog";

// Import helper functions and utilities
import { getQueryParam } from "../../../helper/SearchParams";
import MySnackbar from "../../../helper/SnackBar";
import { CustomBackdrop } from "../../../helper/backDrop";
import {
  // CLOUDS,
  CloudCommonTable,
} from "../../../helper/common-table/commonTable";
import formateDateTime from "../../../helper/formateDateTime";

// Import Redux actions
import { cloudDiscoverRequest, cloudDiscoverReset } from "../../../redux/slice/discovery-slice/CloudDiscoverSlice";
import { getCloudUserRequest } from "../../../redux/slice/discovery-slice/CloudUserSlice";
import { discoveryRequest } from "../../../redux/slice/discovery-slice/DiscoverySlice";
import { getProjectInfoRequest } from "../../../redux/slice/project-slice/GetProjectInfoslice";
import { deleteUserRequest } from "../../../redux/slice/user-management-slice/DeleteUserSlice";
import { getManageUserRequest } from "../../../redux/slice/user-management-slice/GetManageUserSlice";
import { updateUserStatusRequest } from "../../../redux/slice/user-management-slice/UpdateUserStatusSlice";

// Import SCSS styles
import "../../../styles/user-management-styles/UserSettingStyles";
import FilterGateIcon from "../../../assets/icons/FilterGateIcon";
import { Checkbox, Popover } from "@mui/material";

import VisibleFeatures from "../../../helper/visibleFeatures";

// Define an interface for the UserList data structure
interface UserList {
  total_users: number;
  user_list: {
    _id: string;
    user_type: string;
    user_name: string;
    name: string;
    account: string;
    status: string;
    discovery_status: string;
    discovery_progress_percentage: string;
    role_unmapped: true;
    email: string;
    created_at: string;
    last_login_at: string;
    user_img: string;
    discovery_date: string;
    discovery_locked:boolean;
  }[];
}

// Define an interface for the User data structure
interface User {
  _id: string;
  name: string;
  account: string;
  user_img: string;
  email: string;
  user_type: "A" | "N";
}

export default function CloudAccount(CLOUDS:any) {

  //Define and initialize the hook (useNaviagte , useDispacth)
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Select the required states from the Redux store using the useSelector hook
  const { cloudUserData, cloudLoading } = useSelector(
    (state: any) => state.getCloudUser
  );
  const { userEditType, editLoading } = useSelector(
    (state: any) => state.updateUserStatus
  );
  const { cloudDiscovery, cloudDiscoveryLoading, cloudDiscoveryError,cloudDiscoverySuccess } =
    useSelector((state: any) => state.cloudDiscover);
  const { success, loading, projectInfoData } = useSelector(
    (state: any) => state.getProjectInfo
  );
  const { manageUserData, manageLoading } = useSelector(
    (state: any) => state.getManageUser
  );
  const { discoveryData,discoveryLoading,discoveryError } = useSelector((state: any) => state.discovery);
  const { DeleteUser } = useSelector((state: any) => state.deleteUser);

  // Define and initialize the state variables
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [anchorEl, setAnchorEl] = useState<null | SVGSVGElement>(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [userList, setUserList] = useState<UserList>({
    total_users: 0,
    user_list: [],
  });
  const [ModalOpen, setModalOpen] = useState(false);
  const [snackOpen, setSnackOpen] = useState(false);
  const [EditeModalOpen, setEditeModalOpen] = useState(false);
  const [isUserDelete, setIsUserDelete] = useState(false);
  const [severity, setSeverity] = useState("");
  const [message, setMessage] = useState("");
  const [typedValue, setTypedValue] = useState("");
  const [selectedUser, setselectRowUser] = useState<any>({});
  const [cloudId, setCloudId] = useState<any>();
  const [onSortOrder, setOnSortOrder] = useState<any>(-1);
  const [selectRowUser, setSelectRowUser] = useState<any>(null);
  const [selectedCloud, setSelectedCloud] = useState<any>(CLOUDS.CLOUDS[0]);
  const [popoverAnchorEl, setPopoverAnchorEl] =
    useState<HTMLButtonElement | null>(null);
  const [onSortFiled, setOnSortFiled] = useState<string>("account");
  const [isDiscovery,setIsDiscovery] = useState<any>();
  const [discoveryState,setDiscoveryState]= useState<any>();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // Extract and store the query parameters from the URL
  const project_id: any = getQueryParam("projectId");
  const project_name = getQueryParam("projectName");
  const manageUser = getQueryParam("manageuser");
  const accessLevels = VisibleFeatures(project_id);


  //Define the varaibles for popoup toggling
  const open = Boolean(popoverAnchorEl);
  const openEL = Boolean(anchorEl);
  const idb = open ? "simple-popover" : undefined;
  const idEL = openEL ? "simple-popover" : undefined;

  // useEffect hook to handle the user data updates
  useEffect(() => {

    // Check if cloudUserData is available and has user_list data
    if (cloudUserData && cloudUserData?.data?.user_list?.length > 0) {

      // Map over the user_list array to update the structure of each item
      const updatedUserList = cloudUserData?.data?.user_list?.map(
        (item: UserList["user_list"][number]) => ({
          ...item,
          user_template: {
            account: item.account,
            name: item.user_name,
            email: item.email,
            user_img:
              !_.isNil(item.user_img) && item.user_img !== ""
                ? item.user_img
                : profilePlaceHolder,
            user_type: item.user_type,
          },
          user_status: {
            status: item.status,
            isroleunmapped: item.role_unmapped,
          },
          action_bar: {
            user_type: item.user_type,
            _id: item._id,
          },
        })
      );

      // Update the state with the updatedUserList
      setUserList({
        total_users: cloudUserData?.data?.total_users,
        user_list: updatedUserList,
      });
    } else if (
      !_.isNil(cloudUserData) &&
      cloudUserData?.data?.user_list?.length === 0
    ) {

      // If cloudUserData exists but user_list is empty, update the state with the original cloudUserData
      setUserList({
        total_users: cloudUserData?.data?.total_users,
        user_list: cloudUserData?.data?.user_list,
      });
    }
  }, [cloudUserData, cloudLoading]);

  // The useEffect hook to fetch cloud user data when there are changes to the specified dependencies
  useEffect(() => {

    // Determine the sort order based on the onSortOrder state
    const sortOrder = onSortOrder === -1 ? "desc" : "asc";

    // Create the query parameters for the API request
    let condtionBody: any = {
      queryparams: `project_id=${project_id}&cloud_name=${selectedCloud?.code}&limit=${rows}&page=${currentPage}&sort=${onSortFiled}&orderBy=${sortOrder}`,
    };

    // Check if there is a typedValue (search query)
    if (typedValue !== "") {

      // Append the search query to the query parameters
      condtionBody.queryparams += `&search=${typedValue.trim()}`;
    }

    // Dispatch the getCloudUserRequest action to fetch cloud user data with the specified query parameters
    dispatch(getCloudUserRequest(condtionBody));
  }, [
    currentPage,
    dispatch,
    rows,
    typedValue,
    manageUser,
    onSortFiled,
    onSortOrder,
    DeleteUser,
    editLoading,
    selectedCloud,
  ]);

  //Navigate to the cloud Onboarding page when the user click the account name
  const handleNavigate =
    (data: any): React.MouseEventHandler<HTMLDivElement> =>
    (event) => {
      navigate(
        `/overview/discovery/${project_id}/cloud-platform/${selectedCloud?.name?.toLocaleLowerCase()}/${
          data?._id
        }`
      );
    };

    useEffect(()=>{
       if(discoveryError)
      {
        setSnackOpen(true);
        setMessage(discoveryError)
        setSeverity("error")
      }

    },[discoveryError])
    useEffect(()=>{
      if(cloudDiscoverySuccess)
      {
        setSnackOpen(true);
        setMessage("Cloud Discover initiated Successfully")
        setSeverity("success")

      }
      else if(cloudDiscoveryError)
      {
        setSnackOpen(true);
        setMessage(cloudDiscoveryError)
        setSeverity("error")
      }
      return () => {
        dispatch((cloudDiscoverReset()));
      };
    },[cloudDiscoverySuccess,cloudDiscoveryError])

  const userItemTemplate = ({ user_template }: { user_template: User }) => {
    const { email, user_img, account, user_type, _id } = user_template;

    return (
      <div className="user-container">
        <div className="user-container-profile">
          <span>
            <span className="color-white-primary text-underline-hover font-md custom-cursor">{account}</span>
          </span>
        </div>
      </div>
    );
  };

  const addedDataTemplate = ({ user_template }: { user_template: User }) => {
    const { email, user_img, name, user_type } = user_template;
    return (
      <div className="user-container">
        <img className="border-radius-50per" alt={name ?? ""} src={user_img} width="40" height="40" />
        <div className="user-container-profile">
          <span className="color-white-primary font-md">
            {name}
            {user_type === "A" && " (Admin)"}
          </span>
          <span className="color-white-secondary font-sm">{email}</span>
        </div>
      </div>
    );
  };

  const lastActiveTemplate = ({ created_at }: { created_at: string }) => {
    const lastLoginAt = formateDateTime(created_at);
    if (lastLoginAt === " - ") {
      return <div>{lastLoginAt}</div>;
    } else {
      return (
        <div>
          <div className="color-white-primary font-md">
            {lastLoginAt.date ?? " - "}
          </div>
          <div className="color-white-secondary font-sm">
            {lastLoginAt.time ?? " - "}
          </div>
        </div>
      );
    }
  };

  const selectedCountryTemplate = (option: any, props: any) => {
    if (option) {
      return (
        <div className="flex align-items-center">
          <div className="img-div">
            <img
              alt={option.name}
              src={selectedCloud?.cloudImg}
              className={`mr-2 flag flag-${option.code.toLowerCase()}`}
              style={{
                width: "4rem",
                padding: "1rem",
                backgroundColor: "#20262D",
                borderRadius: "7px",
              }}
            />
            <div className="option-name">{option.name}</div>
          </div>

          <span className="total-user">
            {userList?.total_users === 1 ? `${userList.total_users ?? 0} account` : `${userList?.total_users ?? 0} accounts`}
          </span>
        </div>
      );
    }

    return <span>{props.placeholder}</span>;
  };

  const countryOptionTemplate = (option: any) => {
    return (
      <div className="flex align-items-center">
        <div>{option.name}</div>
      </div>
    );
  };

  const panelFooterTemplate = () => {
    return (
      <div className="py-2 px-3">
        {selectedCloud ? (
          <span>{/* <b>{selectedCloud?.name}</b>  */}</span>
        ) : (
          ""
        )}
      </div>
    );
  };

  const actionBarTemplate = ({
    user_type,
    _id,
    discovery_status,
    account,
    discovery_locked
    
  }: {
    user_type: "A" | "N";
    _id: string;
    discovery_status: string;
    account: string;
    discovery_locked:boolean;
  }) => {
    
    return (
      <>
        <div className="progress-div">
          <span
            onClick={(e) => {
              setCloudId(_id);
              // setIsButtonDisabled(true);
              const discoverReqBody: any = {
                title: account,
                cid: _id,
                provider: selectedCloud?.code,
                purpose: "discovery",
                project_id: project_id,
                project_name: projectInfoData?.data?.project_name,
              };
              // Enable the button after 30 minutes
              // setTimeout(() => {
              //   setIsButtonDisabled(false);
              // }, 30 * 60 * 1000);
              // 30 minutes in milliseconds
              if(_.isNil(discovery_status)){
                dispatch(cloudDiscoverRequest(discoverReqBody))
              }
             else if(discovery_locked === true && discovery_status.toLowerCase()=== "success")
              {
                setShowConfirmDialog(true);
              }

              // else if(discovery_status.toLowerCase()=== "success")
              // {
             
              //     setShowConfirmDialog(true);
              //       setTimeout(() => {
              //         setShowConfirmDialog(false);
              // }, 30 * 60 * 1000);
            
             else if( discovery_status.toLowerCase() !==  "inprogress")
              {
                dispatch(cloudDiscoverRequest(discoverReqBody))

              }
             else{

             }

              
            }}
            className="discover-style"
          >

            <Chip
              label="Discover"
              icon={discovery_locked === true ? <span style={{padding:"6px"}}><LockIcon/></span>:""}
               className={discovery_status && discovery_status.toLowerCase() === "inprogress" ? "chip-disable" : "chip-normal"}
            />
          </span>
        </div>
      </>
    );
  };

  const onPageChange = (event: PaginatorPageChangeEvent) => {
    setFirst(event.first);
    setRows(event.rows);
    const newPage = Math.floor(event.first / event.rows) + 1;
    setCurrentPage(newPage);
  };

  const onInputSearch = (event: {
    target: { value: SetStateAction<string> };
  }) => {
    setTypedValue(event.target.value);
  };

  useEffect(() => {
    dispatch(getProjectInfoRequest(project_id));
  }, [project_id]);

  const statusTemplate = ({ user_status }: Record<string, any>) => {
    return (
      <>
        <span
          className={
            user_status.status === "Active"
              ? "status-active-color"
              : "status-inactive-color "
          }
        >
          {user_status.status}
        </span>
        {user_status.isroleunmapped && (
          <span className="p-l-8 warning-icon">
            <CustomTooltip title="Roles unmapped" placement="top">
              <img alt="role unmapped" src="fj.jpg" width="15" height="15" />
            </CustomTooltip>
          </span>
        )}
      </>
    );
  };
  const activityBodyTemplate = ({
    discovery_progress_percentage,
    discovery_date,
    discovery_status,
    _id,
  }: any) => {
    return (
      <>
        <div className="progress-div">
          {discovery_status?.toLowerCase() === "inprogress" ? (
          
            <>
              <img src={ProgressIcon} alt="prog" />
              <span className="progress-value">
                {discovery_progress_percentage}%
              </span>
              <ProgressBar
                className="progress-bar"
                value={discovery_progress_percentage}
                showValue={false}
                style={{ height: "6px" }}
              >
                {discovery_progress_percentage === null
                  ? discovery_progress_percentage
                  : ""}
              </ProgressBar>
              <div
                className="refresh-icon"
                onClick={() => {
                  setCloudId(_id);
                  dispatch(discoveryRequest(_id));
                }}
              >
                <img src={Discovery} alt="" />
              </div>
            </>
          ) : (
            <div>
           
              {discovery_status ? (
               
                
                
                <img
                  src={
                    (discovery_status && discovery_status?.toLowerCase() === "success" ) ||
                    (discovery_progress_percentage &&
                      discovery_progress_percentage === "100" &&
                      discovery_status.toLowerCase() !== "Failed")
                      ? Success
                      : Failure
                  }
                  width={20}
                  height={20}
                />
              ) : (
                ""
              )}

              <span>
                {" "}
                {discovery_status === null || "" ? "" : discovery_status}
              </span>
            </div>
          )}
        </div>

        <span className="color-white-secondary font-sm">{discovery_date}</span>
      </>
    );
  };

  const onHandleSort = (event: any) => {
    setOnSortFiled(event.sortField);
    setOnSortOrder(event.sortOrder);
  };

  const paginatorProps = {
    rows: rows,
    totalRecords: +userList.total_users ?? 0,
    first: first,
    onPageChange: onPageChange,
  };

  useEffect(() => {
    const updatedData = userList.user_list.map((el) =>
      el._id === cloudId
        ? {
            ...el,
            discovery_status:discoveryData?.discovery_status,
            discovery_progress_percentage:
              discoveryData?.discovery_progress_percentage,           
             discovery_date:discoveryData?.discovery_date,
             discovery_locked:discoveryData?.discovery_locked
          }
        : el
    );
    setUserList({
      total_users: cloudUserData?.data?.total_users,
      user_list: updatedData,
    });
    
  }, [discoveryData]);

  useEffect(() => {
    const updatedData = userList.user_list.map((el) =>
      el._id === cloudId
        ? {
            ...el,
            discovery_status: cloudDiscovery?.discovery_status,
            discovery_progress_percentage:
              cloudDiscovery?.discovery_progress_percentage,
            discovery_date: cloudDiscovery?.discovery_date,
            discovery_locked:cloudDiscovery?.discovery_locked
          }
        : el
    );
    setUserList({
      total_users: cloudUserData?.data?.total_users,
      user_list: updatedData,
    });
  }, [cloudDiscovery]);

  const handleOnrowSelect = (data: any) => {
    setCloudId(data?._id);
  };
  const handleSnackbarClose = () => {
    setSnackOpen(false);
  };

  const [headerData, setHeaderData] = useState<any>(
    CloudCommonTable.CLOUD_LIST.COLUMNS
  );
  const [popoverOpen, setPopoverOpen] = useState<boolean>(false);
  const [checked, setChecked] = useState<any>("");
  const [clientX, setClientX] = useState<number>(0);
  const [clientY, setClientY] = useState<number>(0);

  const handleFilterPopover = (event: any) => {
      setClientX(event.clientX);
      setClientY(event.clientY);
      setPopoverOpen(true);
  };

  const handleClose = () => {
    setPopoverOpen(false);
  };

  const handleCheck = () => {
    setChecked(!checked);
  };

  const checkBoxStylee = {
    "& .MuiSvgIcon-root": {
      fontSize: 20,
    },
    "&.MuiCheckbox-colorPrimary.Mui-checked": {
      color: "#F46662 !important",
      position: "relative",
      left: "3.6px",
    },
    "&.MuiCheckbox-colorPrimary": {
      color: "#ffff",
      position: "relative",
      left: "3.6px",
      right: "-4px",
    },
  };

  const handleFilterData = (index: number, data: any) => {
    const updateArray = [...headerData];
    if(data.isDefault === true) {
      updateArray[index] = { ...data, isDefault: false };
    } else if (data.isDefault === false) {
      updateArray[index] = { ...data, isDefault: true };
    }
    setHeaderData(updateArray);
  };
  const handleQuit = () => {
    setShowConfirmDialog(false);
  };
  
  //Return the Data Table template for cloud account Summary
  return (
    <>
      <div className="cloud-ant">Cloud Accounts</div>
      <CustomBackdrop open={cloudLoading || cloudDiscoveryLoading||discoveryLoading} />
      <div className="table-wrapper">
        <Dropdown
          value={selectedCloud || ""}
          onChange={(e) => {
            setSelectedCloud(e.value)
          }}
          options={CLOUDS.CLOUDS}
          optionLabel="name"
          placeholder="Select a Cloud"
          valueTemplate={selectedCountryTemplate}
          itemTemplate={countryOptionTemplate}
          className="w-full md:w-14rem"
          panelFooterTemplate={panelFooterTemplate}
        />
        <div className="position-releative">
          <span className="position-search-icon">
            <SearchIcon />
          </span>
          <InputText
            className="color-white-secondary"
            value={typedValue}
            onChange={onInputSearch}
            onKeyDown={(event) => PreventSpaceAtFirst(event)}
            placeholder="Search"
          />
        </div>
      </div>
      <DataTable
        value={userList.user_list ?? []}
        rows={rows}
        first={first}
        rowsPerPageOptions={[5, 10, 25, 50]}
        onRowClick={(e: any) => {
          handleOnrowSelect(e.data);
        }}
        sortField={onSortFiled}
        sortMode="single"
        sortOrder={onSortOrder}
        onSort={onHandleSort}
      >
        {headerData.map(({ field, header, isDefault }:any, index:number) => {
          if (field === "user_template" && isDefault) {
            return (
              <Column
                key={index}
                header={header}
                field={field}
                sortField="account"
                sortable
                body={(rowData) => (
                  <div onClick={handleNavigate(rowData)}>
                    {userItemTemplate(rowData)}
                  </div>
                )}
              />
            );
          } else if (field === "account_type"  && selectedCloud?.name?.toLowerCase() !== "azure" && isDefault) {
            return (
              <Column
                key={index}
                header={header}
                field={field}
                sortable
                sortField="account_type"
              />
            );
          } else if (field === "onboarded_by" && isDefault) {
            return (
              <Column
                key={index}
                header={header}
                field={field}
                body={addedDataTemplate}
                sortable
                sortField="user_name"
              />
            );
          } else if (field === "last_login_at" && isDefault) {
            return (
              <Column
                key={index}
                header={header}
                field={field}
                body={lastActiveTemplate}
                sortable
                sortField="created_at"
              />
            );
          } else if (field === "action_bar" && isDefault&&accessLevels.createProjectLevelRbac) {
            return (
              <Column
                key={index}
                header={header}
                field={field}
                body={actionBarTemplate}
              />
            );
          } else if (field === "discovery_progress_percentage" && isDefault) {
            return (
              <Column
                key={index}
                header={header}
                field={field}
                body={activityBodyTemplate}
              />
            );
          } else if (field === "user_status" && !manageUser && isDefault) {
            return (
              <Column
                key={index}
                field={field}
                header={header}
                body={statusTemplate}
                sortable
                sortField="status"
              ></Column>
            );
          } else if (field === "FILTER_GATE") {
            return (
              <Column
                key={index}
                header={() => (
                  <div>
                    <div
                      style={{
                        cursor: "pointer",
                      }}
                      onClick={(e) => {
                        handleFilterPopover(e)
                        e.stopPropagation()}}
                    >
                      <FilterGateIcon />
                    </div>
                  </div>
                )}
                frozen
                alignFrozen="right"
              ></Column>
            );
          }
          return null;
        })}
      </DataTable>
      <CustomPaginator {...paginatorProps} />

      <Popover
        open={popoverOpen}
        anchorReference="anchorPosition"
        anchorPosition={{ top: clientY + 15, left: clientX + 12}}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        className="filter-popover"
      >
        <div style={{
          fontSize: "14px"
        }}>
          {headerData.map((data: any, index: any) => {
            return (
              <div
                key={index}
                className="field-hover"
              >
                <div
                  key={index}
                  className={`${
                    data.type === "checkbox"
                      ? "filter-field"
                      : data.type === "lock" && "filter-field-lock"
                  } `}
                >
                  <div>
                    {data.type === "checkbox" ? (
                      <Checkbox
                        defaultChecked={data.isDefault}
                        onChange={handleCheck}
                        sx={checkBoxStylee}
                        disableRipple={true}
                        onClick={() => handleFilterData(index, data)}
                      />
                    ) : (
                      data.type === "lock" && (
                        <span className="lock-icon">
                          <LockIcon />
                        </span>
                      )
                    )}
                  </div>
                  <div>{data.header}</div>
                </div>
              </div>
            );
          })}
        </div>
      </Popover>

      <MySnackbar
        className="snack-bar"
        message={message}
        severity={severity}
        open={snackOpen}
        onClose={handleSnackbarClose}
      />
       <ConfirmDialog
        className="confirm-dialog-cloud-onboarding Wo-model-popup"
        visible={showConfirmDialog}
        onHide={() => setShowConfirmDialog(false)}
        reject={handleQuit}
        acceptLabel={"Ok, Got it"}
        position="bottom"
        message={
          <>
            <span className="confirm-dialog-normal">
              Please note that the discovery process for this cloud account is currently locked.It will be enabled again in 30 minutes.
              We appreciate your patience and understanding.If you need any further assistance, please feel free to contact our support team
            </span>
          </>
        }
        header="Discovery Locked"
        icon="pi pi-exclamation-triangle"
      >
        <template>
          <div className="p-d-flex p-jc-between">
            <Button className="p-button-text">Ok, Got it</Button>
          </div>
        </template>
      </ConfirmDialog>
    </>
  );
}