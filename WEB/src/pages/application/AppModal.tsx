import React, { useEffect, useState } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { TextField } from "@mui/material";
import { Button } from "primereact/button";
import { useFormik } from "formik";
import * as Yup from "yup";
import "../../styles/app-styles/CreateApp.css";
import { EmptyImage } from "../../assets/icons/EmptyImage";
import MySnackbar from "../../helper/SnackBar";
import { getQueryParam } from "../../helper/SearchParams";
import { GetAppRequest } from "../../redux/slice/app-slice/GetAppInfoSlice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import PreventSpaceAtFirst from "../../components/PrventSpaceAtFirst";

const DialogModal = ({ visible, onHide, handleForm }: any) => {
  const edit = getQueryParam("app_edit");
  const appId: any = getQueryParam("app_id");
  const [file, setFile] = useState<any>("");
  const [severity, setSeverity] = useState("");
  const [message, setMessage] = useState("");
  const [snackOpen, setSnackOpen] = useState(false);
  const [editApp, setEditApp] = useState<any>('');

  const { appData, appLoading } = useSelector((state: any) => state.GetApp);
  const [imageChange, setImageChange] = useState(false);
  
  const dispatch = useDispatch();
  // Initial form values
  const initialValues = {
    applicationName: editApp?.application_name ?? "",
    description: editApp?.description ?? "",
    file: editApp?.app_img ?? null,
    imageremove: false,
  };
  const initialValuesNew = {
    applicationName: "",
    description: "",
    file: null,
    imageremove: false,
  };

  useEffect(() => {
    if (edit !== null) {
      dispatch(GetAppRequest(appId));
    }
  }, [edit]);

  useEffect(() => {
    if (edit) {
      setEditApp(appData);
    } else {
      setEditApp('');
    }
  }, [appData, edit]);

  // Form validation schema
  const validationSchema = Yup.object({
    applicationName: Yup.string()
      // .transform((value) => value.trim())
      .required("Application Name is required")
      .min(3, "Application Name must be at least 3 characters")
      .max(50, "Application Name must be no longer than 50 characters")
      .matches(/^[a-zA-Z0-9\s-_]+$/, 'Application Name must contain only alphanumeric, "-", "_", and space characters.')
      //.matches(/^[a-zA-Z\s-_]+$/, "Application Name must not contain numbers")
      .test({
        name: "no-whitespace",
        message: "Description cannot be empty or contain only spaces",
        test: (value: string | undefined) => {
          if (!value) {
            return false;
          }
          return value.trim().length > 0;
        },
      }),
    description: Yup.string()
      .transform((value) => value.trim())
      .required("Description is required")
      .min(5, "Description must be at least 5 characters")
      .max(300, "Description must be no longer than 300 characters")
      // .matches(/^[a-zA-Z\s-_]+$/, "Description must not contain numbers")
      .test({
        name: "no-whitespace",
        message: "Description cannot be empty or contain only spaces",
        test: (value: string | undefined) => {
          if (!value) {
            return false;
          }
          return value.trim().length > 0;
        },
      }),
  });

  useEffect(() => {
    if (!imageChange) {
      formik.setFieldValue("file", editApp?.app_img); // Update formik field value for file
    }
  }, []);

  // const { updateAppType, updateError } = useSelector(
  //   (state: any) => state.updateApp);
  

  // Form submit handler
  const handleSubmit = (values: any) => {
    handleForm(values);
    formik.resetForm();
    setFile("");
    setImageChange(false);
    onHide(true);
  };

  // Formik hook setup
  const formik = useFormik({
    initialValues: edit ? initialValues : initialValuesNew,
    validationSchema,
    onSubmit: handleSubmit,
  });

  useEffect(() => {
    if (editApp && edit) {
      formik.setValues({
        applicationName: editApp.application_name || "",
        description: editApp.description || "",
        file: editApp.app_img || "",
        imageremove: false,
      });
    } 
  }, [editApp]);

  useEffect(() => {
    if(!edit) {
      formik.setValues({
        applicationName: "",
        description: "",
        file: null,
        imageremove: false,
      });
    }
  }, [edit])

  // States for file and Snackbar

  // Snackbar close handler
  const handleSnackbarClose = () => {
    setSnackOpen(false);
  };
  const handleImageRemove = () => {
    setFile("");
    setEditApp("");
    formik.setFieldValue("file",null)
    formik.setFieldValue("imageremove", true);
  };

  // Image change event handler
  const handleImageChange = (event: any) => {
    const filesource = event.target.files?.[0];

    if (filesource) {
      const allowedTypes = ["image/jpeg", "image/jpg"];
      const fileType = filesource.type;
      const maxSizeBytes = 2 * 1024 * 1024; // 2 MB in bytes

      if (allowedTypes.includes(fileType)) {
        if (filesource.size <= maxSizeBytes) {
          const reader = new FileReader();
          reader.onload = () => {
            // Set the file state with the image data URL
            setFile(reader.result as string);
  
            // Update the Formik field value for the "file" field
            formik.setFieldValue("file", filesource);
          };
          reader.readAsDataURL(filesource);
        } else {
          setSeverity("error");
          setMessage("Image size exceeds the allowed limit (2 MB). Please choose a  image size less than 2 MB.");
          setSnackOpen(true);
          // Display an error message or perform any desired action for large file size
        }
       // Read the selected image as data URL
      } else {
        setSeverity("error");
        setMessage("Invalid file type. Please upload a JPG or JPEG image.");
        setSnackOpen(true);
        // Display an error message or perform any desired action for invalid file type
      }
    }
  };
 
  return (
    <>
       <Dialog
        header={edit ? "Edit Application" : "New Application"}
        visible={visible}
        onHide={() => {
          onHide();
          formik.resetForm();
        }}
        className="create-new-app"
      >
        <form onSubmit={formik.handleSubmit}>
          <div className="form-group">
            <label htmlFor="appName">Application Name</label>
            <TextField
              id="applicationName"
              name="applicationName"
              placeholder="Application Name"
              value={formik.values.applicationName}
              onChange={formik.handleChange}
             onBlur={formik.handleBlur}
              className="project-name-input"
              onKeyDown={(event) => PreventSpaceAtFirst(event)}
              error={
                formik.touched.applicationName &&
                Boolean(formik.errors.applicationName)
              }
              helperText={
                formik.touched.applicationName && formik.errors.applicationName
                  ? formik.errors.applicationName.toString()
                  : " "
              }
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <TextField
              className="description-name-input"
              placeholder="Description"
              name="description"
              value={formik.values.description}
              onChange={formik.handleChange}
              onKeyDown={(event) => PreventSpaceAtFirst(event)}
              error={
                formik.touched.description && Boolean(formik.errors.description)
              }
              helperText={
                formik.touched.description && formik.errors.description
                  ? formik.errors.description.toString()
                  : " "
              }
              multiline
              rows={2}
              inputProps={{
                maxLength: 300,
              }}
            />
          </div>

          <div className="form-group">
            <label htmlFor="image">Image</label>
            <div className="image-view">
              {file ? (
                <img
                  src={file}
                  alt=""
                  width={50}
                  height={50}
                  className="image-source"
                />
              ) : edit && editApp?.app_img ? (
                <img
                  src={editApp?.app_img && editApp?.app_img}
                  alt=""
                  width={50}
                  height={50}
                  className="image-source"
                />
              ) : (
                <EmptyImage />
              )}
              <label
                className="upload-label"
                onClick={() => setImageChange(true)}
              >
                {(file || editApp?.app_img) ? "Change" : "Upload"}
                <input type="file" onChange={handleImageChange} name="name"  accept="image/jpeg, image/jpg" />
              </label>
              {(file || editApp?.app_img) && (
                <button
                  type="button"
                  className="remove-btn"
                  onClick={handleImageRemove}
                >
                  Remove
                </button>
              )}
            </div>
          </div>

          <Button type="submit" className="app-create-button">
            {edit ? "Update" : "Create"}
          </Button>
        </form>
      </Dialog>
      <MySnackbar
        className="snack-bar"
        message={message}
        severity={severity}
        open={snackOpen}
        onClose={handleSnackbarClose}
      />
    </>
  );
};

export default DialogModal;