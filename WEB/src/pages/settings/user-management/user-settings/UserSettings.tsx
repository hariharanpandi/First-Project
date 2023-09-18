import { useState, useEffect, SetStateAction } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useDispatch, useSelector } from "react-redux";
import { getUserRequest } from "../../../../redux/action/user-management-action/GetUserAction";
import { CommonTable } from "../../../../helper/common-table/commonTable";
import formateDateTime from "../../../../helper/formateDateTime";
import profilePlaceHolder from "../../../../assets/images/user-profile-placeholder.svg";
import { InputText } from "primereact/inputtext";
import CustomPaginator from "../../../../components/CustomPaginator";
import { PaginatorPageChangeEvent } from "primereact/paginator";
import { Button, Popover } from "@mui/material";
import PlusIcon from "../../../../assets/icons/PlusIcon";
import UserModal from "../new-user/NewUserModal";
import ThreeDote from "../../../../assets/icons/ThreeDote";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import BlockIcon from "@material-ui/icons/Block";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import { useNavigate } from "react-router-dom";
import { deleteUserRequest } from "../../../../redux/slice/user-management-slice/DeleteUserSlice";
import { CustomBackdrop } from "../../../../helper/backDrop";
import {
  getManageUserRequest,
  getManageUserReset,
} from "../../../../redux/slice/user-management-slice/GetManageUserSlice";
import { getQueryParam } from "../../../../helper/SearchParams";
import { updateUserStatusRequest } from "../../../../redux/slice/user-management-slice/UpdateUserStatusSlice";
import _ from "lodash";
import RoleUnmapped from "../../../../assets/icons/WarningIcon.svg";
import SearchIcon from "../../../../assets/icons/SearchIcon";
import "../../../../styles/user-management-styles/UserSettingStyles";
import CustomTooltip from "../../../../components/CustomTooltip";
import PreventSpaceAtFirst from "../../../../components/PrventSpaceAtFirst";
import ManageUser from "../../../project/ManageUser";
import { getUserReset } from "../../../../redux/slice/user-management-slice/GetUserSlice";
import {
  getRoleAccessRequest,
  getRoleAccessReset,
} from "../../../../redux/slice/user-management-slice/GetRoleAccessSlice";
import { ConfirmDialog } from "primereact/confirmdialog";
import FilterGateIcon from "../../../../assets/icons/FilterGateIcon";
import "../../../../styles/user-management-styles/UserSetting.css";
import Checkbox from "@mui/material/Checkbox";
import LockIcon from "../../../../assets/icons/LockIcon";
import { manageUserReset } from "../../../../redux/slice/user-management-slice/manageUserSlice";

interface UserList {
  total_users: number;
  user_list: {
    _id: string;
    user_type: string;
    user_name: string;
    status: string;
    role_unmapped: true;
    email: string;
    created_at: string;
    last_login_at: string;
    user_img: string;
  }[];
}

interface User {
  name: string;
  user_img: string;
  email: string;
  user_type: "A" | "N";
}

export default function RoleSettingsTables() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    userData,
    loading,
    error: getUserError,
  } = useSelector((state: any) => state.getUser);

  const { editLoading } = useSelector((state: any) => state.updateUserStatus);

  const [userList, setUserList] = useState<UserList>({
    total_users: 0,
    user_list: [],
  });
  const [anchorEl, setAnchorEl] = useState<null | SVGSVGElement>(null);
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [typedValue, setTypedValue] = useState("");
  const [ModalOpen, setModalOpen] = useState(false);
  const [selectedUser, setselectRowUser] = useState<any>({});
  const [popoverAnchorEl, setPopoverAnchorEl] =
    useState<HTMLButtonElement | null>(null);
  const [EditModalOpen, setEditModalOpen] = useState(false);
  const manageUser = getQueryParam("manageuser");
  const {
    manageUserData,
    manageLoading,
    error: getManageUserError,
  } = useSelector((state: any) => state.getManageUser);
  const { DeleteUser } = useSelector((state: any) => state.deleteUser);
  const project_id = getQueryParam("projectId");
  const [onSortFiled, setOnSortFiled] = useState<string>("created_at");
  const [onSortOrder, setOnSortOrder] = useState<any>(-1);
  const open = Boolean(popoverAnchorEl);
  const [selectRowUser, setSelectRowUser] = useState<any>(null);
  const [action, setAction] = useState<string>("");
  const [isManageUserOpen, setIsManageUserOpen] = useState(false);
  const {
    success: successroleaccess,
    error: errorroleaccess,
    loading: getroleaccess,
  } = useSelector((state: any) => state.getRoleAccess);
  const [userDeleteOpen, setuserDeleteOpen] = useState<any>(false);

  // ** initial reset funtion */

  useEffect(() => {
    return () => {
      dispatch(getUserReset());
      dispatch(getManageUserReset());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ** form table data for user management */

  useEffect(() => {
    if (userData && userData?.data?.user_list?.length > 0) {
      const updatedUserList = userData?.data?.user_list?.map(
        (item: UserList["user_list"][number]) => ({
          ...item,
          user_template: {
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
      setUserList({
        total_users: userData?.data?.total_users,
        user_list: updatedUserList,
      });
    } else if (!_.isNil(userData) && userData?.data?.user_list?.length === 0) {
      setUserList({
        total_users: userData?.data?.total_users,
        user_list: userData?.data?.user_list,
      });
    }
  }, [userData]);

  // ** form table data for manage user */

  useEffect(() => {
    if (manageUserData && manageUserData?.data?.user_list?.length > 0) {
      const updatedUserList = manageUserData?.data?.user_list?.map(
        (item: UserList["user_list"][number]) => ({
          ...item,
          user_template: {
            name: item.user_name,
            email: item.email,
            user_img:
              !_.isNil(item.user_img) && item.user_img !== ""
                ? item.user_img
                : profilePlaceHolder,
          },
          user_status: {
            status: item.status,
            isroleunmapped: item.role_unmapped,
          },
        })
      );
      setUserList({
        total_users: manageUserData?.data?.total_users,
        user_list: updatedUserList,
      });
    } else if (
      !_.isNil(manageUserData) &&
      manageUserData?.data?.user_list?.length === 0
    ) {
      setUserList({
        total_users: manageUserData?.data?.total_users,
        user_list: manageUserData?.data?.user_list,
      });
    }
  }, [manageUserData]);

  // ** For every rerender this useEffect is be called based on the condition */

  useEffect(() => {
    const sortOrder = onSortOrder === -1 ? "desc" : "asc";
    let condtionBody: any = {
      queryparams: `limit=${rows}&page=${currentPage}&sort=${onSortFiled}&orderby=${sortOrder}`,
    };

    if (typedValue !== "") {
      condtionBody.queryparams += `&search=${typedValue.trim()}`;
    }
    if (manageUser && !isManageUserOpen) {
      dispatch(getManageUserRequest(condtionBody));

      return () => {
        dispatch(getRoleAccessReset());
      };
    } else if (!manageUser) {
      dispatch(getUserRequest(condtionBody));
    }
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
    isManageUserOpen,
    successroleaccess,
    errorroleaccess,
  ]);

  // ** form templete for user column for user manangement */

  const userItemTemplate = ({ user_template }: { user_template: User }) => {
    const { email, user_img, name, user_type } = user_template;
    return (
      <div className="user-container">
        <img
          className="border-radius-50per"
          alt={name ?? ""}
          src={user_img}
          width="40"
          height="40"
        />
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

  // ** form templete for added data column user manangement */

  const addedDataTemplate = ({ created_at }: { created_at: string }) => {
    const createdAt = formateDateTime(created_at);
    if (createdAt === " - ") {
      return <div>{createdAt}</div>;
    } else {
      return (
        <div className="table-date-container">
          <div className="color-white-primary font-md">
            {createdAt.date ?? " - "}
          </div>
          <div className="color-white-secondary font-sm">
            {createdAt.time ?? " - "}
          </div>
        </div>
      );
    }
  };

  // ** form templete for role name column for manage user*/

  const roleNameTemplate = ({ role_name }: { role_name: string }) => {
    return <div className="table-role-name">{role_name}</div>;
  };

  // ** form templete for last active column user manangement */

  const lastActiveTemplate = ({ last_login_at }: { last_login_at: string }) => {
    const lastLoginAt = formateDateTime(last_login_at);
    if (lastLoginAt === " - ") {
      return <div>{lastLoginAt}</div>;
    } else {
      return (
        <div className="table-date-container">
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

  // ** form templete for status column user manangement */
  const statusTemplate = ({ user_status }: Record<string, any>) => {
    return (
      <>
        <span
          className={
            user_status.status === "confirmed"
              ? "status-active-color"
              : "status-inactive-color"
          }
        >
          {user_status.status === "confirmed" ? "Active" : "Inactive"}
        </span>
        {user_status.isroleunmapped && (
          <span className="p-l-8 warning-icon">
            <CustomTooltip title="Roles unmapped" placement="top">
              <img
                alt="role unmapped"
                src={RoleUnmapped}
                width="15"
                height="15"
              />
            </CustomTooltip>
          </span>
        )}
      </>
    );
  };

  // ** form templete for action column user manangement */

  const actionBarTemplate = ({
    user_type,
    _id,
  }: {
    user_type: "A" | "N";
    _id: string;
  }) => {
    return (
      <>
        {user_type === "N" ? (
          <span
            className="custom-cursor"
            aria-describedby={_id}
            onClick={(event: any) => handlePopoverOpen(event)}
          >
            <ThreeDote />
          </span>
        ) : (
          <span className="action-disabled">
            <ThreeDote />
          </span>
        )}
        <Popover
          open={open}
          id={_id}
          anchorEl={popoverAnchorEl}
          onClose={handlePopoverClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          {manageUser ? manageContent : popoverContent}
        </Popover>
      </>
    );
  };

  //  ** Manage user add and update senorio - Start */
  const handleManageUser = (action: string) => {
    if (action === "Add") {
      setAction("Add");
      setSelectRowUser(null);
    } else {
      setAction("Update");
    }
    setIsManageUserOpen(true);
    handlePopoverClose();
  };

  const handleHideManageUser = () => {
    dispatch(manageUserReset());
    setIsManageUserOpen(false);
  };

  const handleRemoveUser = () => {
    const formRequest = {
      projectdtl: [
        {
          appdtl: [],
          isActive: false,
          project_id: project_id,
          role_id: selectRowUser?.role_id,
          role_name: selectRowUser?.role_name,
        },
      ],
      user_id: selectRowUser?._id,
    };
    handlePopoverClose();
    dispatch(getRoleAccessRequest(formRequest));
  };

  const manageContent = selectRowUser && (
    <div className="edit-popover-content">
      <div className="edit-popover-content-list">
        <div
          className="edit-popover-icons"
          onClick={() => handleManageUser("Update")}
        >
          <span className="editable-icons">
            <EditIcon />
          </span>{" "}
          <span>Edit User</span>
        </div>

        <div
          className="edit-popover-icons edit-popover-icons-delete"
          onClick={handleRemoveUser}
        >
          <span className="editable-icons">
            <DeleteIcon />
          </span>{" "}
          Remove
        </div>
      </div>
    </div>
  );

  //  ** Manage user add and update senorio - End */

  //  ** user management add and update senorio - Start*/

  const handleStatusChange = (status: string) => {
    const condtionBody = {
      id: selectRowUser._id,
      user_name: selectRowUser.user_name,
      status: status,
    };
    dispatch(updateUserStatusRequest(condtionBody));
    handlePopoverClose();
  };

  const handleDeleteUser = () => {
    setuserDeleteOpen(true);
    handlePopoverClose();
  };
  const handleUserDelete = () => {
    setuserDeleteOpen(false);
    dispatch(deleteUserRequest(selectRowUser._id));
  };

  const popoverContent = selectRowUser && (
    <div className="edit-popover-content">
      <div className="edit-popover-content-list">
        <div className="edit-popover-icons" onClick={() => EditModalOpended()}>
          <span className="editable-icons">
            <EditIcon />
          </span>{" "}
          <span>Edit User</span>
        </div>

        {selectRowUser.status === "confirmed" && (
          <div
            className="edit-popover-icons"
            onClick={() => handleStatusChange("pending")}
          >
            <span className="editable-icons">
              <BlockIcon />
            </span>{" "}
            Mark as inactive
          </div>
        )}

        {selectRowUser.status === "pending" && (
          <div
            className="edit-popover-icons"
            onClick={() => handleStatusChange("confirmed")}
          >
            <span className="editable-icons">
              <CheckCircleIcon />
            </span>{" "}
            Mark as active
          </div>
        )}

        <div
          className="edit-popover-icons edit-popover-icons-delete"
          onClick={handleDeleteUser}
        >
          <span className="editable-icons">
            <DeleteIcon />
          </span>{" "}
          Delete User
        </div>
      </div>
    </div>
  );

  //  ** user management add and update senorio - End */

  const handlePopoverOpen: any = (event: any) => {
    const ariaDescribedBy =
      event.currentTarget.getAttribute("aria-describedby");
    const selectedRowUser = userList?.user_list.find(
      ({ _id }) => _id === ariaDescribedBy
    );
    setSelectRowUser(selectedRowUser);
    setPopoverAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setPopoverAnchorEl(null);
    setselectRowUser(null);
  };

  const EditModalOpended = () => {
    navigate(`/overview/user-management?id=${selectRowUser._id}`);

    setEditModalOpen(true);
    handlePopoverClose();
  };

  const onPageChange = (event: PaginatorPageChangeEvent) => {
    setFirst(event?.first);
    setRows(event?.rows);
    const newPage = Math.floor(event?.first / event?.rows) + 1;
    setCurrentPage(newPage);
  };

  const onInputSearch = (event: {
    target: { value: SetStateAction<string> };
  }) => {
    setTypedValue(event.target.value);
  };

  const UserModalOpen = () => {
    setModalOpen(true);
  };

  const UserModalClose = () => {
    const sortOrder = onSortOrder === -1 ? "desc" : "asc";
    let condtionBody: any = {
      queryparams: `limit=${rows}&page=${currentPage}&sort=${onSortFiled}&orderby=${sortOrder}`,
    };
    dispatch(getUserRequest(condtionBody));
    setModalOpen(false);
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

  const filter = [
    {
      field: "Users",
      isDefault: true,
      type: "checkbox",
      cast: "user_template",
    },
    {
      field: "Added Date",
      isDefault: true,
      type: "checkbox",
      cast: "created_at",
    },
    {
      field: "Last Active",
      isDefault: true,
      type: "checkbox",
      cast: "last_login_at",
    },
    { field: "Status", isDefault: true, type: "checkbox", cast: "user_status" },
    { field: "Actions", isDefault: true, type: "lock", cast: "action_bar" },
  ];

  const [headerData, setHeaderData] = useState<any>(
    CommonTable.USER_MANAGEMENT_LIST.COLUMNS
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
    if (data.isDefault === true) {
      updateArray[index] = { ...data, isDefault: false };
    } else if (data.isDefault === false) {
      updateArray[index] = { ...data, isDefault: true };
    }
    setHeaderData(updateArray);
  };

  return (
    <>
      <CustomBackdrop
        open={loading || manageLoading || editLoading || getroleaccess}
      />
      <div className="table-wrapper">
        <div className="position-releative">
          <span className="position-search-icon">
            <SearchIcon />
          </span>
          <InputText
            className="color-white-secondary"
            value={typedValue}
            onChange={onInputSearch}
            autoFocus={true}
            onKeyDown={(event) => PreventSpaceAtFirst(event)}
            placeholder={
              manageUser ? "Search by Name / Role" : "Search by Name"
            }
          />
        </div>
        {manageUser ? (
          <Button
            onClick={() => handleManageUser("Add")}
            disableRipple={true}
            className="user-table-btn"
            startIcon={<PlusIcon />}
          >
            <span>Add User</span>
          </Button>
        ) : (
          <Button
            onClick={UserModalOpen}
            disableRipple={true}
            className="user-table-btn"
            startIcon={<PlusIcon />}
          >
            <span>New User</span>
          </Button>
        )}
        <UserModal modalOpen={ModalOpen} handleClose={UserModalClose} />
      </div>
      {
        (!_.isNil(userData?.data?.user_list) ||
        !_.isNil(manageUserData?.data?.user_list)) &&
        <DataTable
          value={userList.user_list ?? []}
          rows={rows}
          first={first}
          rowsPerPageOptions={[5, 10, 25, 50]}
          onRowClick={(e: any) => setselectRowUser(e.data)}
          sortField={onSortFiled}
          sortMode="single"
          sortOrder={onSortOrder}
          onSort={onHandleSort}
          scrollable={true}
        >
          {headerData.map(({ field, header, isDefault }: any, index: number) => {
            if (field === "user_template" && isDefault) {
              return (
                <Column
                  key={index}
                  header={header.toLocaleUpperCase()}
                  field={field}
                  sortField={manageUser ? "user_name" : "first_name"}
                  body={userItemTemplate}
                  sortable
                  frozen
                  alignFrozen="right"
                  style={{
                    width: "100px",
                  }}
                />
              );
            } else if (field === "role_name" && manageUser && isDefault) {
              return (
                <Column
                  key={index}
                  header={header.toLocaleUpperCase()}
                  field={field}
                  body={roleNameTemplate}
                  sortable
                  sortField="role_name"
                />
              );
            } else if (field === "created_at" && isDefault) {
              return (
                <Column
                  key={index}
                  header={header.toLocaleUpperCase()}
                  field={field}
                  body={addedDataTemplate}
                  sortable
                  sortField="created_at"
                />
              );
            } else if (field === "last_login_at" && isDefault) {
              return (
                <Column
                  key={index}
                  header={header.toLocaleUpperCase()}
                  field={field}
                  body={lastActiveTemplate}
                  sortable
                  sortField="last_login_at"
                />
              );
            } else if (field === "action_bar" && isDefault) {
              return (
                <Column
                  key={index}
                  header={header.toLocaleUpperCase()}
                  field={field}
                  body={actionBarTemplate}
                />
              );
            } else if (field === "user_status" && !manageUser && isDefault) {
              return (
                <Column
                  key={index}
                  field={field}
                  header={header.toLocaleUpperCase()}
                  body={statusTemplate}
                  sortable
                  sortField="status"
                ></Column>
              );
            } else if (field === "FILTER_GATE") {
              return (
                <Column
                  header={() => (
                    <div>
                      <div
                        style={{
                          cursor: "pointer",
                        }}
                        onClick={(e) => handleFilterPopover(e)}
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
      }
      <CustomPaginator {...paginatorProps} />

      <Popover
        open={popoverOpen}
        anchorReference="anchorPosition"
        anchorPosition={{ top: clientY + 15, left: clientX + 12 }}
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
              <div className="field-hover">
                {data.field === "role_name" && !manageUser ? (
                  <span></span>
                ) : (
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
                )}
              </div>
            );
          })}
        </div>
      </Popover>

      <ConfirmDialog
        className="confirm-dialog-cloud-onboarding"
        visible={userDeleteOpen}
        onHide={() => setuserDeleteOpen(false)}
        accept={() => setuserDeleteOpen(false)}
        reject={handleUserDelete}
        acceptLabel={"No, Keep It"}
        rejectLabel={"Yes, Delete"}
        position="bottom"
        message={
          <>
            <span className="confirm-dialog-normal">
              Are you sure want to delete the user{" "}
              {`(${selectRowUser?.user_name})`}? This action cannot be undone.
            </span>
          </>
        }
        header="Delete user"
        icon="pi pi-exclamation-triangle"
      >
        <template>
          <div className="p-d-flex p-jc-between">
            <Button className="p-button-text">No, Keep It</Button>
            <Button className="p-button-text">Yes, Delete</Button>
          </div>
        </template>
      </ConfirmDialog>

      {isManageUserOpen && (
        <ManageUser
          isManageUserOpen={isManageUserOpen}
          handleHideManageUser={handleHideManageUser}
          selectRowUser={selectRowUser}
          action={action}
          projectId={project_id!}
        />
      )}
    </>
  );
}
