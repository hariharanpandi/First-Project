import SearchIcon from "../../assets/icons/SearchIcon";
import { InputText } from "primereact/inputtext";
import NavigateBack from "../../assets/images/backArrow.png";
import PreventSpaceAtFirst from "../../components/PrventSpaceAtFirst";
import CustomTooltip from "../../components/CustomTooltip";
import { useMemo, useState } from "react";
import ArrowRightIcon from "../../assets/icons/ArrowRightIcon";
import DraggableResourceItem from "./DraggableResourceItem";
import _ from "lodash";
import { useSelector } from "react-redux";

const SelectedCloudInstances = ({
  cloudAccount,
  selectedNode,
  handleGoBack,
  getCloudAccountNameData,
  onToggleCloudName,
  expandedAccountName,
}: {
  cloudAccount: {
    cloud_account_id: string;
    cloud_account_name: string;
    cloud_resource_grp: string;
    resource: any[];
  }[];
  selectedNode: {
    _id: string;
    image: string;
    name: string;
  };
  getCloudAccountNameData: any[];
  handleGoBack: () => void;
  onToggleCloudName: (cloud_account_id: {
    cloud_account_id: string;
    cloud_account_name: string;
    cloud_resource_grp: string;
    resource: any[];
  }) => void;
  expandedAccountName: {
    [key: string]: boolean;
  }
}) => {
  const [searchValue, setSearchValue] = useState("");
  const { workloadLoading } = useSelector((state: any) => state.getCloudAccountName);
  const memoizedCloudAccount = useMemo(() => {
    const isCloudAccountExpanded = Object?.keys(expandedAccountName)?.filter(key => expandedAccountName[key])?.[0];
    const lowerSearchTerm = searchValue?.toLowerCase()?.trim();

    if (!searchValue && !_.isNil(cloudAccount)) {
      return cloudAccount;
    }

    if (!_.isNil(isCloudAccountExpanded) && !_.isNil(cloudAccount) && !_.isNil(lowerSearchTerm)) {
      const findExpandedCloudAccount = cloudAccount?.find(({ cloud_account_id, cloud_resource_grp }) => (
        cloud_account_id === isCloudAccountExpanded && selectedNode?._id === cloud_resource_grp
      ))!;
      const filteredData = {
        ...findExpandedCloudAccount,
        resource: findExpandedCloudAccount?.resource?.filter((item) =>
          item.name.toLowerCase().includes(lowerSearchTerm)
        ),
      };
      return [filteredData];
    }

    return cloudAccount?.filter((node) => {
      const labelMatches = node?.cloud_account_name?.toLowerCase().includes(lowerSearchTerm);
      return labelMatches;
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cloudAccount, expandedAccountName, searchValue]);

  if (!selectedNode) {
    return null;
  }

  return (
    <>
      <div className="wo-resources">
        <nav className="wo-resources-nav">
          <span onClick={handleGoBack}>
            <img
              className="custom-cursor"
              src={NavigateBack}
              alt="Navigate Back"
            />
          </span>
          <CustomTooltip title={selectedNode.name} placement="top">
            <span className="prevent-text-overflow">
              {selectedNode.name}
            </span>
          </CustomTooltip>
        </nav>
        <section className="wo-resources-section">
          <div className="position-releative">
            <span className="position-search-icon">
              <SearchIcon />
            </span>
            <InputText
              value={searchValue}
              onKeyDown={(event: any) => PreventSpaceAtFirst(event)}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search"
            />
          </div>
          <div className="wo-resources-section-heading">Cloud Accounts</div>
          <div className="wo-resources-section-scroll">
            {
              !memoizedCloudAccount?.find(({ cloud_resource_grp }) => cloud_resource_grp === selectedNode?._id) &&
              memoizedCloudAccount && memoizedCloudAccount.length > 0 && getCloudAccountNameData?.length === 0 &&
              <div className="not-found">
                <div className="cursor-default title-not-found">Oops! No results found</div>
                <div className="sub-title-not-found">Try refining your search or explore other categories</div>
              </div>
            }
            {
              memoizedCloudAccount && memoizedCloudAccount.length > 0 ? (
                memoizedCloudAccount?.map((cloudAccount, index) => {
                  if (cloudAccount?.cloud_resource_grp === selectedNode?._id) {
                    return (
                      <>
                        <div className={expandedAccountName?.[cloudAccount?.cloud_account_id?.toString()] ?
                          'wo-resources-section-account wo-resources-section-selected' :
                          'wo-resources-section-account'}
                          key={cloudAccount.cloud_account_id}
                          onClick={() => onToggleCloudName(cloudAccount)
                          }>
                          <span className={expandedAccountName?.[cloudAccount?.cloud_account_id?.toString()] ?
                            'arrow-down-icon' : 'arrow-right-icon'}>
                            {<ArrowRightIcon />}
                          </span>
                          <CustomTooltip title={cloudAccount?.cloud_account_name} placement='top'>
                            <span className="wo-resources-section-account-name">
                              {cloudAccount?.cloud_account_name}
                            </span>
                          </CustomTooltip>
                        </div>
                        {
                          cloudAccount?.resource && cloudAccount?.resource?.length > 0 &&
                          expandedAccountName?.[cloudAccount?.cloud_account_id?.toString()] &&
                          (cloudAccount?.resource?.map((resource) => (
                            <DraggableResourceItem key={resource.resource_id} resource={resource} />
                          )))
                        }
                        {
                          cloudAccount?.resource && cloudAccount?.resource?.length === 0 &&
                          expandedAccountName?.[cloudAccount?.cloud_account_id?.toString()] &&
                          (
                            <div className="not-found">
                              <div className="cursor-default title-not-found">Oops! No results found</div>
                              <div className="sub-title-not-found">Try refining your search or explore other categories</div>
                            </div>
                          )
                        }
                      </>
                    )
                  }
                  return null;
                }
                )
              ) : (getCloudAccountNameData?.length === 0 || searchValue !== "" ) ? (
                <div className="not-found">
                  <div className="cursor-default title-not-found">Oops! No results found</div>
                  <div className="sub-title-not-found">Try refining your search or explore other categories</div>
                </div>
              ) : ''
            }
            {
              workloadLoading ? (<div className="applicationDisplay-loader">
                <div className={`loader-content`}></div>
              </div>) :
                !memoizedCloudAccount?.find(({ cloud_resource_grp }) => cloud_resource_grp === selectedNode?._id) &&
                _.isNil(getCloudAccountNameData) &&
                <div className="not-found">
                  <div className="cursor-default title-not-found">Oops! No results found</div>
                  <div className="sub-title-not-found">Try refining your search or explore other categories</div>
                </div>
            }
          </div>
        </section>
      </div>
    </>
  );
};

export default SelectedCloudInstances;