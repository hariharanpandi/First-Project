import React, { useState } from 'react';
import CloudSummary from './CloudSummarys';
import TopBar from '../../project/TopBar';
import CloudApp from './CloudApps';
import { useSelector } from 'react-redux';
import { getQueryParam } from '../../../helper/SearchParams';

const DiscoveryPage = ({projectdata} : {projectdata:any}) => {
  const projectId = getQueryParam("projectId");
  const[breadCrumbValRoute] = useState("Discovery");
  const { projectData } = useSelector((state: any) => state.getProject);

  const { projectInfoInitData } = useSelector(
    (state: any) => state.getProjectInfoInit
  );

  return (  
       <>
          {/* <div><TopBar/></div>
          <div className='cloud-summary'><CloudSummary/></div>
          <div className='cloud-account'><CloudAccount/></div>
          <div className='cloud-app' ><CloudApp/></div> */}
          <TopBar
            currentBreadCrumbProject={
              projectData?.projectDtl?.find((val: any) => val?._id === projectId)
            }
            currentBreadCrumbRoute={breadCrumbValRoute}
            onButtonClick={""}
            onCancel={""}
            workload_name={""} />
          <div className='cloud-summary'><CloudSummary/></div>
          {/* <div className='cloud-account-list'><CloudAccount/></div> */}
       </>
  )
}

export default DiscoveryPage;