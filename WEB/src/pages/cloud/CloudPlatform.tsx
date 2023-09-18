import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Button } from 'primereact/button';
import CloudRightSideImg from '../../assets/images/layoutLogin.png';
import NavigateBack from '../../assets/images/backArrow.png';
import LeftArrow from '../../assets/images/left-arrow.svg';
import { CloudConstant } from '../../helper/cloud-constant/platformConstant';
import { useNavigate, useParams } from 'react-router-dom';
import { CloudConstantType } from '../../redux/@types/cloud-types/CommenCloudTypes';
import { resetAwsPersistData, setAwsPersistData } from '../../redux/slice/cloud-slice/awsPersistDataSlice';
import { resetCloudPersistData } from './ResetCloudPersistData';
import { ConfirmDialog } from 'primereact/confirmdialog';
import { resetAzurePersistData, setAzurePersistData } from '../../redux/slice/cloud-slice/azurePersistDataSlice';
import { resetGcpPersistData, setGcpPersistData } from '../../redux/slice/cloud-slice/gcpPersistDataSlice';
import { resetOciPersistData, setOciPersistData } from '../../redux/slice/cloud-slice/ociPersistDataSlice';
import { getProjectInfoRequest } from '../../redux/action/project-action/GetProjectInfoAction';
import { CustomBackdrop } from '../../helper/backDrop';

const CloudPlatForm = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { project_id, select_cloud_platform } = useParams()
    const platformCardDetails = CloudConstant.CLOUD.PLATFORM_CARD_DETAILS;
    const [selectedCardIndex, setSelectedCardIndex] = useState<number>(0);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const { projectInfoData, loading, error } = useSelector(
        (state: any) => state.getProjectInfo
    );
    const [projectName, setProjectName] = useState<string>('');
    const CloudServiceType = ['aws', 'azure'];

    const {
        _id,
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

    useEffect(() => {
        if (!project_id) {
            resetCloudPersistData(dispatch);
            navigate('/overview');
        }

        if (_id?.toString()?.trim() !== "" ||
            !CloudServiceType.includes(select_cloud_platform?.toLocaleLowerCase()!
            )) {
            navigate(`/overview?cloud-account=true&projectId=${project_id}`);
        };

        dispatch(getProjectInfoRequest(project_id!));

        const index = platformCardDetails.findIndex(
            ({ name }) => name?.toLocaleLowerCase() === select_cloud_platform?.toLocaleLowerCase()
        );
        setSelectedCardIndex(index);

        // ** empty dependency array,  React that the effect should only run once */
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (projectInfoData?.data) {
            setProjectName(projectInfoData?.data?.project_name);
        };

    }, [projectInfoData]);

    const handleCancel = () => {
        setShowConfirmDialog(false);
    };

    const handleQuit = () => {
        setShowConfirmDialog(false);
        resetCloudPersistData(dispatch);
        navigate(`/overview?cloud-account=true&projectId=${project_id}`);
    };

    //** The handleQuitOnBoarding is use to Quit and navigate to discovery page - start  */

    const handleQuitOnBoarding = () => {
        setShowConfirmDialog(true);
    }

    //** The handleQuitOnBoarding is use to Quit and navigate to discovery page - End  */

    const handleCardClick = (index: number) => {
        setSelectedCardIndex(index)
    };

    const handleSubmit = () => {
        const { constanttype, _cls, name } = platformCardDetails[selectedCardIndex];

        switch (constanttype) {
            case CloudConstantType.AWS_CL0UD_CONSTANT:
                dispatch(setAwsPersistData({
                    __cls: _cls,
                    owner: project_id,
                    constant_field: constanttype,
                    index: selectedCardIndex,
                    project_name: projectName,
                }));
                dispatch(resetAzurePersistData());
                dispatch(resetGcpPersistData());
                dispatch(resetOciPersistData());
                break;
            case CloudConstantType.AZURE_CL0UD_CONSTANT:
                dispatch(setAzurePersistData({
                    __cls: _cls,
                    owner: project_id,
                    constant_field: constanttype,
                    index: selectedCardIndex,
                    project_name: projectName,
                }));
                dispatch(resetAwsPersistData());
                dispatch(resetGcpPersistData());
                dispatch(resetOciPersistData());
                break;
            case CloudConstantType.GCP_CL0UD_CONSTANT:
                dispatch(setGcpPersistData({
                    __cls: _cls,
                    owner: project_id,
                    constant_field: constanttype,
                    index: selectedCardIndex,
                    project_name: projectName,
                }));
                dispatch(resetAwsPersistData());
                dispatch(resetAzurePersistData());
                dispatch(resetOciPersistData());
                break;
            case CloudConstantType.OCI_CL0UD_CONSTANT:
                dispatch(setOciPersistData({
                    __cls: _cls,
                    owner: project_id,
                    constant_field: constanttype,
                    index: selectedCardIndex,
                    project_name: projectName,
                }));
                dispatch(resetAwsPersistData());
                dispatch(resetAzurePersistData());
                dispatch(resetGcpPersistData())
                break;
            default:
                throw new Error('Please choose the cloud platform that you want to onboard');
        }
        navigate(`/overview/discovery/cloud-platform/${name?.toLocaleLowerCase()}/onboarding`);
    };

    if (error) {
        navigate(`/overview?cloud-account=true&projectId=${project_id}`);
    }

    return (
        <>
            <CustomBackdrop open={loading} />
            <main className='cloud'>
                <section className='cloud-contant'>
                    <nav>
                        <span onClick={handleQuitOnBoarding}>
                            <img className='custom-cursor' src={NavigateBack} alt="Navigate Back" />
                        </span>
                        <span>{projectName}</span>
                    </nav>
                    <h1>Choose cloud platform</h1>
                    <p>Please choose the cloud platform that you want to onboard</p>
                    <section className='cloud-contant-card'>
                        {
                            platformCardDetails.map((item, index) => (
                                <div
                                    key={index}
                                    className={`
                                    ${(selectedCardIndex === index && ![2, 3].includes(index)) ?
                                            'selected ' : [2, 3].includes(index) ?
                                                'cursor-pointer-not-allowed action-disabled' : ''}
                                    `}
                                    onClick={() => {
                                        if (![2, 3].includes(index)) {
                                            handleCardClick(index)
                                        }
                                    }}>
                                    <img src={item?.image} alt={item?.name} />
                                    <span>{item.name}</span>
                                </div>
                            ))
                        }
                    </section>
                    <div className='cloud-contant-btn bottom-need justify-content-btn'>
                        <div>
                            <Button onClick={handleSubmit} className="procced-btn procced" type='submit' label="Proceed" >
                                <img className="procced-img" src={LeftArrow} alt="Proceed Left Icon" />
                            </Button>
                        </div>
                    </div>
                </section>
                <section className='cloud-img'>
                    <img src={CloudRightSideImg} alt="Cloud Platform" />
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
        </>
    )
}

export default CloudPlatForm;