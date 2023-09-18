import { Dialog } from "primereact/dialog";
import RoleMappingContactApiProvider from "../settings/user-management/edite-user/RoleMapping";
import { Dropdown } from "primereact/dropdown";
import { manageUserRequest, manageUserReset } from "../../redux/slice/user-management-slice/manageUserSlice";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { CustomBackdrop } from "../../helper/backDrop";
import { useSelector } from "react-redux";
import _ from "lodash";

const ManageUser = ({
  isManageUserOpen,
  handleHideManageUser,
  selectRowUser,
  action,
  projectId
}: {
  isManageUserOpen: boolean;
  handleHideManageUser: () => void;
  selectRowUser: Record<string, any>;
  action: string;
  projectId: string;
}) => {
  const dispatch = useDispatch();
  const [unMappedUser, setUnMappedUser] = useState<any[]>([]);
  const [unMappedUserId, setUnMappedUserId] = useState<string>('');
  const tanentUserId: string = selectRowUser ? selectRowUser._id : localStorage.getItem("userId");
  const [userSelected, setUserSelected] = useState<boolean>(false)
  const { manageUserData, Loading } = useSelector((state: any) => state.manageUser);

  if (_.isNil(projectId) || projectId === '') {
    throw new Error('Cannot read the property of undefined or empty string (Project id)');
  }

  if (action === 'Update' && (_.isNil(selectRowUser) || selectRowUser._id === '')) {
    throw new Error('Cannot read the property of undefined or empty string (user id)');
  }

  // ** when update scenario the selected row data will be mapped to dropdown */

  useEffect(() => {
    if (action === 'Update') {
      setUnMappedUser([{
        label: selectRowUser.user_name,
        value: selectRowUser._id,
      }]);
      setUnMappedUserId(selectRowUser._id)
    }
  }, [action, selectRowUser])


  // ** Form data for user dropdwon */

  useEffect(() => {
    if (manageUserData && manageUserData.length > 0) {
      const unMappedUsers = manageUserData.map(({
        _id,
        user_name
      }: {
        _id: string;
        user_name: string;
      }) => {
        return {
          label: user_name,
          value: _id,
        }
      })

      setUnMappedUser(unMappedUsers)
    }

  }, [manageUserData])

  // ** fetch data for user dropdwon */

  const handleUnMappedUser = () => {
    if (unMappedUser.length === 0 && action === 'Add') {
      dispatch(manageUserRequest(projectId));
    }
  }

  // ** handleUserSelect will be triggered in RoleMappingContactApiProvider component for checking the user is selected  */

  const handleUserSelect = (isSubmited: boolean) => {
    if (isSubmited) {
      handleHideManageUser()
    }

    if (unMappedUserId !== '') {
      setUserSelected(false);
      return true
    };
    setUserSelected(true);
    return false
  }

  return (
    <>
      <CustomBackdrop open={Loading} />
      <Dialog
        className="manage-user-dialog"
        header={action === 'Add' ? "Add User" : "Edit role"}
        visible={isManageUserOpen}
        onHide={handleHideManageUser}>
        <div className="user-dropdown">
          <label>User</label>
          <div className="dropdown" onClick={handleUnMappedUser}>
            <Dropdown
              filter
              value={unMappedUserId}
              options={unMappedUser}
              onChange={(e) => setUnMappedUserId(e.value)}
              onBlur={() => setUserSelected(true)}
              filterPlaceholder='Select'
              disabled={action === 'Update'}
              placeholder="Select"
            />
          </div>
          {
            userSelected && unMappedUserId === '' && (
              <div className="p-invalid p-t-8">Please select an user</div>
            )
          }
          <div className="p-t-32 p-b-16 role-mapping">Role Mapping</div>
        </div>
        <RoleMappingContactApiProvider
          userId={tanentUserId}
          action={action}
          unMappedUserId={unMappedUserId}
          handleUserSelect={handleUserSelect} />
      </Dialog>
    </>
  );
};

export default ManageUser;
