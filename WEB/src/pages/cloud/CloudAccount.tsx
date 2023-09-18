import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import CloudRightSideImg from '../../assets/images/layoutLogin.png';
import NavigateBack from '../../assets/images/backArrow.png';
import WhiteLeftArrow from '../../assets/images/white-left-arrow.svg';
import { resetCloudPersistData } from './ResetCloudPersistData';
import { CustomBackdrop } from '../../helper/backDrop';
import { postCloudAccountCreateRequest, postCloudAccountCreateReset } from '../../redux/slice/cloud-slice/PostCloudAccountCreateSlice';
import _ from 'lodash';
import MySnackbar from '../../helper/SnackBar';
import { ConfirmDialog } from 'primereact/confirmdialog';
import RightArrow from '../../assets/images/right-arrow.svg';
import PreventSpaceAtFirst from '../../components/PrventSpaceAtFirst';

const CloudAccount = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { select_cloud_platform } = useParams();
    const [severity, setSeverity] = useState("");
    const [message, setMessage] = useState("");
    const [open, setOpen] = useState(false);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);

    //**  useSelector for Cloud Account Create - Start */

    const { postCloudAccountCreateData, postLoading: accountCreateLoading, postError: accountCreateError } = useSelector(
        (state: any) =>
            state.postCloudAccountCreate);
    //**  useSelector for Cloud Account Create - End */


    // ** The effect call when the Cloud Account Create  is successful - start */

    useEffect(() => {
        if (!_.isNil(postCloudAccountCreateData)) {
            setOpen(true);
            setSeverity('success');
            setMessage('Cloud account added successfully');
            setTimeout(() => {
                navigate(`/overview?cloud-account=true&projectId=${owner}`);
            }, 1500)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [postCloudAccountCreateData]);

    // ** The effect call when the Cloud Account Create  is successful - End */

    // ** The effect call for Snackbar message for create cloud account- start */

    useEffect(() => {

        if (accountCreateError) {
            setOpen(true);
            setSeverity('error');
            setMessage(accountCreateError);
        }

        return () => {
            dispatch(postCloudAccountCreateReset())
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, navigate, accountCreateError, accountCreateLoading]);

    // ** The effect call for Snackbar message for create cloud account- end */

    const handleSnackbarClose = () => setOpen(false);
    //**  useSelector for cloud persist data for [AWS, Azure, GCP, OCI]- Start */

    const {
        _id,
        owner,
        _cls,
        project_name,
        apikey,
        apisecret,
        account_type,
        access_type,
        environment,
        authentication_protocol,
        tenant_id,
        secret,
        key,
        subscription_id,
        subscription_type,
        bucket_name,
        cost_report_format_fields,
        opted_regions,
        is_verifyed_success,
        account_name,
    } = useSelector((state: any) => {
        switch (select_cloud_platform?.toLocaleLowerCase()) {
            case 'aws':
                return state?.persistedCloudPersistData?.awsPersistData;
            case 'azure':
                return state?.persistedCloudPersistData.azurePersistData;
            case 'gcp':
                return state.persistedCloudPersistData?.gcpPersistData;
            case 'oci':
                return state?.persistedCloudPersistData?.ociPersistData;
            default:
                return ''
        }
    });

    //**  useSelector for cloud persist data for [AWS, Azure, GCP, OCI]- End */


    useEffect(() => {
        if (!owner || !select_cloud_platform?.toLocaleLowerCase() || !project_name) {
            resetCloudPersistData(dispatch);
            navigate('/overview');
        };

        if (!is_verifyed_success || account_name !== '') {
            navigate(`/overview?cloud-account=true&projectId=${owner}`);
        };
        // ** empty dependency array,  React that the effect should only run once */
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleCancel = () => {
        setShowConfirmDialog(false);
    };

    const handleQuit = () => {
        setShowConfirmDialog(false);
        resetCloudPersistData(dispatch);
        navigate(`/overview?cloud-account=true&projectId=${owner}`);
    };

    //** The handleQuitOnBoarding is use to Quit and navigate to discovery page - start  */

    const handleQuitOnBoarding = () => {
        setShowConfirmDialog(true);
    }

    //** The handleQuitOnBoarding is use to Quit and navigate to discovery page - End  */

    const initialValues = {
        account_name: account_name || '',
    };

    const validationSchema =  Yup.object().shape({
        account_name: Yup.string().required('Cloud Account Name is required')
            .trim()
            .matches(/^[a-zA-Z0-9-_ ]{5,50}$/, 'Cloud Account Name must be between 5 and 50 characters and can only contain alphabets, numbers, "-", "_", and space characters.'),
    })

    const onHandleSubmit = (value: { account_name: any; }) => {
        switch (select_cloud_platform?.toLocaleLowerCase()) {
            case 'aws':
                const aws = {
                    _cls: _cls,
                    apikey: apikey,
                    apisecret: apisecret,
                    owner: owner,
                    account_name: value.account_name,
                    account_type: account_type,
                    access_type: access_type,
                    environment: environment,
                    authentication_protocol: authentication_protocol,
                    bucket_name: bucket_name,
                    cost_report_format_fields: cost_report_format_fields,
                    opted_regions: opted_regions,
                };

                if (_id === '') {
                    dispatch(postCloudAccountCreateRequest({
                        data: aws,
                    }))
                } else {
                    throw new Error('Not allowed to edit the account name')
                }
                break
            case 'azure':
                const azure = {
                    _cls: _cls,
                    key: key,
                    secret: secret,
                    owner: owner,
                    subscription_id: subscription_id,
                    tenant_id: tenant_id,
                    account_name: value.account_name,
                    access_type: access_type,
                    environment: environment,
                    subscription_type: subscription_type
                };
                if (_id === '') {
                    dispatch(postCloudAccountCreateRequest({
                        data: azure,
                    }))
                } else {
                    throw new Error('Not allowed to edit the account name')
                }
                break
            case 'gcp':
                break

            case 'oci':
                break

            default:
                throw new Error(`Some think went worng in Cloud Account 
                 component (CloudAccount.tsx) line no 200`);
        }
    }

    //** The handleBack is use to go one level back and navigate to cloud onboarding - start  */

    const handleBack = () => {
        navigate(`/overview/discovery/cloud-platform/${select_cloud_platform?.toLocaleLowerCase()}/onboarding/authentication-details`);
    };

    //** The handleBack is use to go one level back and navigate to cloud onboarding - end  */

    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: onHandleSubmit,
    });

    return (
        <>
            <CustomBackdrop open={accountCreateLoading} />
            <main className='cloud-account'>
                <section className='cloud-account-contant'>
                    <nav>
                        <span onClick={handleQuitOnBoarding}>
                            <img className='custom-cursor' src={NavigateBack} alt='Navigate Back' />
                        </span>
                        <span>{project_name}</span>
                    </nav>
                    <div className='cloud-account-contant-view'>
                        <h1>Almost There</h1>
                        <p>Your are few steps away from onboarding your cloud accounts</p>
                        <form onSubmit={formik.handleSubmit}>
                            <div>
                                <label htmlFor='account_name'>Cloud Account Name</label>
                                <InputText
                                    id='account_name'
                                    name='account_name'
                                    value={formik.values.account_name}
                                    onChange={formik.handleChange}
                                    onKeyDown={(event) => PreventSpaceAtFirst(event)}
                                    onBlur={formik.handleBlur}
                                    className={formik.touched.account_name && formik.errors.account_name ? 'p-invalid' : ''}
                                />
                                {formik.touched.account_name && formik.errors.account_name && (
                                    <div className='p-invalid'>{String(formik.errors.account_name)}</div>
                                )}
                            </div>
                            <section className='cloud-account-view-btn'>
                                <div onClick={handleBack}>
                                    <Button className="back-btn" type='button' label="Back" />
                                    <img className="procced-back" src={RightArrow} alt="Back right Icon" />
                                </div>
                                <div>
                                    <Button className='done-btn' label='Done' type='submit'>
                                        <img src={WhiteLeftArrow} alt='Proceed Left Icon' />
                                    </Button>
                                </div>
                            </section>
                        </form>
                    </div>
                </section>
                <section className='cloud-account-img'>
                    <img src={CloudRightSideImg} alt='Cloud onboarding' />
                </section>
            </main>
            <ConfirmDialog
                className="confirm-dialog-cloud-onboarding"
                visible={showConfirmDialog}
                onHide={() => setShowConfirmDialog(false)}
                accept={handleCancel}
                reject={handleQuit}
                acceptLabel={'No, Stay Here'}
                rejectLabel={'Yes, Quit'}
                position='bottom'
                message={
                    <>
                        <span className='confirm-dialog-normal'>Are you sure you want to quit the</span>
                        <span className='confirm-dialog-italic'> cloud account onboarding process?</span>
                    </>
                }
                header="Quit Cloud Onboarding"
                icon="pi pi-exclamation-triangle"
            >
                <template>
                    <div className='p-d-flex p-jc-between'>
                        <Button className='p-button-text'>No, Stay Here</Button>
                        <Button className='p-button-text'>Yes, Quit</Button>
                    </div>
                </template>
            </ConfirmDialog>
            <MySnackbar
                className="snack-bar"
                message={message}
                severity={severity}
                open={open}
                onClose={handleSnackbarClose}
            />
        </>
    );
};

export default CloudAccount;
