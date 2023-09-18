import { Button, Grid } from "@mui/material";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import FormData from "form-data";
import { useEffect, useState } from "react";
import "../../../styles/setting-styles/Account.css";
import { Skeleton } from 'primereact/skeleton';
        
import {
  Delete,
  DetailsBlock,
  Flex,
  FlexBox,
  FlexView,
  IconBlock,
  InBlock,
  ProfileBlock,
  ProfileTypo,
  ProfileTypoName,
  PwdEdit,
  Typo,
  TypoEdit,
  TypoName,
  Typocast,
  Upgrade,
} from "../../../styles/setting-styles/AccountStyles";

import { TextField } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import MySnackbar from "../../../helper/SnackBar";
import { profileEditRequest } from "../../../redux/action/setting-action/profile-setting/EditProfileAction";
import { profileInfoRequest } from "../../../redux/action/setting-action/profile-setting/ProfileSettingAction";
import MyDialog from "./DeleteAccount";
import ProfileEmpty from "../../../assets/images/EmtyUser.png";
import { CustomBackdrop } from "../../../helper/backDrop";
import { DeleteRequest } from "../../../redux/@types/setting-types/profile-setting/DeleteAccount";
import { PasswordRequest } from "../../../redux/@types/setting-types/profile-setting/UpdatePassword";
import { deleteAccountRequest } from "../../../redux/action/setting-action/profile-setting/DeleteAccount";
import { profileEditWithoutRequest } from "../../../redux/action/setting-action/profile-setting/EditWithoutProfileAction";
import { passwordUpdateRequest } from "../../../redux/action/setting-action/profile-setting/UpdatePassword";
import { profileEditReset } from "../../../redux/slice/setting-slice/profile-setting/EditProfileslice";
import { profileEditWithoutReset } from "../../../redux/slice/setting-slice/profile-setting/EditWithoutProfileSlice";
import { passwordUpdateReset } from "../../../redux/slice/setting-slice/profile-setting/UpdataPasswordSlice";
import { ConfirmDialog } from "primereact/confirmdialog";
import { regex } from "../../../helper/RegEx";
import _ from "lodash";
import RoleMappingContactApiProvider from "../user-management/edite-user/RoleMapping";
import CustomTooltip from "../../../components/CustomTooltip";


const SetAccount = () => {
  const [edit, setEdit] = useState("false");
  const [pwd, setPwd] = useState("false");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [accountDeleteOpen, setAccountDeleteOpen] = useState<any>(false)

  const [profileCancel, setProfileCancel] = useState(false);
  const [pwdCancel, setPwdCancel] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isError, setIsError] = useState(false);
  const [isPwdError, setIsPwdError] = useState(false)
  const [errorMessage, setErrorMessage] = useState("");
  const dispatch = useDispatch();
  const [id, setId] = useState<any>("");
  const myId: any = localStorage.getItem("userId")?.replace(/"/g, "");
  const [uploadImage, setUploadImage] = useState<any>();
  const [image, setImage] = useState<any>();
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [imageSrc, setImageSrc] = useState<any>("");
  const [backdropOpen, setBackdropOpen] = useState(true);
  const [severity, setSeverity] = useState("");
  const [message, setMessage] = useState("");
  const [snackOpen, setSnackOpen] = useState(false);
  const [fullName, setFullName] = useState("");
  const [name, setName] = useState("");
  const [password_update, setPasswordUpdate] = useState<any>();
  const [editErrorMessage, setEditErrorMessage] = useState<any>();
  const [errorMessagePwd, setErrorMessagePwd] = useState("");
  //const [isAdmin,setIsAdmin] = useState<any>(false);
  const [activeChip, setActiveChip] = useState<string | null>(null);
  const userId = localStorage.getItem("userId")?.replace(/"/g, "");
  const chipLabels = ['Profile', 'Access Overview', 'Notifications', 'Security', 'Billing'];
  const [chipLabel, setchipLabel] = useState<string[]>(chipLabels)

  const { profileData, loading } = useSelector(
    (state: any) => state.profileInfo
  );
  const { profileEdit, Editloading, EditSuccess, error } = useSelector(
    (state: any) => state.profileEdit
  );
  const { passwordData, Passwordloading, PasswordSuccess, PasswordError } =
    useSelector((state: any) => state.passwordUpdate);
  const {
    EditWithoutLoading,
    ProfileWithoutImageError,
    ProfileWithoutImageSuccess,
  } = useSelector((state: any) => state.profileEditWithout);
  const { deleteLoading } = useSelector((state: any) => state.deleteAccount);
  const page_loader =  loading ||  Editloading ||  Passwordloading || deleteLoading || EditWithoutLoading

  const navigate = useNavigate();
  // const blobUrlToImageUrl = (blobUrl: any) => {
  //   return new Promise((resolve, reject) => {
  //     const xhr = new XMLHttpRequest();
  //     xhr.open("GET", blobUrl);
  //     xhr.responseType = "blob";
  //     xhr.onload = () => {
  //       if (xhr.status === 200) {
  //         const img = new Image();
  //         img.src = URL.createObjectURL(xhr.response);
  //         resolve(img.src);
  //       } else {
  //         reject(new Error("Failed to load image"));
  //       }
  //     };
  //     xhr.send();
  //   });
  // };
  const isAdmin = localStorage.getItem("user_type");
  useEffect(() => {
    dispatch(profileInfoRequest(myId));
    setActiveChip(chipLabels[0])
    if (JSON.parse(isAdmin!) === "A") {
      setchipLabel((prestate: string[]) => {
        return prestate.map((label) => {
          if (label !== 'Access Overview') {
            return label
          } else {
            return ''
          }
        })
      })
    }
  }, []);

  const handlePwdChange = (event: any) => {
    setPassword(event.target.value);
    if (!regex.password.test(event.target.value)) {
      setIsPwdError(true);
      setErrorMessagePwd('Password must have at least 1 uppercase, 1 lowercase, 1 number, 1 special character and minimum of 8 characters');
    } else {
      setErrorMessagePwd("");
      setIsPwdError(false);
    }
  };
  useEffect(() => {
    if (ProfileWithoutImageSuccess) {
      setSeverity("success");
      setMessage(ProfileWithoutImageSuccess?.message);
      setSnackOpen(true);
    } else if (ProfileWithoutImageError) {
      setSeverity("error");
      setMessage(ProfileWithoutImageError);
      setSnackOpen(true);
    }
    return () => {
      dispatch(profileEditWithoutReset());
    };
  }, [ProfileWithoutImageSuccess, ProfileWithoutImageError]);

  useEffect(() => {
    if (EditSuccess) {
      setSeverity("success");
      setMessage(profileEdit?.message);
      setSnackOpen(true);
    } else if (error) {
      setSeverity("error");
      setMessage(error);
      setSnackOpen(true);
    }
    return () => {
      dispatch(profileEditReset());
    };
  }, [EditSuccess, error]);

  useEffect(() => {
    if (PasswordSuccess) {
      setSeverity("success");
      setMessage("Password Updated Successfully");
      setSnackOpen(true);
    } else if (PasswordError) {
      setSeverity("error");
      setMessage(PasswordError);
      setSnackOpen(true);
    }
    return () => {
      dispatch(passwordUpdateReset());
    };
  }, [PasswordSuccess, PasswordError]);

  useEffect(() => {
    setFullName(profileData?.user_name);
    setPasswordUpdate(profileData?.last_pwd_changed_at);
    setImageSrc(profileData?.user_img);
  }, [profileData]);

  const handleConfirmPasswordChange = (event: any) => {
    setConfirmPassword(event.target.value);
    if ((password !== event.target.value || event.target.value === '') && password !== '') {
      setIsError(true);
      setErrorMessage("Passwords do not match");
    } else {
      setIsError(false);
      setErrorMessage("");
    }
  };

  const handleProfileEdit = () => {
    setFullName(profileData?.user_name);
    setEdit("true");
    dispatch(profileInfoRequest(myId));
  };
  const handlePasswordChange = () => {
    setPwd("true");
    setErrorMessagePwd("");
    setIsPwdError(false);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };
  const deleteObj: DeleteRequest = {
    last_accessed_by: profileData?.last_accessed_by,
  };
  const handleDeleteAccount = () => {
    // id?
    setDialogOpen(true);
  };

  const handleProfileCancelClick = () => {
    setEdit("false");
    setProfileCancel(true);
    setEditErrorMessage("");
    setFullName(profileData?.user_name);
    dispatch(profileInfoRequest(myId));
  };

  const handlePwdCancelClick = () => {
    setPwd("false");
    setProfileCancel(true);
    setErrorMessagePwd("");
    setIsPwdError(false);
    setPassword('');
    setConfirmPassword('');
    setIsError(false);
    setErrorMessage("");
  };

  const handleEditName = (event: any) => {
    setFullName(event.target.value);
  };

  const passwordObj: PasswordRequest = {
    tenant_id: localStorage.getItem("tenant_id"),
    tenant_group_id: localStorage.getItem("tenant_group_id"),
    user_name: fullName,
    email: profileData?.email,
    password: confirmPassword,
    status: "confirmed",
  };
  const handlePwdSaveClick = () => {
    
    if (confirmPassword !== password  && password !== '') {
      setIsError(true);
      setErrorMessage("Passwords do not match");
      return;
    }
    if(isPwdError === false && isError === false && regex.password.test(password))
    {
      setPwdCancel(false);
      dispatch(passwordUpdateRequest(passwordObj));
      setPwd("false");
      setErrorMessagePwd("");
      setIsPwdError(false);
      setPassword('')
      setConfirmPassword('');
    } else if (!regex.password.test(password)) {
      setIsPwdError(true);
      setErrorMessagePwd('Password must have at least 1 uppercase, 1 lowercase, 1 number, 1 special character and minimum of 8 characters');
    } 
  };

  useEffect(() => {
    if (profileEdit) {
      // setFullName(profileEdit?.data?.user_name ?? profileEdit?.userRes?.user_name);
      // setImageSrc(profileEdit?.data?.user_img ?? profileEdit?.userRes?.user_img);
    } else if (profileData) {
      // setFullName(profileData?.user_name);
      //setImageSrc(profileData?.user_img);
    } else if (passwordData) {
      setPasswordUpdate(passwordData?.last_pwd_changed_at);
    }
  }, [profileEdit, profileData, passwordData]);

  const handleProfileSaveClick = () => {
    let userEditObj: any = {
      tenant_id: localStorage.getItem("tenant_id")?.replace(/"/g, ""),
      tenant_group_id: localStorage
        .getItem("tenant_group_id")
        ?.replace(/"/g, ""),
      user_name: fullName,
      email: profileData?.email,
      status: "Active",
    };

    localStorage.setItem("user_name", fullName);
    const formData = new FormData();

    formData.append("File", uploadImage);
    formData.append("data", JSON.stringify(userEditObj));

    const ProfileSettingData = new FormData();
    ProfileSettingData.append("data", JSON.stringify(userEditObj));

    if (fullName.length < 3) {
      setEditErrorMessage("Minimum 3 characters required");
    } else if (imageSrc && fullName.length >= 3) {
      dispatch(profileEditRequest(formData));
      setEdit("false");
      setImageSrc("");
      setProfileCancel(false);
      setEditErrorMessage("");
    } else if (fullName.length >= 3) {
      dispatch(profileEditWithoutRequest(ProfileSettingData));
      setEdit("false");
      setImageSrc("");
      setProfileCancel(false);
      setEditErrorMessage("");
    }
    // setFullName(profileEdit?.data?.user_name);
  };

  const handleDeleteAcc = () => {
    dispatch(deleteAccountRequest(deleteObj));
    localStorage.clear();
    navigate("/");
  };
  const handleSnackbarClose = () => {
    setSnackOpen(false);
  };

  const handleImageChange = (event: any) => {
    const file = event.target.files?.[0];

    if (file) {
      const allowedTypes = ["image/jpeg", "image/jpg"];
      const fileType = file.type;

      /* Check if the file type is allowed */
      if (allowedTypes.includes(fileType)) {
        setUploadImage(file);
        if (file.size <= 2 * 1024 * 1024) { // 2 MB in bytes
         
  
          const reader = new FileReader();
          reader.onload = () => {
            setImageSrc(reader.result as string);
          };
          reader.readAsDataURL(file);
      
        } else {
          setSeverity("error");
          setMessage("Image size exceeds the allowed limit (2 MB). Please choose a  image size less than 2 MB.");
          setSnackOpen(true);
          /* Display an error message or perform any desired action */
        }
        

        
      } else {
        setSeverity("error");
        setMessage("'Invalid file type. Please upload a JPG or JPEG image.'");
        setSnackOpen(true);
        /* Display an error message or perform any desired action */
      }
    }
  };

  const handleImageRemove = () => {
    setImageSrc("");
  };

  useEffect(() => {
    setImageSrc("");
  }, []);
  //***Edite Button Logic For name email field ***//
  const profileBlockJSX = edit === "true" ? (
    <div style={{ display: "flex" }} className="cancel-edite-button">
      <Button
        disableRipple={true}
        onClick={handleProfileCancelClick}
        className={profileCancel ? "active-cancel-profile" : "cancel-profile"}
      >
        Cancel
      </Button>
      <Button
        disableRipple={true}
        onClick={handleProfileSaveClick}
        className={profileCancel ? "save-profile" : "active-save-profile"}
      >
        Save
      </Button>
    </div>
  ) : (
    <div className="edit-align">
      <TypoName
        className="setaccount-edite"
        onClick={handleProfileEdit}>Edit</TypoName>
    </div>
  );
  //***Edite Button Logic For password field ***//
  const passwordBlockJSX = (
    <>
      {pwd === "true" ? (
        <div style={{ display: "flex" }} className="cancel-edite-button">
          <Button
            disableRipple={true}
            onClick={handlePwdCancelClick}
            className={`${pwdCancel == true
              ? "active-cancel-profile"
              : "cancel-profile"
              }`}
          >
            Cancel
          </Button>
          <Button
            disableRipple={true}
            onClick={handlePwdSaveClick}
            className={`${pwdCancel == false
              ? "active-save-profile"
              : "save-profile"
              }`}
          >
            Save
          </Button>
        </div>
      ) : (
        <div className="password-edit-align">
          <TypoName
            className="setaccount-edite"
            onClick={handlePasswordChange}
          >
            Edit
          </TypoName>
        </div>
      )}
    </>
  )

  const handleChipClick = (label: any) => {
    setActiveChip(label);
    if (chipLabels[1] === label) {
      return 
    }
  };

  return (
    <>
      <Grid container spacing={1}>
        <CustomBackdrop
          open={
            loading ||
            Editloading ||
            Passwordloading ||
            deleteLoading ||
            EditWithoutLoading
          }
        />

        <Grid item lg={2} md={3} sm={12} xs={12} className="set-account-sroll">
         {page_loader ? <Skeleton width="9rem" height="10rem"></Skeleton> :
          <Stack direction="column" spacing={1} className="stack-column">
            {chipLabel.map((label, index) => {
              if (label && label !== '') {
                return (
                  <>
                    <CustomTooltip
                      title={label}
                      placement="top"
                    >
                      <Chip
                        key={label}
                        label={label}
                        disabled={index > 1}
                        className={activeChip === label ? 'chip-active account-setting' : 'account-setting'}
                        onClick={() => handleChipClick(label)}
                      />
                    </CustomTooltip>
                  </>
                )
              }
            })}
          </Stack>}
        </Grid>
        {
          activeChip === chipLabels[0] &&
        <>
        <Grid item md={9} sm={12} xs={12} lg={10}>
          <Grid container className="ac-grid-container">
          {page_loader ? <Skeleton width="70rem" height="15rem" className="skeleton-with-padding"></Skeleton> :
            <Grid
              item
              md={12}
              lg={12}
              xs={12}
              sm={12}
              className="setting-block"
            >

              <ProfileBlock>
                <Typo>
                  <span className="setaccount-input-text">Profile Details</span>
                </Typo>
                <span className="web-edite-vive">{profileBlockJSX}</span>
              </ProfileBlock>


              <IconBlock>
                <Flex>
                  {
                    imageSrc ? (
                      <img
                        className="setting-user-image"
                        src={imageSrc}
                        alt="Preview"
                        width={70}
                        height={70}
                        style={{ borderRadius: "50%" }}
                      />
                    ) : profileData?.imageSrc ? (
                      <img
                        className="setting-user-image"
                        src={profileData?.imageSrc}
                        alt="Preview"
                        width={70}
                        height={70}
                        style={{ borderRadius: "50%" }}
                      />
                    ) : (
                      <img
                        className="setting-user-image"
                        src={ProfileEmpty}
                        alt="Preview"
                        width={60}
                        height={60}
                        style={{ objectFit: "none" }}
                      />
                    )
                    //  profileData?.user_img ? (
                    //   <img
                    //   className="setting-user-image"
                    //   src={profileData?.user_img}
                    //   alt="Preview"
                    //   width={70}
                    //   height={70}
                    //   style={{ borderRadius: "50%" }}
                    // />

                    // )
                    // : (
                    //   <img
                    //     className="setting-user-image"
                    //     src={ProfileEmpty}
                    //     alt="Preview"
                    //     width={60}
                    //     height={60}
                    //   />
                    // )
                  }
                  {/* <img src={URL.createObjectURL(image)} alt="Preview" width={10} height={10} /> */}
                  {edit === 'true' && !_.isNil(profileData) && (
                    !_.isNil(profileData?.imageSrc) || (!_.isNil(imageSrc) && imageSrc !== '')
                  ) ? (
                    <>
                      <label className="typocast-style">
                        <div className="change-remove-settings">Change</div>
                        <input
                          type="file"
                          onChange={handleImageChange}
                          name="name"
                       accept="image/jpeg, image/jpg"
                        />{" "}
                      </label>
                      <Typocast onClick={handleImageRemove}>
                        <div className="change-remove-settings">Remove</div>
                      </Typocast>
                    </>
                  ) : edit === 'true' && !_.isNil(profileData) ? (
                    <label className="typocast-style">
                        <div className="change-remove-settings">Add Image</div>
                        <input
                          type="file"
                          onChange={handleImageChange}
                          name="name"
                          accept="image/jpeg, image/jpg"
                        />{" "}
                    </label>
                  ): ''}
                </Flex>
              </IconBlock>
              {/* <DetailsBlock>
                <ProfileTypo>Name</ProfileTypo>
                <ProfileTypo>Email</ProfileTypo>
              </DetailsBlock> */}

              {/* <InBlock className="setting-page-inputs"> */}
              {edit === "true" ? (
                <>
                  <div className="set-input-fields-1">
                    <TypoEdit>
                      <ProfileTypo>Name</ProfileTypo>
                      <TextField
                        name="text"
                        className="setting-text"
                        type="text"
                        value={fullName}
                        onChange={handleEditName}
                        inputProps={{
                          maxLength: 36,
                        }}
                      ></TextField>
                      <div className="p-invalid">{editErrorMessage}</div>
                    </TypoEdit>
                    <TypoEdit>
                      <ProfileTypo>Email</ProfileTypo>
                      <TextField
                        name="text"
                        className="setting-text setting-text-2 disabled-state"
                        type="text"
                        value={profileData?.email}
                        //  onChange={handleEditEmail}
                        disabled={true}
                      ></TextField>
                    </TypoEdit>
                  </div>
                </>
              ) : (
                <>
                  <div className="set-input-fields">
                    <div className="set-name-field">
                      <ProfileTypoName>Name</ProfileTypoName>
                      <Typo><span className="setaccount-input-text">{fullName}</span></Typo>
                    </div>
                    <div>
                      <ProfileTypoName>Email</ProfileTypoName>
                      <Typo><span className="setaccount-input-text">{profileData?.email}</span></Typo>
                    </div>

                  </div>
                </>
              )}
              {/* </InBlock> */}
              <div className="org-style">
                {isAdmin?.replace(/"/g, "") === "A" ? (
                  <div>
                    {edit === "true" ? (
                      <>

                        <TypoEdit className="organization-name">
                          <ProfileTypo>Organization name</ProfileTypo>
                          <TextField
                            name="text"
                            className="setting-text-org"
                            type="text"
                            value={profileData?.org_name}
                            disabled={true}
                          ></TextField>
                        </TypoEdit>
                      </>
                    ) : (
                      <>
                        <ProfileTypoName className="org-normal-name">Organization name</ProfileTypoName>
                        <Typo><span className="setaccount-input-text">{profileData?.org_name}</span></Typo>
                      </>
                    )}
                  </div>
                ) : (
                  ""
                )}
              </div>
              {/* Mobile responsive edite button */}
              <span className="mobile-edite-view">{profileBlockJSX}</span>

            </Grid>}
            {profileData?.login_type?.toLocaleLowerCase() === "sso" ? (
              <></>
            ) : (
              <>
               {page_loader ? <Skeleton width="70rem" height="5rem" className="skeleton-with-padding"></Skeleton> :
              <Grid
                item
                md={12}
                xs={12}
                sm={12}
                padding={2}
                className="setting-block"
              >

                <ProfileBlock>
                  <Typo>Password</Typo>

                  <span className="web-edite-vive">{passwordBlockJSX}</span>

                </ProfileBlock>



                {pwd === "true" ? (
                  <>
                    <InBlock className="edite-password-input">
                      <PwdEdit>
                        <ProfileTypo>New Password</ProfileTypo>
                        <TextField
                          name="password"
                          className="setting-text-password"
                          type="password"
                          placeholder="New Password"
                          value={password}
                          error={isPwdError}
                          onBlur={handlePwdChange}
                          onChange={handlePwdChange}
                          helperText={errorMessagePwd}
                        ></TextField>
                      </PwdEdit>
                      <PwdEdit>
                        <ProfileTypo className="set-confirm-pass">Confirm Password</ProfileTypo>
                        <TextField
                          name="password"
                          className="setting-text-password"
                          type="password"
                          placeholder="Confirm Password"
                          value={confirmPassword}
                          onChange={handleConfirmPasswordChange}
                          onBlur={handleConfirmPasswordChange}
                          error={isError}
                          helperText={errorMessage}
                        ></TextField>
                      </PwdEdit>
                    </InBlock>
                  </>
                ) : (
                  <ProfileTypo>
                    {/* Last changed at {passwordData?.last_pwd_changed_at} */}
                    {password_update && <>Last changed at {password_update}</>}
                  </ProfileTypo>
                )}
                <span className="mobile-edite-view">{passwordBlockJSX}</span>
              </Grid>}
              </>
            )}

            {/* <Grid
              item
              md={12}
              xs={12}
              sm={12}
              padding={2}
              className="setting-block"
            >
              <FlexView>
                <FlexBox>
                  <Typo>Premium subscription</Typo>
                  <Flex>
                    <ProfileTypo>Plan expires on 16/05/2024</ProfileTypo>
                  </Flex>
                </FlexBox>
                <FlexBox>
                  <Upgrade variant="outlined">Upgrade</Upgrade>
                </FlexBox>
              </FlexView>
            </Grid> */}
            {page_loader ? <Skeleton width="70rem" height="5rem" className="skeleton-with-padding"></Skeleton> :
            <Grid
              item
              md={12}
              xs={12}
              sm={12}
              padding={2}
              className="setting-block"
            >
              <FlexView>
                <FlexBox>
                  <Typo>Delete Account</Typo>
                  <Flex>
                    <ProfileTypo>
                      All your data will be permanently deleted
                    </ProfileTypo>
                  </Flex>
                </FlexBox>
                <FlexBox>
                  <Delete variant="outlined" onClick={handleDeleteAccount}>
                    Delete
                  </Delete>
                </FlexBox>
              </FlexView>
            </Grid>}
          </Grid>
        </Grid>
        <Grid item md={12} xs={12} sm={12}>
          <MySnackbar
            className="snack-bar"
            message={message}
            severity={severity}
            open={snackOpen}
            onClose={handleSnackbarClose}
          />
        </Grid>
        </>
        }
        {
          activeChip === chipLabels[1] &&
          <Grid item md={9} sm={12} xs={12} lg={10}>
            <RoleMappingContactApiProvider
              userId={encodeURIComponent(userId!)}
              overViewAccess={true}
            />
          </Grid>
        }
      </Grid>
      {/* <MyDialog
        title="My Dialog"
        open={dialogOpen}
        onClose={handleDialogClose}
        handleDelete={handleDeleteAcc}
      /> */}
      <ConfirmDialog
        className="confirm-dialog-cloud-onboarding"
        visible={dialogOpen}
        onHide={() => setDialogOpen(false)}
        accept={() => setDialogOpen(false)}
        reject={handleDeleteAcc}
        acceptLabel={`No, I'm staying`}
        rejectLabel={'Yes, Delete'}
        position='bottom'
        message={
          <>
            <span className='confirm-dialog-normal'>
              Are you sure want to delete the account, all your data will
              be lost, and This action can't be undone.
            </span>
          </>
        }
        header="Delete account"
        icon="pi pi-exclamation-triangle"
      >
        <template>
          <div className='p-d-flex p-jc-between'>
            <Button className='p-button-text'>No, I'm staying</Button>
            <Button className='p-button-text'>Yes, Delete</Button>
          </div>
        </template>
      </ConfirmDialog>
    </>
  );
};

export default SetAccount;
function blobUrlToImageUrl(user_img: any) {
  throw new Error("Function not implemented.");
}
