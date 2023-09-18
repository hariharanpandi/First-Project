import { ChangeEvent, useEffect, useReducer, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { MultiSelect } from 'primereact/multiselect';
import CloudRightSideImg from '../../assets/images/layoutLogin.png';
import NavigateBack from '../../assets/images/backArrow.png';
import LeftArrow from '../../assets/images/left-arrow.svg';
import RightArrow from '../../assets/images/right-arrow.svg';
import { AWSCloudConstant } from '../../helper/cloud-constant/awsCloudConstant';
import { AZURECloudConstant } from '../../helper/cloud-constant/azureCloudConstant';
import { GCPCloudConstant } from '../../helper/cloud-constant/gcpCloudConstant';
import { OCICloudConstant } from '../../helper/cloud-constant/ociCloudConstant';
import { resetCloudPersistData } from './ResetCloudPersistData';
import PreventSpaceAtFirst from '../../components/PrventSpaceAtFirst';
import { postVerifyConnectionRequest, postVerifyConnectionReset } from '../../redux/slice/cloud-slice/PostVerifyConnectionSlice';
import MySnackbar from '../../helper/SnackBar';
import { CloudConstantType } from '../../redux/@types/cloud-types/CommenCloudTypes';
import { setAwsPersistData } from '../../redux/slice/cloud-slice/awsPersistDataSlice';
import { setAzurePersistData } from '../../redux/slice/cloud-slice/azurePersistDataSlice';
import { postCloudRegionRequest, postCloudRegionReset } from '../../redux/slice/cloud-slice/PostCloudRegionSlice';
import { postSubscriptionsRequest, postSubscriptionsReset } from '../../redux/slice/cloud-slice/PostSubscriptionsSlice';
import { CustomBackdrop } from '../../helper/backDrop';
import _ from 'lodash';
import { putCloudAccountEditRequest, putCloudAccountEditReset } from '../../redux/slice/cloud-slice/PutCloudAccountEditSlice';
import { ConfirmDialog } from 'primereact/confirmdialog';
import EyeIcon from "../../assets/icons/EyeIcon";
import EyeCloseLine from "../../assets/icons/EyeCloseLine";

const initialState = {
    showPassword: {},
};


const reducer = (
    state: { showPassword: { [x: string]: boolean }; },
    action: { type: string; fieldName: string; }
) => {
    switch (action.type) {
        case 'TOGGLE_PASSWORD_VISIBILITY':
            return {
                ...state,
                showPassword: {
                    ...state.showPassword,
                    [action.fieldName]: !state.showPassword[action.fieldName],
                },
            };
        default:
            return state;
    }
};

const AuthenticationDetails = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { select_cloud_platform } = useParams();
    const [verifySpinner, setVerifySpinner] = useState<boolean>(false);
    const [verifyDisabled, setVerifyDisabled] = useState<boolean>(false);
    const [severity, setSeverity] = useState("");
    const [message, setMessage] = useState("");
    const [open, setOpen] = useState(false);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [state, dispatchReducer] = useReducer(reducer, initialState);

    //**  useSelector for post verify - Start */

    const { verifyConnectionType, postLoading: verifyLoading, postError: verifyError } = useSelector(
        (state: any) =>
            state.postVerifyConnection);
    //**  useSelector for post verify - End */

    //**  useSelector for Cloud Account Update - Start */

    const { putCloudAccountEditData, postLoading: accountEditLoading, postError: accountEditError } = useSelector(
        (state: any) =>
            state.putCloudAccountEdit);
    //**  useSelector for Cloud Account Update - End */

    // ** The effect call when the Cloud Account Update  is successful - start */

    useEffect(() => {
        if (!_.isNil(putCloudAccountEditData)) {
            setOpen(true);
            setSeverity('success');
            setMessage('Cloud account updated successfully');
            setTimeout(() => {
                navigate(`/overview?cloud-account=true&projectId=${owner}`);
            }, 1500)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [putCloudAccountEditData]);

    // ** The effect call when the Cloud Account Update  is successful - End */

    // ** The effect call for Snackbar message for Update cloud account- start */

    useEffect(() => {

        if (accountEditError) {
            setOpen(true);
            setSeverity('error');
            setMessage('Cloud account Update failed');
        }

        return () => {
            dispatch(putCloudAccountEditReset())
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, navigate, accountEditError, accountEditLoading]);

    // ** The effect call for Snackbar message for Update cloud account- end */

    //**  useSelector for Cloud Region verify - Start */

    const { postCloudRegionData, postLoading: regionLoading } = useSelector(
        (state: any) =>
            state.postCloudRegion);

    //**  useSelector for Cloud Region verify - End */

    //**  useSelector for Subscriptions verify - Start */

    const { postSubscriptionsData, postLoading: SubscriptionsLoading } = useSelector(
        (state: any) =>
            state.postSubscriptions);

    //**  useSelector for Subscriptions verify - End */

    //**  useSelector for cloud persist data for [AWS, Azure, GCP, OCI]- Start */

    const {
        _id,
        owner,
        constant_field,
        _cls,
        project_name,
        apikey,
        apisecret,
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
        account_type,
        access_type,
        environment,
        authentication_protocol,
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

    //**  useSelector for cloud persist data for [AWS, Azure, GCP, OCI]- End */

    const initialRegion = opted_regions?.length > 0 ? opted_regions.map((region: string) => {
        return {
            label: region,
            value: region,
        }
    }) : [];

    const [fetchedRegions, setFetchedRegions] = useState<any[]>(initialRegion);


    const [fetchedSubscriptions, setFetchedSubscriptions] = useState<any[]>([]);


    useEffect(() => {
        if (!owner || !select_cloud_platform?.toLocaleLowerCase() || !project_name) {
            resetCloudPersistData(dispatch);
            navigate('/overview');
        };
        setVerifyDisabled(is_verifyed_success)

        if (_id !== '' && is_verifyed_success && select_cloud_platform?.toLocaleLowerCase() === 'aws') {
            const formCloudeRegionRequest = {
                provider: _cls,
                apikey: apikey,
                apisecret: apisecret,
                project_id: owner,
                project_name: project_name,
            };

            dispatch(postCloudRegionRequest({
                data: formCloudeRegionRequest,
            }))
        };

        if (_id !== '' && is_verifyed_success && select_cloud_platform?.toLocaleLowerCase() === 'azure') {
            const formSubscriptionsRequest = {
                provider: _cls,
                tenant_id: tenant_id,
                secret: secret,
                key: key,
                project_id: owner,
                project_name: project_name,
            };

            dispatch(postSubscriptionsRequest({
                data: formSubscriptionsRequest,
            }));
        };
        // ** empty dependency array,  React that the effect should only run once */
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ** The effect call when the verify is successful - start*/

    useEffect(() => {
        if (verifyConnectionType) {
            setVerifySpinner(false);
            setOpen(true);
            setSeverity('success');
            setMessage('Authentication detail verified successfully');

            switch (constant_field) {
                case CloudConstantType.AWS_CL0UD_CONSTANT:
                    dispatch(setAwsPersistData({
                        is_verifyed_success: true,
                    }));
                    break;
                case CloudConstantType.AZURE_CL0UD_CONSTANT:
                    dispatch(setAzurePersistData({
                        is_verifyed_success: true,
                    }));
                    break;
                default:
                    throw new Error(`Some think went worng in Authentication details
        component (AuthenticationDetails.tsx) line no 222`);
            };
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [verifyConnectionType]);

    // ** The effect call when the verify is successful - end*/


    // ** The effect call when the Region  is successful - start */

    useEffect(() => {
        if (postCloudRegionData && postCloudRegionData?.length > 0) {

            const regions = postCloudRegionData?.map(({ region }: { region: string }) => {
                return {
                    label: region,
                    value: region
                }
            });
            setFetchedRegions(regions)
        } else if (postCloudRegionData?.length === 0) {
            setFetchedRegions([]);
        }
    }, [postCloudRegionData]);

    // ** The effect call when the Region  is successful - End */

    // ** The effect call when the SubscriptionsData  is successful - start */

    useEffect(() => {
        if (postSubscriptionsData && postSubscriptionsData?.length > 0) {

            const subscriptions = postSubscriptionsData?.map(({
                id, display_name
            }: {
                id: string,
                display_name: string,
            }) => {
                return {
                    label: display_name,
                    value: id
                }
            });
            setFetchedSubscriptions(subscriptions)
        } else if (postSubscriptionsData?.length === 0) {
            setFetchedSubscriptions([]);
        }
    }, [postSubscriptionsData]);

    // ** The effect call when the SubscriptionsData  is successful - End */


    // ** The effect call for Snackbar message and to handle spinner and disable  - start */

    useEffect(() => {
        if (verifyLoading) {
            setVerifySpinner(true);
            setVerifyDisabled(true)
        } else if (verifyError) {
            setVerifySpinner(false);
            setVerifyDisabled(false);
            setOpen(true);
            setSeverity('error');
            setMessage('Authentication failed');

            switch (constant_field) {
                case CloudConstantType.AWS_CL0UD_CONSTANT:
                    dispatch(setAwsPersistData({
                        is_verifyed_success: false,
                        bucket_name: '',
                        cost_report_format_fields: '',
                        opted_regions: '',
                    }));
                    break;
                case CloudConstantType.AZURE_CL0UD_CONSTANT:
                    dispatch(setAzurePersistData({
                        is_verifyed_success: false,
                        subscription_id: '',
                        subscription_type: '',
                    }));
                    break;
                default:
                    throw new Error(`Some think went worng in Authentication details
                    component (AuthenticationDetails.tsx) line no 308`);
            }
        }

        return () => {
            dispatch(postVerifyConnectionReset())
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, navigate, verifyError, verifyLoading]);

    // ** The effect call for Snackbar message and to handle spinner and disable  - end */

    const handleCancel = () => {
        setShowConfirmDialog(false);
    };

    const handleQuit = () => {
        setShowConfirmDialog(false);
        resetCloudPersistData(dispatch);
        dispatch(postCloudRegionReset());
        dispatch(postSubscriptionsReset());
        navigate(`/overview?cloud-account=true&projectId=${owner}`);
    };

    //** The handleQuitOnBoarding is use to Quit and navigate to discovery page - start  */

    const handleQuitOnBoarding = () => {
        setShowConfirmDialog(true);
    };

    //** The handleQuitOnBoarding is use to Quit and navigate to discovery page - End  */

    //** The handleBack is use to go one level back and navigate to cloud onboarding - start  */

    const handleBack = () => {
        navigate(`/overview/discovery/cloud-platform/${select_cloud_platform?.toLocaleLowerCase()}/onboarding`);
    };

    //** The handleBack is use to go one level back and navigate to cloud onboarding - end  */

    //** This is cloud constant - start  */

    const cloudConstantMapping: Record<string, any> = {
        AWSCloudConstant: AWSCloudConstant,
        AZURECloudConstant: AZURECloudConstant,
        GCPCloudConstant: GCPCloudConstant,
        OCICloudConstant: OCICloudConstant,
    };


    //** This is cloud constant - end  */

    const handleSnackbarClose = () => setOpen(false);

    //** The handleRegionClick is get region when the region multi select is empty - start  */

    const handleRegionClick = () => {
        if (!is_verifyed_success) return;
        if (fetchedRegions.length === 0) {
            const formCloudeRegionRequest = {
                provider: _cls,
                apikey: apikey,
                apisecret: apisecret,
                project_id: owner,
                project_name: project_name,
            };

            dispatch(postCloudRegionRequest({
                data: formCloudeRegionRequest,
            }))
        }
    }

    //** The handleRegionClick is get region when the region multi select is empty - end  */

    //** The handleSubscriptionsClick is get Subscriptions when the Subscriptions dropdown is empty - start  */

    const handleSubscriptionsClick = () => {
        if (!is_verifyed_success) return;
        if (fetchedSubscriptions.length === 0) {
            const formSubscriptionsRequest = {
                provider: _cls,
                tenant_id: tenant_id,
                secret: secret,
                key: key,
                project_id: owner,
                project_name: project_name,
            };

            dispatch(postSubscriptionsRequest({
                data: formSubscriptionsRequest,
            }))
        }
    }

    //** The handleRegionClick is get region when the region multi select dropdown is empty - end  */

    const onHandleVerfiyChanges = (event: ChangeEvent<HTMLInputElement>, name: string) => {

        if (!is_verifyed_success) {
            setVerifyDisabled(false);
            return
        }

        if (
            (
                (name === 'apikey' && (apikey !== event.target.value || apikey === '')) ||
                (name === 'apisecret' && (apisecret !== event.target.value || apisecret === ''))
            ) && select_cloud_platform?.toLocaleLowerCase() === 'aws'
        ) {
            setVerifyDisabled(false);
        } else if (select_cloud_platform?.toLocaleLowerCase() === 'aws') {
            setVerifyDisabled(true);
        };

        if (
            (
                (name === 'tenant_id' && (tenant_id !== event.target.value || tenant_id === '')) ||
                (name === 'key' && (key !== event.target.value || key === '')) ||
                (name === 'secret' && (secret !== event.target.value || secret === ''))
            ) && select_cloud_platform?.toLocaleLowerCase() === 'azure'
        ) {
            setVerifyDisabled(false);
        } else if (select_cloud_platform?.toLocaleLowerCase() === 'azure') {
            setVerifyDisabled(true);
        }
    }

    let beforeVerifyInitialValues: Record<string, string> = {};
    let beforeVerifyValidationSchema: Yup.ObjectSchema<Record<string, string>,
        Yup.AnyObject, Record<string, undefined>, ''> = Yup.object().shape({});


    //** Form 1 - Before verify */

    // ** beforeVerifyInitialValues and beforeVerifyValidationSchema for AWS - Start */

    if (constant_field === CloudConstantType.AWS_CL0UD_CONSTANT) {
        beforeVerifyInitialValues = {
            apikey: apikey || '',
            apisecret: apisecret || '',
        };

        beforeVerifyValidationSchema = Yup.object().shape({
            apikey: Yup.string()
                .required('Access Key is required')
                .trim()
                .min(4, 'Access Key must be at least 4 characters')
                .max(64, 'Access Key cannot exceed 64 characters'),
            apisecret: Yup.string()
                .required('Secret Key is required')
                .trim()
                .min(4, 'Secret Key must be at least 4 characters')
                .max(64, 'Secret Key cannot exceed 64 characters'),
        });
    }

    // ** beforeVerifyInitialValues and beforeVerifyValidationSchema for AWS - End */

    // ** beforeVerifyInitialValues and beforeVerifyValidationSchema for Azure - Start */

    if (constant_field === CloudConstantType.AZURE_CL0UD_CONSTANT) {
        beforeVerifyInitialValues = {
            tenant_id: tenant_id || '',
            key: key || '',
            secret: secret || '',
        };

        beforeVerifyValidationSchema = Yup.object().shape({
            tenant_id: Yup.string()
                .required('Tenant ID is required')
                .trim()
                .min(4, 'Tenant ID must be at least 4 characters')
                .max(64, 'Tenant ID cannot exceed 64 characters'),
            key: Yup.string()
                .required('Application ID key is required')
                .trim()
                .min(4, 'Application ID key must be at least 4 characters')
                .max(64, 'Application ID key cannot exceed 64 characters'),
            secret: Yup.string()
                .required('Application Secret value is required')
                .trim()
                .min(4, 'Application Secret value must be at least 4 characters')
                .max(64, 'Application Secret value cannot exceed 64 characters'),
        });
    }

    // ** beforeVerifyInitialValues and beforeVerifyValidationSchema for Azure - End */

    const beforeVerifyFormik = useFormik({
        initialValues: beforeVerifyInitialValues,
        validationSchema: beforeVerifyValidationSchema,
        onSubmit: (values) => {

            let formVerifyRequest = {}
            switch (constant_field) {
                case CloudConstantType.AWS_CL0UD_CONSTANT:
                    formVerifyRequest = {
                        provider: _cls,
                        apikey: values.apikey,
                        apisecret: values.apisecret,
                        project_id: owner,
                        project_name: project_name,
                    };
                    afterVerifyFormik.resetForm();
                    dispatch(postCloudRegionReset());
                    setFetchedRegions([]);
                    dispatch(setAwsPersistData(values));
                    break;
                case CloudConstantType.AZURE_CL0UD_CONSTANT:
                    formVerifyRequest = {
                        provider: _cls,
                        tenant_id: values.tenant_id,
                        key: values.key,
                        secret: values.secret,
                        project_id: owner,
                        project_name: project_name,
                    };
                    dispatch(postSubscriptionsReset());
                    setFetchedSubscriptions([]);
                    dispatch(setAzurePersistData(values));
                    break;
                default:
                    throw new Error(`Some think went worng in Authentication details
                    component (AuthenticationDetails.tsx) line no 514`);
            }

            dispatch(postVerifyConnectionRequest({
                data: formVerifyRequest
            }));
        },
    });


    let afterVerifyInitialValues: Record<string, any> = {};
    let afterVerifyValidationSchema: Yup.ObjectSchema<Record<string, any>,
        Yup.AnyObject, Record<string, undefined>, ''> = Yup.object().shape({});;


    //** Form 2 - After verify */

    // ** afterVerifyInitialValues and afterVerifyValidationSchema for AWS - Start */

    if (constant_field === CloudConstantType.AWS_CL0UD_CONSTANT) {
        afterVerifyInitialValues = {
            bucket_name: bucket_name || '',
            cost_report_format_fields: cost_report_format_fields || '',
            opted_regions: opted_regions && opted_regions.length > 0 ? opted_regions : [],
        };

        afterVerifyValidationSchema = Yup.object().shape({
            bucket_name: Yup.string()
                .required('Bucket Name is required')
                .trim()
                .min(4, 'Bucket Name must be at least 4 characters')
                .max(64, 'Bucket Name cannot exceed 64 characters')
                .matches(/^(?=^.{3,63}$)(?!xn--)([a-z0-9](?:[a-z0-9-]*)[a-z0-9])$/, "Bucket Name is not valid"
                ),


            cost_report_format_fields: Yup.string().required('Cost Report Format is required'),
            opted_regions: Yup.array()
                .required('Region is required')
                .min(1, 'At least one region must be selected'),
        });
    }

    // ** afterVerifyInitialValues and afterVerifyValidationSchema for AWS - Start */

    // ** afterVerifyInitialValues and afterVerifyValidationSchema for Azure - Start */

    if (constant_field === CloudConstantType.AZURE_CL0UD_CONSTANT) {
        afterVerifyInitialValues = {
            subscription_id: subscription_id || '',
            subscription_type: subscription_type || '',
        };

        afterVerifyValidationSchema = Yup.object().shape({
            subscription_id: Yup.string().required('subscription is required'),
            subscription_type: Yup.string().required('subscription type is required'),
        });
    }

    // ** afterVerifyInitialValues and afterVerifyValidationSchema for Azure - Start */

    const afterVerifyFormik = useFormik({
        initialValues: afterVerifyInitialValues,
        validationSchema: afterVerifyValidationSchema,
        enableReinitialize: true,
        onSubmit: (values) => {
            if (_id === '') {
                switch (constant_field) {
                    case CloudConstantType.AWS_CL0UD_CONSTANT:
                        dispatch(setAwsPersistData(values));
                        break;
                    case CloudConstantType.AZURE_CL0UD_CONSTANT:
                        dispatch(setAzurePersistData(values));
                        break;
                    default:
                        throw new Error(`Some think went worng in Authentication details
                        component (AuthenticationDetails.tsx) line no 590`);
                }
                navigate(`/overview/discovery/cloud-platform/${select_cloud_platform?.toLocaleLowerCase()}/onboarding/authentication-details/cloud-account`);
            } else {
                switch (select_cloud_platform?.toLocaleLowerCase()) {
                    case 'aws':
                        const aws = {
                            _id: _id,
                            _cls: _cls,
                            apikey: apikey,
                            apisecret: apisecret,
                            owner: owner,
                            account_name: account_name,
                            account_type: account_type,
                            access_type: access_type,
                            environment: environment,
                            authentication_protocol: authentication_protocol,
                            bucket_name: values.bucket_name,
                            cost_report_format_fields: values.cost_report_format_fields,
                            opted_regions: values.opted_regions,
                        };

                        dispatch(putCloudAccountEditRequest({
                            data: aws,
                        }));

                        break
                    case 'azure':
                        const azure = {
                            _id: _id,
                            _cls: _cls,
                            key: values.key,
                            secret: secret,
                            owner: owner,
                            subscription_id: values.subscription_id,
                            tenant_id: tenant_id,
                            account_name: account_name,
                            access_type: access_type,
                            environment: environment,
                            subscription_type: values.subscription_type
                        };

                        dispatch(putCloudAccountEditRequest({
                            data: azure,
                        }));

                        break
                    case 'gcp':
                        break

                    case 'oci':
                        break

                    default:
                        throw new Error(`Some think went worng in  Authentication details
                         component (Authenticationdetails.tsx) line no 644`);
                }
            }
        },
    });

    return (
        <>
            <CustomBackdrop open={regionLoading || SubscriptionsLoading || accountEditLoading} />
            <main className="cloud">
                <section className="cloud-contant">
                    <nav>
                        <span onClick={handleQuitOnBoarding}>
                            <img className="custom-cursor" src={NavigateBack} alt="Navigate Back" />
                        </span>
                        <span>{project_name} {_id === '' ? '' : `/ ${account_name}`}</span>
                    </nav>
                    <h1>Authentication Details</h1>
                    <p>Enter the required authentication Details for seamless cloud onboarding.</p>

                    {/*  Form 1 - Before verify - Start */}

                    <form onSubmit={beforeVerifyFormik.handleSubmit}>
                        <section className="section-1">
                            {/* SECTION_1 - Start */}
                            {cloudConstantMapping[constant_field]?.CLOUD.AUTHENTICATION_DETAILS.SECTION_1.map(
                                ({ label, fieldtype, name, displaytype }: {
                                    label: string,
                                    fieldtype: string,
                                    name: string,
                                    displaytype: string,
                                }) => {
                                    if (fieldtype === 'input') {
                                        const fieldName = name as keyof typeof beforeVerifyFormik.values;
                                        const fieldError = beforeVerifyFormik.errors[fieldName] as string;
                                        const fieldValue = beforeVerifyFormik.values[fieldName] as string;
                                        const fieldTouched = beforeVerifyFormik.touched[fieldName] as boolean;
                                        const isPasswordVisible = state.showPassword[fieldName];

                                        return (
                                            <div key={label}>
                                                <label>{label}</label>
                                                <InputText
                                                    onKeyDown={(event) => PreventSpaceAtFirst(event)}
                                                    name={name}
                                                    type={
                                                        (isPasswordVisible && displaytype !== 'secret') ?
                                                            'text' :
                                                            (!isPasswordVisible && displaytype === 'secret') ? 'password' : 'text'
                                                    }
                                                    autoComplete='true'
                                                    value={fieldValue}
                                                    placeholder={label}
                                                    onChange={(e) => {
                                                        beforeVerifyFormik.handleChange(e);
                                                        onHandleVerfiyChanges(e, name)
                                                    }}
                                                    onBlur={beforeVerifyFormik.handleBlur}
                                                    className={fieldError && fieldTouched ? 'p-invalid' : ''}
                                                />
                                                {
                                                    isPasswordVisible && displaytype === 'secret'
                                                    && (<span className='show-password-text'
                                                        onClick={() => dispatchReducer({ type: 'TOGGLE_PASSWORD_VISIBILITY', fieldName })}>
                                                        <EyeCloseLine />
                                                    </span>)
                                                }
                                                {
                                                    !isPasswordVisible && displaytype === 'secret'
                                                    && (
                                                        <span className='show-password-text'
                                                            onClick={() => dispatchReducer({ type: 'TOGGLE_PASSWORD_VISIBILITY', fieldName })}>
                                                            <EyeIcon />
                                                        </span>)
                                                }
                                                {fieldError && fieldTouched && (
                                                    <div className="p-invalid">{fieldError}</div>
                                                )}
                                            </div>
                                        );
                                    }
                                    return null;
                                }
                            )}
                            {/* SECTION_1 - end */}
                        </section>
                        <div className="cloud-contant-btn">
                            <div>
                                <Button
                                    loading={verifySpinner}
                                    iconPos="right"
                                    className="procced-btn verify"
                                    label="Verify"
                                    type="submit"
                                    disabled={verifyDisabled}
                                />
                            </div>
                        </div>
                    </form>

                    {/*  Form 1 - Before verify - End */}

                    {/*  Form 1 - After verify - Start */}

                    <form onSubmit={afterVerifyFormik.handleSubmit} className="cloud-form">
                        <section className="section-1">
                            {/* SECTION_2 - Start */}
                            {cloudConstantMapping[constant_field]?.CLOUD.AUTHENTICATION_DETAILS?.SECTION_2?.map(
                                ({ label, fieldtype, name }: {
                                    label: string,
                                    fieldtype: string,
                                    name: string,
                                }) => {
                                    if (fieldtype === 'input') {
                                        const fieldName = name as keyof typeof afterVerifyFormik.values;
                                        const fieldError = afterVerifyFormik.errors[fieldName] as string;
                                        const fieldValue = afterVerifyFormik.values[fieldName] as string;
                                        const fieldTouched = afterVerifyFormik.touched[fieldName] as boolean;

                                        return (
                                            <div key={label}>
                                                <label>{label}</label>
                                                <InputText
                                                    onKeyDown={(event) => PreventSpaceAtFirst(event)}
                                                    name={name}
                                                    value={!is_verifyed_success ? '' : fieldValue}
                                                    placeholder={label}
                                                    onChange={afterVerifyFormik.handleChange}
                                                    onBlur={afterVerifyFormik.handleBlur}
                                                    disabled={!is_verifyed_success || !verifyDisabled}
                                                    className={fieldError && fieldTouched ? 'p-invalid' : ''}
                                                    autoComplete='true'
                                                />
                                                {fieldError && fieldTouched && (
                                                    <div className="p-invalid">{fieldError}</div>
                                                )}
                                            </div>
                                        );
                                    }
                                    return null;
                                }
                            )}
                            {/* SECTION_2 - End */}
                        </section>

                        {/* SECTION_3 - Start */}

                        {
                            cloudConstantMapping[constant_field]?.CLOUD.AUTHENTICATION_DETAILS.SECTION_3.map(({
                                header,
                                discription
                            }: {
                                header: string,
                                discription: string,
                            }, index: number) => {
                                return (
                                    <section className={
                                        header === 'Subscriptions' ? 'p-t-0' : 'section'
                                    } key={index}>
                                        <h2>{header}</h2>
                                        <p>{discription}</p>
                                    </section>
                                )
                            })
                        }

                        {/* SECTION_3 - End */}

                        <section className="section-1">
                            {/* SECTION_4 - Start */}
                            {cloudConstantMapping[constant_field]?.CLOUD.AUTHENTICATION_DETAILS.SECTION_4.map(
                                ({ label, fieldtype, name, options }: {
                                    label: string,
                                    fieldtype: string,
                                    name: string,
                                    options: any[],
                                }) => {
                                    if (fieldtype === 'dropdown') {
                                        const fieldName = name as keyof typeof afterVerifyFormik.values;
                                        const fieldError = afterVerifyFormik.errors[fieldName] as string;
                                        const fieldValue = afterVerifyFormik.values[fieldName];
                                        const fieldTouched = afterVerifyFormik.touched[fieldName] as boolean;

                                        return (
                                            <div key={label}>
                                                {fieldtype === 'dropdown' && name === 'subscription_id' && (
                                                    <>
                                                        <label>{label}</label>
                                                        <div onClick={handleSubscriptionsClick}>
                                                            <Dropdown
                                                                filter
                                                                name={name}
                                                                filterPlaceholder='Search'
                                                                options={fetchedSubscriptions}
                                                                value={!is_verifyed_success ? [] : fieldValue}
                                                                placeholder='Select'
                                                                onChange={afterVerifyFormik.handleChange}
                                                                onBlur={afterVerifyFormik.handleBlur}
                                                                disabled={!is_verifyed_success || !verifyDisabled}
                                                                className={fieldError && fieldTouched ? 'p-invalid' : ''}
                                                            />
                                                        </div>
                                                    </>
                                                )}
                                                {fieldtype === 'dropdown' && name !== 'subscription_id' && (
                                                    <>
                                                        <label>{label}</label>
                                                        <Dropdown
                                                            filter
                                                            name={name}
                                                            options={options}
                                                            filterPlaceholder='Search'
                                                            value={!is_verifyed_success ? [] : fieldValue}
                                                            placeholder='Select'
                                                            onChange={afterVerifyFormik.handleChange}
                                                            onBlur={afterVerifyFormik.handleBlur}
                                                            disabled={!is_verifyed_success || !verifyDisabled}
                                                            className={fieldError && fieldTouched ? 'p-invalid' : ''}
                                                        />
                                                    </>
                                                )}
                                                {fieldError && fieldTouched && (
                                                    <div className="p-invalid">{fieldError}</div>
                                                )}
                                            </div>
                                        );
                                    }
                                    return null;
                                }
                            )}
                            {/* SECTION_4 - Start */}
                        </section>

                        {/** Region and scope will be displayed only for the type AWS - Start */}

                        {
                            select_cloud_platform?.toLocaleLowerCase() === 'aws' &&
                            <>
                                <section className="section">
                                    <h2>Region and Scope</h2>
                                    <p>Please select your preferred Region and Scope</p>
                                </section>
                                <section className="section-1">
                                    <div>
                                        <label>Region</label>
                                        <div onClick={handleRegionClick}>
                                            <MultiSelect
                                                filter
                                                name="opted_regions"
                                                value={!is_verifyed_success ? [] : afterVerifyFormik.values.opted_regions}
                                                options={fetchedRegions}
                                                disabled={!is_verifyed_success || !verifyDisabled}
                                                placeholder='Select'
                                                display="chip"
                                                filterPlaceholder='Search'
                                                onChange={afterVerifyFormik.handleChange}
                                                onBlur={afterVerifyFormik.handleBlur}
                                                className={afterVerifyFormik.touched.opted_regions && afterVerifyFormik.errors.opted_regions ? 'p-invalid' : ''}
                                            />
                                        </div>
                                        {afterVerifyFormik.touched.opted_regions && afterVerifyFormik.errors.opted_regions && (
                                            <div className="p-invalid">{String(afterVerifyFormik.errors.opted_regions)}</div>
                                        )}
                                    </div>
                                </section>
                            </>

                        }

                        {/** Region and scope will be displayed only for the type AWS */}

                        <div className="cloud-contant-btn">
                            <div onClick={handleBack}>
                                <Button className="back-btn" type='button' label="Back" />
                                <img className="procced-back" src={RightArrow} alt="Back right Icon" />
                            </div>
                            <div>
                                <Button className="procced-btn procced" type='submit' disabled={!is_verifyed_success || !verifyDisabled}
                                    label={_id === '' ? "Next" : "Validate & Update"} >
                                    <img className="procced-img" src={LeftArrow} alt="Proceed Left Icon" />
                                </Button>
                            </div>
                        </div>
                    </form>

                    {/*  Form 1 - After verify - end */}
                </section>
                <section className="cloud-img">
                    <img src={CloudRightSideImg} alt="Cloud onboarding" />
                </section>
                <MySnackbar
                    className="snack-bar"
                    message={message}
                    severity={severity}
                    open={open}
                    onClose={handleSnackbarClose}
                />
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
                        <Button className='p-button-text'>No, stay here</Button>
                        <Button className='p-button-text'>Yes, Quit</Button>
                    </div>
                </template>
            </ConfirmDialog>
        </>
    );
};

export default AuthenticationDetails;