import React, { useEffect, useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { getQueryParam } from '../../helper/SearchParams';
import { useDispatch, useSelector } from 'react-redux';
import { renameRequest, renameReset } from '../../redux/slice/workload-slice/renameWorkloadSlice';
import { CustomBackdrop } from '../../helper/backDrop';
import MySnackbar from '../../helper/SnackBar';
import { newWorkloadRequest, newWorkloadReset } from '../../redux/slice/workload-slice/newWorkloadSlice';
import PreventSpaceAtFirst from '../../components/PrventSpaceAtFirst';



interface ModalFormProps {
  visible: boolean;
  onHide: () => void;
  renameFlag: boolean;
  workloadData: any;
  showSnackbar: boolean; // Add the showSnackbar prop
  setShowSnackbar: any;
  appid: string;
  projectid: string;
}


const validationSchema = Yup.object().shape({
  textFieldValue: Yup.string().required('Workload Name is Required')
  .min(3, "Workload Name must be at least 3 characters")
});

const WorkloadCreate: React.FC<ModalFormProps> = ({ visible, onHide, renameFlag, workloadData,setShowSnackbar, appid, projectid }) => {

  const navigate = useNavigate();
  const {renameType ,renameSuccess,renameError} =
useSelector((state: any) => state.rename);
const {newWorkloadType ,newWorkloadSuccess,newWorkloadError,newWorkloadLoading} =
useSelector((state: any) => state.newWorkload);
  const [severity, setSeverity] = useState("");
const [message, setMessage] = useState("");
const app_id=getQueryParam('app_id')
const [snackOpen, setSnackOpen] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(renameReset())
  }, [])
  const handleSnackbarClose = () => {
    setSnackOpen(false);
  };
  useEffect(() => {
    if (renameType) {
      setMessage(renameType);
      setSeverity("success");
      setSnackOpen(true);
      // setShowSnackbar(true);
    } else if (renameError) {
      setMessage(renameError);
      setSeverity("error");
      setSnackOpen(true);
      // setShowSnackbar(false);
    }
    return () => {
      dispatch(renameReset());
    };
  }, [renameType, renameError]);
  useEffect(() => {
    if (newWorkloadSuccess) {   
      
        navigate(`/overview/workload?app_id=${appid}&projectId=${projectid}&workload=${newWorkloadType.workload_name}&create=true`)
          
    } else if (newWorkloadError) {
     
      setMessage(newWorkloadError?.message);
      setSeverity("error");
      setSnackOpen(true);
      // setShowSnackbar(false);
    }
    return () => {
      dispatch(newWorkloadReset());
    };
  }, [newWorkloadSuccess, newWorkloadError]);


  const handleSubmit = (values: any) => {
   
    const renameObj = {

      workload_id: workloadData?._id,
      workload_name: values?.textFieldValue,
      app_id:app_id

    }
    if (renameFlag) {
      const renameObj = {

        workload_id: workloadData?._id,
        workload_name: values?.textFieldValue,
        app_id:app_id
  
      }
      dispatch(renameRequest(renameObj))
      onHide();

    }
    else {
      dispatch(newWorkloadRequest(renameObj))
      // navigate(`/overview/workload?app_id=${appid}&projectId=${projectid}&workload=${values.textFieldValue}&create=true`)
      // onHide();
    }
    // Snackbar close handler
  // const handleSnackbarClose = () => {
  //   setSnackOpen(false);
  // };


  };
  


  return (
    <Dialog
      visible={visible}
      header={renameFlag ? "Rename Workload" : "New Workload"}
      onHide={onHide}
      className={'workload-popup'}
      position='bottom'

    >
      <CustomBackdrop open={newWorkloadLoading} />
      <Formik initialValues={{  textFieldValue:renameFlag ? ''|| workloadData?.workload_name :'' }} onSubmit={handleSubmit} validationSchema={validationSchema}>
        <Form>
          <div className="p-field">
            <label htmlFor="textFieldValue" className={'workload'}>Workload Name</label>
            <div>
              <Field type="text" id="textFieldValue" name="textFieldValue" className={'workload-create'} maxLength="20"onKeyDown={(event:any) => PreventSpaceAtFirst(event)} autoFocus/>
            </div>

            <ErrorMessage name="textFieldValue" component="div" className="p-error" />
          </div>
          <div>
            <button type="submit" className={'canvas-button'} >
              {renameFlag ? "Update" : "Proceed to Canvas"}
            </button>
          </div>
        </Form>
      </Formik>
      <MySnackbar
        className="snack-bar"
        message={message}
        severity={severity}
        open={snackOpen}
        onClose={handleSnackbarClose}
      />
    </Dialog>
  );
};

export default WorkloadCreate;
