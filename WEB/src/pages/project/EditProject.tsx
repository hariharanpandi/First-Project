import {
  Modal,
  TextField,
  Button,
  Box,
  FormLabel,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import "../../styles/project-styles/ProjectModal.css";
import ClearIcon from "@material-ui/icons/Clear";
import { createProjectRequest } from "../../redux/slice/project-slice/CreateProjectSlice";
import { useDispatch, useSelector } from "react-redux";
import { ProjectCreationType } from "../../redux/@types/project-types/CreateProjectTypes";
import { useEffect, useState } from "react";
import { getProjectRequest } from "../../redux/action/project-action/GetProjectAction";
import { CustomBackdrop } from "../../helper/backDrop";
import MySnackbar from "../../helper/SnackBar";
import { setLocalStorage } from "../../helper/LocalStorage";
import { editProjectRequest } from "../../redux/slice/project-slice/EditProjectSlice";
import { getQueryParam } from "../../helper/SearchParams";
import { getProjectInfoInitRequest } from "../../redux/slice/project-slice/GetProjectInfoInitSlice";
import { Navigate, useNavigate } from "react-router-dom";
import { getProjectInfoRequest } from "../../redux/slice/project-slice/GetProjectInfoslice";

interface CommonModalProps {
  modalOpen: boolean;
  handleClose: () => void;
  handleCreate: any;
  isEdit: any;
  editProject: any;
  handleUpdate: any;
  projectId: any;
}

const validationSchema = Yup.object().shape({
  name: Yup.string()
    // .transform((value) => value.trim())
    .required("Project Name is required")
    .min(3, "Project Name must be at least 3 characters")
    .max(50, "Project Name must be no longer than 50 characters")
    .matches(/^[a-zA-Z0-9\s-_]+$/, 'Project Name must contain only alphanumeric, "-", "_", and space characters.')
    .test({
      name: "no-whitespace",
      message: "Project Name cannot be empty or contain only spaces",
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

const ProjectEditModal = ({
  modalOpen,
  handleClose,
  handleCreate,
  isEdit,
  editProject,
  handleUpdate,
  projectId
}: CommonModalProps) => {
  const dispatch = useDispatch();
  const [isProjectCreated, setIsProjectCreated] = useState(false);
  const [projectData, setProjectData] = useState([]);
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [isUpdate, setIsUpdate] = useState<any>("");
  const [formValues, setFormValues] = useState<any>("");
  const navigate = useNavigate();

  const { editSuccess } = useSelector((state: any) => state.editProject);

  const formik = useFormik({
    initialValues: { name: "", description: "" },
    validationSchema,
    onSubmit: (values: any) => {
      setFormValues(values);
      handleUpdate(values);
      formik.resetForm();
    },
  });

  useEffect(() => {
    if (modalOpen) {
      formik.setValues({
        name: editProject?.project?.name ?? editProject?.project_name ?? "",
        description: editProject?.project?.description ?? editProject?.description ?? "",
      });
    }
  }, [modalOpen, editProject]);

  const handleCloseAndReset = () => {
    handleClose();
    formik.resetForm();
  };
  const handleProjectChange = (event: any) => {
    setProjectName(event.target.value);
  };
  const handleDescChange = (event: any) => {
    setProjectDescription(event.target.value);
  };

  const handleChange = (event: any) => {};
  const handleUpdateProject = (formValues: any) => {
    dispatch(editProjectRequest(formValues));
  };
  useEffect(() => {
    setProjectName(editProject?.project_name);
    setProjectDescription(editProject?.description);

  }, [editProject]);
  return (
    <>
      <Modal open={modalOpen}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "#161C23",
            boxShadow: 24,
            //   p: 2,
            width: "30%",
            borderRadius: " 0.5rem",
          }}
        >
          <form className="p-a-24" onSubmit={formik.handleSubmit}>
            <div className="project-modal-heading">
              <Typography className="new-poject-text">Edit Project</Typography>
              <div className="closed-icon-style custom-cursor" onClick={handleCloseAndReset}>
                <ClearIcon />
              </div>
            </div>

            <div className="form-labels">
              <FormLabel className="project-label-name">Project Name</FormLabel>
            </div>
            <div className="project-modal-text">
              <TextField
                className="project-name-input"
                name="name"
                placeholder="Project Name"
                onBlur={formik.handleBlur}
                value={formik.values.name}
                // id='project-name'
                // value={editProject?.project_name || projectName}
                onChange={formik.handleChange}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={
                  formik.touched.name && formik.errors.name
                    ? formik.errors.name.toString() : " "
                }
                autoFocus
              />
            </div>
            <div className="form-labels">
              <FormLabel className="project-label-name">Description</FormLabel>
            </div>
            <div className="project-modal-text">
              <TextField
                className="description-name-input"
                placeholder="Description"
                name="description"
                value={formik.values.description}
                onChange={formik.handleChange}
                error={
                  formik.touched.description &&
                  Boolean(formik.errors.description)
                }
                helperText={
                  formik.touched.description && formik.errors.description
                    ? formik.errors.description.toString() : " "
                }
                multiline
                rows={2}
              
              />
            </div>

            <Button
              disableRipple={true}
              className="project-modal-submit-button"
              type="submit"
              onClick={handleUpdateProject}
            >
              Update
            </Button>
          </form>
        </Box>
      </Modal>
    </>
  );
};

export default ProjectEditModal;
