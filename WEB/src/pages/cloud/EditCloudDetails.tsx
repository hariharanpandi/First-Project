import { useEffect, useReducer, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getCloudAccountRequest } from "../../redux/slice/cloud-slice/GetCloudAccountSlice";
import { setAwsPersistData } from "../../redux/slice/cloud-slice/awsPersistDataSlice";
import { CloudConstant } from "../../helper/cloud-constant/platformConstant";
import { CustomBackdrop } from "../../helper/backDrop";
import { setAzurePersistData } from "../../redux/slice/cloud-slice/azurePersistDataSlice";
import NavigateBack from '../../assets/images/backArrow.png';
import { resetCloudPersistData } from "./ResetCloudPersistData";
import CloudRightSideImg from '../../assets/images/layoutLogin.png';
import EditIcon from '../../assets/images/pencil_line.svg';
import { Button } from "primereact/button";
import { getProjectInfoRequest } from "../../redux/action/project-action/GetProjectInfoAction";
import _ from "lodash";
import VisibleFeatures from "../../helper/visibleFeatures";

const initialState = {
    revealKey: {}
};

const reducer = (
    state: { revealKey: { [k: string]: boolean } },
    action: { type: string, displaylabel: string }
) => {
    switch (action.type) {
        case 'TOGGLE_REVEAL_KEY':
            return {
                ...state,
                revealKey: {
                    ...state.revealKey,
                    [action.displaylabel]: !state.revealKey[action.displaylabel],
                },
            };
        default:
            return state;
    }
}

const EditCloudDetails = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [cloudAccountView, setCloudAccountView] = useState<any[]>([]);
    const [projectName, setProjectName] = useState<string>('');
    const [state, dispatchReducer] = useReducer(reducer, initialState)
    const { projectInfoData, loading: projectLoading, error: errorError } = useSelector(
        (state: any) => state.getProjectInfo
    );
    const {
        select_cloud_platform,
        project_id,
        select_cloud_platform_id
    } = useParams();
    const platformCardDetails = CloudConstant.CLOUD.PLATFORM_CARD_DETAILS.find(
        ({ name }) => select_cloud_platform?.toLocaleLowerCase() === name?.toLocaleLowerCase()
    );

    const accessLevels = VisibleFeatures(project_id!);

    const { getCloudAccountData, postLoading: cloudAccountLoading, postError } = useSelector(
        (state: any) =>
            state.getCloudAccount);

    useEffect(() => {
        if (_.isNil(platformCardDetails) || !project_id) {
            navigate(`/overview?cloud-account=true&projectId=${project_id}`);
        }

        dispatch(getProjectInfoRequest(project_id!));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (errorError) {
        navigate(`/overview?cloud-account=true&projectId=${project_id}`);
    }

    useEffect(() => {
        if (projectInfoData?.data) {
            setProjectName(projectInfoData?.data?.project_name);
        };
    }, [projectInfoData]);


    useEffect(() => {
        if (postError) {
            navigate(`/overview?cloud-account=true&projectId=${project_id}`);
        }
    }, [navigate, postError, project_id]);

    useEffect(() => {
        if (select_cloud_platform_id && select_cloud_platform_id !== '' && platformCardDetails) {
            dispatch(getCloudAccountRequest(select_cloud_platform_id))
        }
    }, [dispatch, platformCardDetails, select_cloud_platform_id])

    useEffect(() => {
        if (getCloudAccountData && platformCardDetails) {
            switch (select_cloud_platform?.toLocaleLowerCase()) {
                case 'aws':
                    const aws = {
                        _id: getCloudAccountData?._id,
                        _cls: platformCardDetails._cls,
                        apikey: getCloudAccountData?.apikey,
                        apisecret: getCloudAccountData?.apisecret,
                        owner: getCloudAccountData?.owner,
                        account_name: getCloudAccountData?.title,
                        account_type: getCloudAccountData?.account_type,
                        access_type: getCloudAccountData?.access_type,
                        environment: getCloudAccountData?.environment,
                        authentication_protocol: getCloudAccountData?.authentication_protocol,
                        bucket_name: getCloudAccountData?.bucket_name,
                        cost_report_format_fields: getCloudAccountData?.cost_report_format_fields,
                        opted_regions: getCloudAccountData?.opted_regions,
                        project_name: projectName,
                        is_verifyed_success: true,
                        constant_field: platformCardDetails.constanttype,
                    }
                    const awsCloudAccountView = {
                        section1: [
                            {
                                displaylabel: 'Account Type',
                                displayValue: getCloudAccountData?.account_type,
                            },
                            {
                                displaylabel: 'Access Type',
                                displayValue: getCloudAccountData?.access_type,
                            },
                            {
                                displaylabel: 'Aws Environment',
                                displayValue: getCloudAccountData?.environment,
                            },
                            {
                                displaylabel: 'Authentication Protocol',
                                displayValue: getCloudAccountData?.authentication_protocol,
                            }
                        ],
                        section2: [
                            {
                                displaylabel: 'Access Key',
                                displayValue: getCloudAccountData?.apikey,
                            },
                            {
                                displaylabel: 'Secret Key',
                                displayValue: getCloudAccountData?.apisecret,
                                displaytype: 'secret'
                            },
                            {
                                displaylabel: 'Bucket Name',
                                displayValue: getCloudAccountData?.bucket_name,
                            },
                        ],
                        section3: [
                            {
                                displaylabel: 'Cost Report Format',
                                displayValue: getCloudAccountData?.cost_report_format_fields,
                            },
                        ],
                        section4: getCloudAccountData?.opted_regions,
                    }
                    setCloudAccountView([awsCloudAccountView])
                    dispatch(setAwsPersistData(aws))
                    break
                case 'azure':
                    const azure = {
                        _id: getCloudAccountData?._id,
                        key: getCloudAccountData?.key,
                        _cls: platformCardDetails?._cls,
                        secret: getCloudAccountData?.secret,
                        owner: getCloudAccountData?.owner,
                        subscription_id: getCloudAccountData?.subscription_id,
                        account_name: getCloudAccountData?.title,
                        tenant_id: getCloudAccountData?.tenant_id,
                        access_type: getCloudAccountData?.access_type,
                        environment: getCloudAccountData?.environment,
                        subscription_type: getCloudAccountData?.subscription_type,
                        project_name: projectName,
                        is_verifyed_success: true,
                        constant_field: platformCardDetails.constanttype,
                    }
                    const azureCloudAccountView = {
                        section1: [
                            {
                                displaylabel: 'Access Type',
                                displayValue: getCloudAccountData?.access_type,
                            },
                            {
                                displaylabel: 'Aws environment',
                                displayValue: getCloudAccountData?.environment,
                            },
                        ],
                        section2: [
                            {
                                displaylabel: 'Tenant ID',
                                displayValue: getCloudAccountData?.tenant_id,
                            },
                            {
                                displaylabel: 'Application ID',
                                displayValue: getCloudAccountData?.key,
                            },
                            {
                                displaylabel: 'Application Secret',
                                displayValue: getCloudAccountData?.secret,
                                displaytype: 'secret'
                            },
                        ],
                        section3: [
                            {
                                displaylabel: 'Subscriptions',
                                displayValue: getCloudAccountData?.subscription_id,
                            },
                            {
                                displaylabel: 'Subscriptions Type',
                                displayValue: getCloudAccountData?.subscription_type,
                            },
                        ],
                    }
                    setCloudAccountView([azureCloudAccountView])
                    dispatch(setAzurePersistData(azure))
                    break
                case 'gcp':
                    break
                case 'oci':
                    break
                default:
                    throw new Error(`Some think went worng in Edit Cloud Details 
                     component (EditCloudDetails.tsx) line no 49`);
            }
        }
    }, [dispatch, getCloudAccountData, platformCardDetails, projectName, select_cloud_platform]);

    //** The handleQuitOnBoarding is use to Quit and navigate to discovery page - start  */

    const handleQuitOnBoarding = () => {
        resetCloudPersistData(dispatch);
        navigate(`/overview?cloud-account=true&projectId=${getCloudAccountData?.owner}`);
    }

    //** The handleQuitOnBoarding is use to Quit and navigate to discovery page - end  */

    const handleClickEdit = () => {
        navigate(`/overview/discovery/cloud-platform/${platformCardDetails?.name}/onboarding`);
    }

    return (
        <>
            <CustomBackdrop open={cloudAccountLoading || projectLoading} />
            <main className="cloud-account-view">
                <section className="cloud-account-view-contant">
                    <nav>
                        <span onClick={handleQuitOnBoarding}>
                            <img className="custom-cursor" src={NavigateBack} alt="Navigate Back" />
                        </span>
                        <span className="title">{`${projectName} / ${getCloudAccountData?.title}`}</span>
                        {
                            accessLevels?.editDiscoveryLevelRbac &&
                            <span className="btn" onClick={handleClickEdit}>
                                <img src={EditIcon} alt="Edit Cloud Account" />
                                <Button label='Edit' type='button' />
                            </span>
                        }
                    </nav>
                    <section>
                        <h1>
                            {
                                select_cloud_platform === 'aws' ? select_cloud_platform.toLocaleUpperCase() : _.capitalize(select_cloud_platform)
                            }  onboarding details</h1>
                        {/*  Section 1 onboarding details - Start */}
                        <section className="table-content">
                            {
                                cloudAccountView[0]?.section1?.map((
                                    {
                                        displaylabel,
                                        displayValue,
                                    }: {
                                        displaylabel: string,
                                        displayValue: string,
                                    },
                                    index: number
                                ) => {
                                    return (

                                        <div key={index}>
                                            <div className="display-label">{displaylabel}</div>
                                            <div className="display-value">{displayValue}</div>
                                        </div>

                                    )
                                })
                            }
                        </section>
                        {/*  Section 1 onboarding details - End */}
                    </section>
                    <section>
                        <h1>Authentication Details</h1>
                        {/*  Section 2 Authentication details - Start */}
                        <section className="table-content">
                            {
                                cloudAccountView[0]?.section2?.map((
                                    {
                                        displaylabel,
                                        displayValue,
                                        displaytype,
                                    }: {
                                        displaylabel: string,
                                        displayValue: string,
                                        displaytype: string,
                                    },
                                    index: number
                                ) => {
                                    const revealKey: boolean = state.revealKey[displaylabel]
                                    return (

                                        <div key={index}>
                                            <div className="display-label">{displaylabel}</div>
                                            <div className="display-value reveal">
                                                {
                                                    displaytype !== 'secret' && (<span>{displayValue}</span>)
                                                }
                                                {
                                                    revealKey && displaytype === 'secret' && (
                                                        <>
                                                            <span>{displayValue}</span>
                                                            <span className="reveal-action" onClick={
                                                                () => dispatchReducer({ type: 'TOGGLE_REVEAL_KEY', displaylabel })
                                                            }>Hide key</span>
                                                        </>
                                                    )
                                                }
                                                {
                                                    !revealKey && displaytype === 'secret' && (
                                                        <>
                                                            <span>
                                                                {
                                                                    new Array(displayValue?.length).fill('.').join('')
                                                                }
                                                            </span>
                                                            <span className="reveal-action" onClick={
                                                                () => dispatchReducer({ type: 'TOGGLE_REVEAL_KEY', displaylabel })
                                                            }>Reveal key</span>
                                                        </>
                                                    )
                                                }
                                            </div>
                                        </div>

                                    )
                                })
                            }
                        </section>
                        {/*  Section 2 Authentication Details - End */}
                    </section>
                    {select_cloud_platform?.toLocaleLowerCase() === 'aws' &&
                        <>
                            <section>
                                <h1>Cost Report Format</h1>
                                {/*  Section 3 Cost report format - Start */}
                                <section className="table-content">
                                    {
                                        cloudAccountView[0]?.section3?.map((
                                            {
                                                displaylabel,
                                                displayValue,
                                            }: {
                                                displaylabel: string,
                                                displayValue: string,
                                            },
                                            index: number
                                        ) => {
                                            return (

                                                <div key={index}>
                                                    <div className="display-label">{displaylabel}</div>
                                                    <div className="display-value">{displayValue}</div>
                                                </div>

                                            )
                                        })
                                    }
                                </section>
                                {/*  Section 3 Cost report format - End */}
                            </section>
                            <section className="gap-zero">
                                <h1>Region and Scope</h1>
                                <h2>Region</h2>
                                {/*  Section 4 Region and scope - Start */}
                                <section className="table-content region-type">
                                    {
                                        cloudAccountView[0]?.section4?.map((
                                            item: string,
                                            index: number
                                        ) => {
                                            return (

                                                <div key={index}>
                                                    <div className="display-label">{item}</div>
                                                </div>

                                            )
                                        })
                                    }
                                </section>
                                {/*  Section 4 Region and Scope - End */}
                            </section>
                        </>
                    }
                    {select_cloud_platform?.toLocaleLowerCase() === 'azure' &&
                        <>
                            <section>
                                <h1>Subscriptions</h1>
                                {/*  Section 3 Subscriptions - Start */}
                                <section className="table-content">
                                    {
                                        cloudAccountView[0]?.section3?.map((
                                            {
                                                displaylabel,
                                                displayValue,
                                            }: {
                                                displaylabel: string,
                                                displayValue: string,
                                            },
                                            index: number
                                        ) => {
                                            return (

                                                <div key={index}>
                                                    <div className="display-label">{displaylabel}</div>
                                                    <div className="display-value">{displayValue}</div>
                                                </div>

                                            )
                                        })
                                    }
                                </section>
                                {/*  Section 3 Subscriptions - End */}
                            </section>
                        </>
                    }
                </section>
                <section className="cloud-account-view-img">
                    <img src={CloudRightSideImg} alt="Cloud onboarding" />
                </section>
            </main>
        </>
    )
}

export default EditCloudDetails;