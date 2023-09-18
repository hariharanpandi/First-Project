import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Button } from 'primereact/button';
import CloudRightSideImg from '../../assets/images/layoutLogin.png';
import NavigateBack from '../../assets/images/backArrow.png';
import LeftArrow from '../../assets/images/left-arrow.svg';
import RightArrow from '../../assets/images/right-arrow.svg';
import { Dropdown } from 'primereact/dropdown';
import { AWSCloudConstant } from '../../helper/cloud-constant/awsCloudConstant';
import { resetCloudPersistData } from './ResetCloudPersistData';
import { AZURECloudConstant } from '../../helper/cloud-constant/azureCloudConstant';
import { GCPCloudConstant } from '../../helper/cloud-constant/gcpCloudConstant';
import { OCICloudConstant } from '../../helper/cloud-constant/ociCloudConstant';
import { setAwsPersistData } from '../../redux/slice/cloud-slice/awsPersistDataSlice';
import { CloudConstantType } from '../../redux/@types/cloud-types/CommenCloudTypes';
import { setAzurePersistData } from '../../redux/slice/cloud-slice/azurePersistDataSlice';
import { ConfirmDialog } from 'primereact/confirmdialog';
import _ from 'lodash';

const CloudOnboarding = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { select_cloud_platform } = useParams();
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);

    //**  useSelector for cloud persist data for [AWS, Azure, GCP, OCI]- Start */

    const {
        _id,
        owner,
        project_name,
        constant_field,
        account_type,
        access_type,
        environment,
        authentication_protocol,
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
                return '';
        }
    });

    //**  useSelector for cloud persist data for [AWS, Azure, GCP, OCI]- Start */

    useEffect(() => {
        if (!owner || !select_cloud_platform?.toLocaleLowerCase() || !project_name) {
            resetCloudPersistData(dispatch);
            navigate('/overview');
        }

        // ** empty dependency array,  React that the effect should only run once */
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

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

    //** The handleQuitOnBoarding is use to Quit and navigate to discovery page - end  */

    //** The handleBack is use to go one level back and navigate to cloud platform - start  */

    const handleBack = () => {
        navigate(`/overview/discovery/${owner}/cloud-platform/${select_cloud_platform?.toLocaleLowerCase()}`);
    };

    //** The handleBack is use to go one level back and navigate to cloud platform - end  */

    //** This is cloud constant - start  */
    const cloudConstantMapping: Record<string, any> = {
        AWSCloudConstant: AWSCloudConstant,
        AZURECloudConstant: AZURECloudConstant,
        GCPCloudConstant: GCPCloudConstant,
        OCICloudConstant: OCICloudConstant,
    };

    //** This is cloud constant - end  */

    let initialValues: Record<string, string> = {};
    let validationSchema: Yup.ObjectSchema<Record<string, string>,
        Yup.AnyObject, Record<string, undefined>, ''> = Yup.object().shape({});

    // **initialValues and validationSchema for AWS - Start */

    if (constant_field === CloudConstantType.AWS_CL0UD_CONSTANT) {
        initialValues = {
            account_type: account_type || 'Master Account',
            access_type: access_type || 'Access',
            environment: environment || 'AWS Standard',
            authentication_protocol: authentication_protocol || 'Access Key',
        };

        validationSchema = Yup.object().shape({
            account_type: Yup.string().required('Please select an Account Type'),
            access_type: Yup.string().required('Please select an Access Type'),
            environment: Yup.string().required('Please select an AWS environment'),
            authentication_protocol: Yup.string().required('Please select an authentication protocol'),
        });
    };

    // **initialValues and validationSchema for AWS - End */

    // **initialValues and validationSchema for Azure - Start */

    if (constant_field === CloudConstantType.AZURE_CL0UD_CONSTANT) {
        initialValues = {
            access_type: access_type || 'Access',
            environment: environment || 'Azure Global',
        };

        validationSchema = Yup.object().shape({
            access_type: Yup.string().required('Please select an Access Type'),
            environment: Yup.string().required('Please select an AWS environment'),
        });
    };

    // **initialValues and validationSchema for Azure - End */

    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: (values: Record<string, string>) => {
            switch (constant_field) {
                case CloudConstantType.AWS_CL0UD_CONSTANT:
                    dispatch(setAwsPersistData(values));
                    break;
                case CloudConstantType.AZURE_CL0UD_CONSTANT:
                    dispatch(setAzurePersistData(values));
                    break;
                default:
                    throw new Error(`Some think went worng in cloud onboarding
                     component (CloudOnboarding.tsx) line no 147`);
            }
            navigate(`/overview/discovery/cloud-platform/${select_cloud_platform?.toLocaleLowerCase()}/onboarding/authentication-details`);
        }
    });

    return (
        <>
            <main className="cloud">
                <section className="cloud-contant">
                    <nav>
                        <span onClick={handleQuitOnBoarding}>
                            <img className="custom-cursor" src={NavigateBack} alt="Navigate Back" />
                        </span>
                        <span>{project_name} {_id === '' ? '' : `/ ${account_name}`}</span>
                    </nav>
                    <h1>
                        {
                          select_cloud_platform === 'aws' ? select_cloud_platform.toLocaleUpperCase() :  _.capitalize(select_cloud_platform)
                        }  Onboarding</h1>
                    <p>Please provide the necessary information to get access to your cloud accounts</p>
                    <form className="cloud-form" onSubmit={formik.handleSubmit}>
                        <section className="section-1">
                            {cloudConstantMapping[constant_field]?.CLOUD?.ON_BOARDING?.map((
                                { label, fieldtype, options, name }
                                    : {
                                        label: string,
                                        fieldtype: string,
                                        options: { label: string; value: string; }[],
                                        name: string
                                    }) => {
                                if (fieldtype === 'dropdown') {
                                    const fieldName = name as keyof typeof formik.values;
                                    const fieldError = formik.errors[fieldName] as string;
                                    const fieldValue = formik.values[fieldName];

                                    return (
                                        <div key={name}>
                                            <label>{label}</label>
                                            <Dropdown
                                                filter
                                                filterPlaceholder='Search'
                                                name={name}
                                                options={options}
                                                value={fieldValue}
                                                onChange={formik.handleChange}
                                                className={fieldError ? 'p-invalid' : ''}
                                            />
                                            {formik.touched[fieldName] && fieldError && (
                                                <div className="p-invalid">{fieldError}</div>
                                            )}
                                        </div>
                                    );
                                }

                                return null;
                            })}

                        </section>
                        <div className={
                            _id === '' ? 'cloud-contant-btn' : "cloud-contant-btn justify-content-btn"
                        }>
                            {_id === '' && <div onClick={handleBack}>
                                <Button className="back-btn" type='button' label="Back" />
                                <img className="procced-back" src={RightArrow} alt="Back right Icon" />
                            </div>}
                            <div>
                                <Button className="procced-btn procced" type='submit' label={_id === '' ? "Proceed" : "Next"} >
                                    <img className="procced-img" src={LeftArrow} alt="Proceed Left Icon" />
                                </Button>
                            </div>
                        </div>
                    </form>
                </section>
                <section className="cloud-img">
                    <img src={CloudRightSideImg} alt="Cloud onboarding" />
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
                header="Quit Cloud onboarding"
                icon="pi pi-exclamation-triangle"
            >
                <template>
                    <div className='p-d-flex p-jc-between'>
                        <Button className='p-button-text'>No, Stay Here</Button>
                        <Button className='p-button-text'>Yes, Quit</Button>
                    </div>
                </template>
            </ConfirmDialog>
        </>
    );
};

export default CloudOnboarding;
