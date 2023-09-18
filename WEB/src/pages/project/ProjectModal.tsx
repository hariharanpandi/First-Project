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
import { values } from "lodash";
import PreventSpaceAtFirst from "../../components/PrventSpaceAtFirst";

interface CommonModalProps {
  modalOpen: boolean;
  handleClose: () => void;
  handleCreate: any;
  isEdit: any;
  editProject: any;
}

const validationSchema = Yup.object().shape({
  name: Yup.string()
    // .transform((value) => value.trim())
    .required("Project Name is required")
    .min(3, "Project Name must be at least 3 characters")
    // .matches(/^[a-zA-Z\s-_]+$/, "Name must not contain numbers")
    .matches(/^[a-zA-Z0-9\s-_]+$/, 'Project Name must contain only alphanumeric, "-", "_", and space characters.')
    .max(50, "Project Name must be no longer than 50 characters")
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

const ProjectModal = ({
  modalOpen,
  handleClose,
  handleCreate,
  isEdit,
  editProject,
}: CommonModalProps) => {
  const dispatch = useDispatch();
  const [isProjectCreated, setIsProjectCreated] = useState(false);
  const [projectData, setProjectData] = useState([]);
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [isUpdate, setIsUpdate] = useState<any>("");
  const [formValues, setFormValues] = useState<any>("");

  const { editSuccess } = useSelector((state: any) => state.editProject);

  const formik = useFormik({
    initialValues: { name: "", description: "" },
    validationSchema,
    onSubmit: (values: any) => {
     
      setFormValues(values);
      handleCreate(values);
      formik.resetForm();
    },
  });

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
  

  const handleChange = (event: any) => {
    
  };


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
            borderRadius: "7px",
          }}
        >
          <form className="p-a-24"
          onSubmit={formik.handleSubmit}>
            <div className="project-modal-heading">
              <Typography className="new-poject-text">New Project</Typography>
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
                value={formik.values.name || editProject?.project_name}
                onKeyDown={(event) => PreventSpaceAtFirst(event)}
                // id='project-name'
                // value={editProject?.project_name || projectName}
                onChange={formik.handleChange}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name
                  ? formik.errors.name.toString() : " "
                }
                autoFocus
                onBlur={formik.handleBlur}
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
                value={formik.values.description || editProject?.description}
                onKeyDown={(event) => PreventSpaceAtFirst(event)}
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

            <Button disableRipple={true} className="project-modal-submit-button" type="submit">
              Create
            </Button>
          </form>
        </Box>
      </Modal>
    </>
  );
};

export default ProjectModal;
