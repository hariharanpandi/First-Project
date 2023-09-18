import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { TabView, TabPanel } from "primereact/tabview";
import { getCloudPlatformRequest } from "../../redux/slice/workload-slice/getCloudPlatformSlice";
import { CustomBackdrop } from "../../helper/backDrop";
import ListCloudInstances from "./ListCloudInstances";
import SelectedCloudInstances from "./SelectedCloudInstances";
import { InputText } from "primereact/inputtext";
import PreventSpaceAtFirst from "../../components/PrventSpaceAtFirst";
import SearchIcon from "../../assets/icons/SearchIcon";
import { getCloudCategoryRequest } from "../../redux/slice/workload-slice/getCloudCategorySlice";
import { getCloudResourceGroupRequest } from "../../redux/slice/workload-slice/getCloudResourceGroupSlice";
import Network from "react-vis-network-graph";
import { getQueryParam } from "../../helper/SearchParams";
import { createMapRequest } from "../../redux/action/workload-action/createMapAction";
import MySnackbar from "../../helper/SnackBar";
import { createMapReset } from "../../redux/slice/workload-slice/createMapSaga";
import { editMapReset } from "../../redux/slice/workload-slice/editMapSlice";
import { EmptyCanvas } from "./EmptyCanvas";
import TopBar from "../project/TopBar";
import { useNavigate } from "react-router-dom";
import { editMapRequest } from "../../redux/action/workload-action/editMapAction";
import {
  viewWorkloadRequest,
  viewWorkloadReset,
} from "../../redux/slice/workload-slice/viewWorkloadSlice";
import "../../styles/workload-styles/WorkloadViewPage.css";
import WorkloadIconDark from "../../assets/icons/WorkloadIconDark";
import PriceTagIcon from "../../assets/icons/PriceTagIcon";
import { useDrop } from "react-dnd";
import { getWorkloadInfoRequest } from "../../redux/action/workload-action/getWorkloadInfoAction";
import WorkloadInfoPanel from "./WorkloadInfoPanel";
import PriceTagCoverIcon from "../../assets/icons/PriceTagCoverIcon";
import { DateRangePicker, Calendar } from "react-date-range";
import _, { debounce } from "lodash";
import moment from "moment";
import AddLinkIcon from "../../assets/icons/AddLinkIcon";
import WorkloadCancelIcon from "../../assets/icons/WorkloadCancelIcon";
import WorkloadInfoIcon from "../../assets/icons/WorkloadInfoIcon";
import "react-date-range/dist/styles.css"; // Import the styles
import "react-date-range/dist/theme/default.css";
import {
  addDays,
  isAfter,
  subDays,
  differenceInDays,
  endOfDay,
} from "date-fns";
import CuraWhiteIcon from "../../assets/icons/CuraWhiteIcon";
import SecurityIcon from "../../assets/icons/SecurityIcon";
import SreIcon from "../../assets/icons/SreIcon";
import {
  getCloudAccountNameRequest,
  getCloudAccountNameReset,
} from "../../redux/slice/workload-slice/getCloudAccountNameSlice";
import { getCloudResourceRequest } from "../../redux/slice/workload-slice/getCloudResourceSlice";
import CalendarIcon from "../../assets/icons/CalendarIcon";
import { ConfirmDialog } from "primereact/confirmdialog";
import { Button } from "primereact/button";
import { PriceTaggerNoResponse } from "./PriceTaggerNoResponse";
import ConfirmLeaving from "../../components/ConfirmLeaving";

interface TreeNodeData {
  cloud_platform_type: string;
  cloudcategory: {
    cloud_category: string;
    cloud_platform_type: string;
    _id: string;
    cloudresourcegroup: {
      _id: string;
      image: string;
      name: string;
    }[];
  }[];
}

interface ExpandedNodes {
  [key: string]: boolean;
}

interface ExpandedCloadAccountName {
  [key: string]: boolean;
}

interface CloudAccount {
  cloud_account_id: string;
  cloud_account_name: string;
  cloud_resource_grp: string;
  resource: any[];
}

const WorkloadSideBar = () => {
  const dispatch = useDispatch();
  const initialLoading = useRef(true);
  const navigate = useNavigate();

  const { getCloudPlatformData, getLoading: loadingPlatform } = useSelector(
    (state: any) => state.getCloudPlatform
  );

  const { getCloudCategoryData, getLoading: loadingCategory } = useSelector(
    (state: any) => state.getCloudCategory
  );

  const { getCloudResourceGroupData, getLoading: loadingResourceGroup } =
    useSelector((state: any) => state.getCloudResourceGroup);

  const { getCloudAccountNameData, workloadLoading: cloudAccountLoading } =
    useSelector((state: any) => state.getCloudAccountName);

  const { getCloudResourceData, getLoading: loadingResource } = useSelector(
    (state: any) => state.getCloudResource
  );
  const [isNewResourceDrag,setIsNewResourceDrag]= useState(false)

  const [cloudAccount, setCloudAccount] = useState<CloudAccount[]>([]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [searchValue, setSearchValue] = useState("");
  const [nodes, setNodes] = useState<TreeNodeData[]>([
    {
      cloud_platform_type: "",
      cloudcategory: [],
    },
  ]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [infoNode, setInfoNode] = useState<any>("");
  const [nodeState, setNodeState] = useState<boolean>(false);
  const [edgeState, setEdgeState] = useState(false);
  const handleToggleDrawer = (open: boolean) => (): void => {
    setIsDrawerOpen(open);
  };
  const [isSelected, setIsSelected] = useState(true);
  const [selectedNode, setSelectedNode] = useState<{
    _id: string;
    image: string;
    name: string;
  }>({
    _id: "",
    image: "",
    name: "",
  });
  const [expandedNodes, setExpandedNodes] = useState<ExpandedNodes>({});
  const [expandedAccountName, setExpandedAccountName] = useState<any>({});
  const [resourceKey, setResourceKey] = useState(0);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [resourceDragStart, setResourceDragStart] = useState<boolean>(false);

  /*Workload Mapping*/

  const [resource, setResource] = useState<any>({ nodes: [], edges: [] });
  const [resourceDraged, setResourceDraged] = useState<any>(null);
  const [severity, setSeverity] = useState("");
  const [message, setMessage] = useState("");
  const [snackOpen, setSnackOpen] = useState(false);
  const { createMaptype, createMapError, createMapLoading } = useSelector(
    (state: any) => state.createMap
  );
  const [storedVal, setStoringVal] = useState("");
  const { editMaptype, editMapError, editMapLoading } = useSelector(
    (state: any) => state.editMap
  );
  const { appListData } = useSelector((state: any) => state.appList);

  const graphRef = useRef<any>(null);
  const [graphRefValue, setGraphRefValue] = useState(graphRef?.current);
  useEffect(() => {
    setGraphRefValue(graphRef.current);
  }, [graphRef.current]);

  const [priceTagdate, setPriceTagDate] = useState([]);

  const dateRangePickerStyles = {
    position: "absolute",
    top: "100px", // Change this value to adjust the top position
    left: "50%", // Change this value to adjust the left position
    transform: "translateX(-50%)", // Center the component horizontally
    zIndex: 1000, // Change this value if you want to adjust the stacking order
  };

  const [priceTagger, setPriceTagger] = useState<boolean>(false);
  const [editRemovedResource, setEditRemovedResource] = useState<any[]>([]);
  const [initialResourceNode, setInitialResourceNode] = useState<string[]>([]);
  const [initialResourceEdges, setInitialResourceEdges] = useState<string[]>([]);
  const projectId = getQueryParam("projectId");
  const appId = getQueryParam("app_id");
  const workload: any = getQueryParam("workload");
  const workloadId = getQueryParam("workloadId");
  const view = getQueryParam("view");
  const [isResource, setIsResource] = useState<boolean>(false);
  const { projectData } = useSelector((state: any) => state.getProject);

  const { appData } = useSelector((state: any) => state.GetApp);

  const edit: string = getQueryParam("edit")!;
  const create: string = getQueryParam("create")!;

  const {
    viewWorkloadData,
    workloadLoading,
    workloadError: viewWorkloadError,
  } = useSelector((state: any) => state.viewWorkload);

  const { getWorkloadPriceTagger } = useSelector(
    (state: any) => state.getWorkloadPriceTagger
  );

  useEffect(() => {
    let currentResourceNode: string[] | null = null;
    let currentResourceEdges: string[] | null = null;
    if (resource?.nodes?.length > 0) {
      currentResourceNode = resource?.nodes?.map(({
        resource_id, resource_group_id, x
      }: Record<string, string>) => `${resource_id}-${resource_group_id}-${x ?? 'new'}`)
    };

    if (resource?.edges?.length > 0) {
      currentResourceEdges = resource?.edges?.map(({
        id
      }: Record<string, string>) => `${id}`)
    }

    if ((_.keys(graphRef?.current?.Network?.body?.nodes)?.length > 0 && create) ||
      (((!_.isEqual(initialResourceNode?.sort(), currentResourceNode?.sort()) ||
        !_.isEqual(initialResourceEdges?.sort(), currentResourceEdges?.sort())
      ) || resourceDragStart )&& edit)) {
      localStorage.setItem('is_resource', JSON.stringify(true));
    } else {
      localStorage.setItem('is_resource', JSON.stringify(false));
    }
  })

  useEffect(() => {
    if (JSON.parse(localStorage.getItem('is_resource')!)) {
      const unloadCallback = (event: any) => {
        event.preventDefault();
        event.returnValue = "";
        return "";
      };
      window.addEventListener("beforeunload", unloadCallback);
      return () => window.removeEventListener("beforeunload", unloadCallback);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  });

  /*zooom limit*/

  useEffect(() => {
    setResource({ nodes: [], edges: [] });
  }, [storedVal]);
  useEffect(() => {
    // Update the key whenever the resource state is updated
    setResourceKey((prevKey) => prevKey + 1);
  }, [resource]);

  useEffect(() => {
    if (
      viewWorkloadData?.nodes &&
      viewWorkloadData?.edges &&
      storedVal !== "yes"
    ) {
      if (viewWorkloadData?.nodes?.length > 0) {
        setInitialResourceNode(
          viewWorkloadData?.nodes?.map(({
            resource_id, resource_group_id, x
          }: Record<string, string>) => `${resource_id}-${resource_group_id}-${x}`)
        )
      }
      if (viewWorkloadData?.edges?.length > 0) {
        setInitialResourceEdges(
          viewWorkloadData?.edges?.map(({
           id
          }: Record<string, string>) => `${id}`)
        )
      }
      setResource({
        nodes: viewWorkloadData?.nodes?.map((node: any) => ({
          ...node,
          shape: "image",
          size: 30,
          isedit: true,
          title: node?.id,
        })),
        edges: viewWorkloadData?.edges,
      });
    } else if (storedVal === "yes") {
      setResource({
        nodes: viewWorkloadData?.nodes?.map((node: any) => ({
          ...node,
          shape: "image",
          size: 30,
          title: node?.id,
        })),
        edges: viewWorkloadData?.edges,
      });
    }
  }, [viewWorkloadData]);

  useEffect(() => {
    setResource({ nodes: [], edges: [] });
  }, []);

  useEffect(() => {
    setStoringVal("no");
    const payload = {
      workloadId,
      select: "workload",
    };

    if (view || edit) {
      dispatch(viewWorkloadRequest(payload));
    }
  }, [view, edit]);

  useEffect(() => {
    dispatch(viewWorkloadReset());
    dispatch(editMapReset());
    setResource({ nodes: [], edges: [] });
  }, []);

  useEffect(() => {
    if (createMaptype) {
      setMessage(createMaptype);
      setSeverity("success");
      setSnackOpen(true);
      setTimeout(() => {
        navigate(
          `/overview?application-landing=true&app_id=${appId}&projectId=${projectId}`
        );
      }, 2000);
    } else if (createMapError) {
      setMessage(createMapError);
      setSeverity("error");
      setSnackOpen(true);
    } else if (viewWorkloadError && storedVal === "yes") {
      setMessage(viewWorkloadError);
      setSeverity("error");
      setSnackOpen(true);
    }
    return () => {
      dispatch(createMapReset());
    };
  }, [createMaptype, createMapError, viewWorkloadError]);
  useEffect(() => {
    if (editMaptype) {
      setMessage(editMaptype);
      setSeverity("success");
      setSnackOpen(true);
      setTimeout(() => {
        navigate(
          `/overview?application-landing=true&app_id=${appId}&projectId=${projectId}`
        );
      }, 2000);
    } else if (editMapError) {
      setMessage(editMapError);
      setSeverity("error");
      setSnackOpen(true);
    }
    return () => {
      dispatch(editMapReset());
    };
  }, [editMaptype, editMapError]);

  useEffect(() => {
    if (getCloudAccountNameData) {
      setCloudAccount((prevstate) => [
        ...prevstate,
        ...getCloudAccountNameData,
      ]);
    }
  }, [getCloudAccountNameData]);

  const handleSnackbarClose = () => {
    setSnackOpen(false);
  };
  let disRef = graphRef?.current?.Network?.body?.nodes;
  let nodesArray: any = [];
  let isNodeDisabled: any = [];
  if (disRef) {
    nodesArray = Object?.values(disRef)?.map((node: any) => ({
      id: node.id,
    }));
    isNodeDisabled = nodesArray.some((n: any) => n.id === nodesArray.id);
  }

  const [{ canDrop, isOver }, drop] = useDrop(() => ({
    accept: "woResourceToNetworkGraph",
    drop(item: Record<string, any>) {
      const { resource } = item;
      const dragedItem = {
        ...resource,
        ismapped: true,
      };
      setIsNewResourceDrag(true);
      handleDragNode(dragedItem);
      setResourceDraged(dragedItem);
     
    },
    collect: (monitor: any) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));

  const fetchCloudPlatformData = useCallback(() => {
    const formRequest = {
      queryparams: `project_id=${projectId}`,
    };
    dispatch(getCloudPlatformRequest(formRequest));
  }, [dispatch, projectId]);

  useEffect(() => {
    if (initialLoading.current) {
      initialLoading.current = false;
      fetchCloudPlatformData();
    }
  }, [fetchCloudPlatformData]);

  useEffect(() => {
    let initialCloudPlatform;
    if (create) {
      initialCloudPlatform = getCloudPlatformData?.[0];
    }

    if (
      !create &&
      viewWorkloadData?.cloud_platform &&
      getCloudPlatformData?.length > 0
    ) {
      initialCloudPlatform = viewWorkloadData?.cloud_platform;
      setActiveIndex(
        getCloudPlatformData
          ?.map((item: string) => item?.toLocaleLowerCase())
          ?.indexOf(viewWorkloadData?.cloud_platform)
      );
    }

    if (
      getCloudPlatformData &&
      getCloudPlatformData.length > 0 &&
      initialCloudPlatform
    ) {
      const formRequest = {
        queryparams: `cloud_platform=${initialCloudPlatform?.toLowerCase()}`,
      };
      dispatch(getCloudCategoryRequest(formRequest));
    }
  }, [
    create,
    dispatch,
    getCloudPlatformData,
    viewWorkloadData?.cloud_platform,
  ]);

  const onHandleTabChange = useCallback(
    (event: { index: number }) => {
      setActiveIndex(+event.index);
      const getCloudCategory = getCloudPlatformData[+event.index];
      const formRequest = {
        queryparams: `cloud_platform=${getCloudCategory?.toLowerCase()}`,
      };
      if (event.index !== activeIndex) {
        dispatch(getCloudCategoryRequest(formRequest));
        setNodes([]);
        setExpandedNodes({});
        setCloudAccount([]);
        setExpandedAccountName({});
      }
    },
    [activeIndex, dispatch, getCloudPlatformData]
  );

  useEffect(() => {
    if (selectedNode && selectedNode?._id) {
      const formRequest = {
        queryparams: `project_id=${projectId}&cloud_resource_grp=${selectedNode?._id}`,
      };
      const findExistingCloudAccount = cloudAccount?.find(
        (account) => account?.cloud_resource_grp === selectedNode._id
      );
      if (!findExistingCloudAccount) {
        dispatch(getCloudAccountNameRequest(formRequest));
      }
    }

    return () => {
      dispatch(getCloudAccountNameReset());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, selectedNode]);

  const handleQuit = () => {
    setShowConfirmDialog(false);
  };

  useEffect(() => {
    if (getCloudCategoryData) {
      const filteredData = getCloudCategoryData?.filter(
        (obj: { cloud_platform_type: string }) => obj.cloud_platform_type !== ""
      );

      const groupedData = filteredData?.reduce(
        (
          acc: {
            cloud_platform_type: string;
            cloudcategory: any[];
          }[],
          obj: {
            cloud_platform_type: string;
          }
        ) => {
          const platformType = obj?.cloud_platform_type?.toLowerCase();
          const existingCategory = acc?.find(
            (item) => item?.cloud_platform_type === platformType
          );

          if (existingCategory) {
            existingCategory?.cloudcategory?.push(obj);
          } else {
            acc.push({
              cloud_platform_type: platformType,
              cloudcategory: [obj],
            });
          }

          return acc;
        },
        []
      );

      setNodes((prevState) => {
        return [...prevState, ...groupedData]?.filter(
          (obj: { cloud_platform_type: string }) =>
            obj?.cloud_platform_type !== ""
        );
      });
    }
  }, [getCloudCategoryData]);

  const handleNodeSelection = (node: {
    _id: string;
    image: string;
    name: string;
  }) => {
    setSelectedNode(node);
    setIsSelected(false);
    setExpandedAccountName((prevState: any) => {
      const updatedExpandedAccountName = {
        ...prevState,
      };
      Object.keys(updatedExpandedAccountName).forEach((expandedKey) => {
        if (updatedExpandedAccountName[expandedKey] !== undefined) {
          updatedExpandedAccountName[expandedKey] = undefined;
        }
      });
      return updatedExpandedAccountName;
    });
  };

  const handleGoBack = () => {
    setIsSelected(true);
    dispatch(getCloudAccountNameReset())
  };

  const handleDragNode = (node: any) => {
    console.log(node,"node");


    setResource((prevResource: any) => {
    
      const existingNodeIndex = prevResource.nodes.findIndex(
        (n: any) => n.id === node.id
      );

      if (existingNodeIndex !== -1) {
        // If the node already exists, update it
        const updatedNodes = [...prevResource.nodes];
        updatedNodes[existingNodeIndex] = {
          ...updatedNodes[existingNodeIndex],
          ismapped: node?.ismapped,
          isshared: node?.isshared,
          // Update the properties you want to change here
          isDisabled: false, // Initially, the node is enabled
        };

        return {
          ...prevResource,
          nodes: updatedNodes,
        };
      } else {
        // If the node doesn't exist, add the new node
    
        return {
          
          ...prevResource,
          nodes: [
            ...prevResource.nodes,
            {
              id: `${node.resource_id}-${node.resource_group_id}`,
              name: node.id,
              label:node?.label,
              ...(node?.label?.length > 15 && {
                label: `${node?.label?.slice(0, 15)}...`
              }),
              ...(node?.label?.length < 15 && {
                label: node?.label
              }),
              title: node.label,
              ismapped: node.ismapped,
              isshared: node.isshared,
              resource_id: node.resource_id,
              resource_group_id: node.resource_group_id,
              shape: "image",
              image: node.image,
              size: 30,
              cid: node.cid,
              lookup_collection: node.lookup_collection,
              isDisabled: false, // Initially, the node is enabled
            },
          ],
          
         
        };
      
      }
    });
  };

  const handleToggle = ({
    _id,
    cloud_platform_type,
  }: {
    _id: { toString: () => string };
    cloud_platform_type: string;
  }) => {
    if (_id) {
      setExpandedNodes((prevState) => {
        const updatedExpandedNodes = {
          ...prevState,
          [_id?.toString()]: !prevState[_id?.toString()],
        };

        if (updatedExpandedNodes[_id?.toString()]) {
          Object.keys(updatedExpandedNodes).forEach((expandedKey) => {
            if (expandedKey !== _id?.toString()) {
              updatedExpandedNodes[expandedKey] = false;
            }
          });
        }

        return updatedExpandedNodes;
      });

      const findPlatformExits = nodes.find(
        (item) =>
          item?.cloud_platform_type?.toLowerCase() ===
          cloud_platform_type?.toLowerCase()
      )?.cloudcategory;
      const isExistResourceGroup = findPlatformExits?.find(
        (item) => item?._id === _id
      )?.cloudresourcegroup;
      if (!isExistResourceGroup) {
        const formRequest = {
          queryparams: `cloud_category_id=${_id}`,
        };

        dispatch(getCloudResourceGroupRequest(formRequest));
      }
    }
    setEdgeState(false);
  };

  const onToggleCloudName = useCallback(
    (cloud: CloudAccount) => {
      if (selectedNode && cloud) {
        const createUrl = `resource_grp_id=${cloud?.cloud_resource_grp}&type=create&project_id=${projectId}&cloud_account=${cloud?.cloud_account_id}`;
        const viewUrl = `resource_grp_id=${cloud?.cloud_resource_grp}&type=edit&project_id=${projectId}&cloud_account=${cloud?.cloud_account_id}&workload_id=${workloadId}`;
        const formRequest = {
          queryparams: create ? createUrl : viewUrl,
        };

        if (!cloud?.resource) {
          dispatch(getCloudResourceRequest(formRequest));
        }

        setExpandedAccountName((prevState: any) => {
          const updatedExpandedAccountName = {
            ...prevState,
            [cloud?.cloud_account_id?.toString()]: {
              cloud_account_id: cloud?.cloud_account_id,
              cloud_resource_grp: cloud?.cloud_resource_grp,
            },
          };

          if (prevState[cloud?.cloud_account_id?.toString()]) {
            updatedExpandedAccountName[cloud?.cloud_account_id?.toString()] =
              undefined;
          }

          if (updatedExpandedAccountName[cloud?.cloud_account_id?.toString()]) {
            Object.keys(updatedExpandedAccountName).forEach((expandedKey) => {
              if (
                expandedKey !== cloud?.cloud_account_id?.toString() &&
                updatedExpandedAccountName[cloud?.cloud_account_id?.toString()]
                  ?.cloud_resource_grp === cloud?.cloud_resource_grp
              ) {
                updatedExpandedAccountName[expandedKey] = undefined;
              }
            });
          }

          return updatedExpandedAccountName;
        });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [create, dispatch, edit, projectId, selectedNode, workloadId]
  );

  useEffect(() => {
    if (getCloudResourceData) {
      setCloudAccount((prestate: CloudAccount[]) => {
        const updatedAccounts = prestate
          .map((account) => {
            if (
              account?.cloud_account_id ===
                getCloudResourceData?.cloud_account &&
              getCloudResourceData?.cloud_resource_grp ===
                account?.cloud_resource_grp
            ) {
              if (create) {
                return {
                  cloud_account_id: account?.cloud_account_id,
                  cloud_account_name: account?.cloud_account_name,
                  cloud_resource_grp: account?.cloud_resource_grp,
                  resource: getCloudResourceData?.finalResponse,
                };
              } else {
                return {
                  cloud_account_id: account?.cloud_account_id,
                  cloud_account_name: account?.cloud_account_name,
                  cloud_resource_grp: account?.cloud_resource_grp,
                  resource: getCloudResourceData?.finalResponse.map(
                    (resource: Record<string, any>) => {
                      const findInitialResourceRemoved =
                        editRemovedResource?.find(
                          (initialRemoved) =>
                            initialRemoved?.id === resource?.id &&
                            initialRemoved?.resource_group_id ===
                              resource?.resource_group_id &&
                            initialRemoved?.resource_id ===
                              resource?.resource_id
                        );

                      if (findInitialResourceRemoved) {
                        return {
                          ...resource,
                          ...findInitialResourceRemoved,
                        };
                      } else {
                        return resource;
                      }
                    }
                  ),
                };
              }
            } else {
              return account;
            }
          })
          .filter(Boolean) as CloudAccount[];

        return updatedAccounts;
      });
    }
  }, [getCloudResourceData]);

  const memoizedNodes = useMemo(() => {
    const getCurrentPlatform = getCloudPlatformData?.[activeIndex];
    const findCurrentTabDetails = nodes.find(
      ({ cloud_platform_type }) =>
        cloud_platform_type?.toLowerCase() === getCurrentPlatform?.toLowerCase()
    );

    const isExpanded = Object?.keys(expandedNodes)?.filter(
      (key) => expandedNodes[key] === true
    )?.[0];
    const lowerSearchTerm = searchValue?.toLowerCase()?.trim();

    if (!searchValue && findCurrentTabDetails) {
      return findCurrentTabDetails.cloudcategory;
    }

    if (
      !_.isNil(isExpanded) &&
      !_.isNil(findCurrentTabDetails) &&
      !_.isNil(lowerSearchTerm)
    ) {
      const findExpandedCategory = findCurrentTabDetails?.cloudcategory?.find(
        ({ _id }) => _id === isExpanded
      )!;
      const filteredData = {
        ...findExpandedCategory,
        cloudresourcegroup: findExpandedCategory?.cloudresourcegroup?.filter(
          (item) => item.name.toLowerCase().includes(lowerSearchTerm)
        ),
      };

      return [filteredData];
    }

    if (findCurrentTabDetails && !_.isNil(lowerSearchTerm)) {
      return findCurrentTabDetails.cloudcategory.filter((node) => {
        const labelMatches = node?.cloud_category
          ?.toLowerCase()
          .trim()
          .includes(lowerSearchTerm);
        return labelMatches;
      });
    }
  }, [activeIndex, expandedNodes, getCloudPlatformData, nodes, searchValue]);

  const selectedInstancesComponent = useMemo(
    () =>
      !isSelected ? (
        <SelectedCloudInstances
          selectedNode={selectedNode}
          cloudAccount={cloudAccount}
          handleGoBack={handleGoBack}
          getCloudAccountNameData={getCloudAccountNameData}
          onToggleCloudName={onToggleCloudName}
          expandedAccountName={expandedAccountName}
        />
      ) : null,
    [
      cloudAccount,
      expandedAccountName,
      isSelected,
      onToggleCloudName,
      selectedNode,
    ]
  );

  useEffect(() => {
    if (getCloudResourceGroupData) {
      setNodes((prevState) => {
        const updatedNodes = [...prevState];

        const getCurrentPlatform = getCloudPlatformData?.[activeIndex];
        const findCurrentTabDetails = updatedNodes.find(
          ({ cloud_platform_type }) =>
            cloud_platform_type?.toLowerCase() ===
            getCurrentPlatform?.toLowerCase()
        );

        if (findCurrentTabDetails) {
          const updatedCategories = findCurrentTabDetails.cloudcategory.map(
            (category) => {
              if (
                category._id === getCloudResourceGroupData.cloud_catrgory_id
              ) {
                return {
                  ...category,
                  cloudresourcegroup: getCloudResourceGroupData.finalResponse,
                };
              }
              return category;
            }
          );

          const updatedTabs = updatedNodes.map((node) => {
            if (
              node.cloud_platform_type?.toLowerCase() ===
              getCurrentPlatform?.toLowerCase()
            ) {
              return {
                ...node,
                cloudcategory: updatedCategories,
              };
            }
            return node;
          });

          return updatedTabs;
        }

        return updatedNodes;
      });
    }
  }, [getCloudResourceGroupData, getCloudPlatformData, activeIndex]);

  const handleFetch = () => {
    // Assuming nodes is an object with dynamic keys
    const nodes = graphRef?.current?.Network?.body?.nodes;
    const edges = graphRef?.current?.Network?.body?.edges;


    let nodesArray: any[] = [];
    let edgesArray: any[] = [];

    if (nodes) {
      nodesArray = Object?.values(nodes)?.map((node: any) => ({
        id: node.id,
        resource_id: node?.options?.resource_id,
        resource_group_id: node?.options?.resource_group_id,
        label: node?.options?.label,
        name: node.id,
        shape: "image",
        image: node?.options?.image,
        size: 30,
        cid: node?.options?.cid,
        lookup_collection: node?.options?.lookup_collection,
        x: node?.x,
        y: node?.y,
      }));
    }
   
    if (edges) {
      edgesArray = Object?.values(edges)?.map((edge: any) => ({
        id: edge.id,
        from: edge.fromId,
        to: edge.toId,
        resource_from: nodesArray?.find((node) => node.id === edge.fromId)
          ?.resource_id,
        resource_to: nodesArray?.find((node) => node.id === edge.toId)
          ?.resource_id,
      }));
    }
    const resourceObj: any = {
      project_id: projectId,
      app_id: appId,
      workload_name: workload,
      nodes: nodesArray,
      edges: edgesArray,
      cloud_platform: getCloudPlatformData?.[activeIndex]?.toLocaleLowerCase(),
    };
    const editResourceObj: any = {
      workload_id: workloadId,
      project_id: projectId,
      app_id: appId,
      workload_name: workload,
      nodes: nodesArray,
      edges: edgesArray,
      cloud_platform: getCloudPlatformData?.[activeIndex]?.toLocaleLowerCase(),
    };

    {
      edit
        ? dispatch(editMapRequest(editResourceObj))
        : dispatch(createMapRequest(resourceObj));
    }
    
    // Similarly, you can do the same for edges if they have dynamic keys.
  };
  const handleCancel = (): void => {
    if (JSON.parse(localStorage.getItem('is_resource')!)) {
      setIsResource(true);
    } else {
      navigate(
        `/overview?application-landing=true&app_id=${appId}&projectId=${projectId}`
      );
    }
  };

  const stayOnWorkloadScreen = (): void => {
    localStorage.setItem('is_resource', JSON.stringify(false));
    handleCancel();
  };

  const leaveWorkloadScreen = (): void => {
    setIsResource(false);
  };

  const handleWorkloadInfo = () => {
    const workloadInfoReqPayload = {
      resource_id: infoNode?.resource_id,
      resource_group_id: infoNode?.resource_group_id,
      workload_id: workloadId,
      cloud_id:infoNode?.cid,
    };

    setIsDrawerOpen(true);
    dispatch(getWorkloadInfoRequest(workloadInfoReqPayload));
    setNodeState(false);
    setEdgeState(false);
  };

  const options = {
    autoResize: true, //Avoid Scratches
    physics: {
      enabled: false,
      stabilization: {
        enabled: true,
        iterations: 1000, // Adjust the number of iterations as needed
      }, // Enable physics simulation
      // barnesHut: {
      //   enabled: true, // Use Barnes-Hut algorithm for repulsion
      //   theta: 0.5, // Barnes-Hut approximation accuracy
      //   centralGravity: 0.1, // Gravity attraction toward the center
      //   gravitationalConstant: -2000, // Strength of the gravitational force
      //   springConstant: 0.04, // Strength of springs between nodes
      //   springLength: 100, // Ideal length of springs between nodes
      //   damping: 0.09, // Damping factor for stabilization
      // },
      repulsion: {
        centralGravity: 0.05, // Gravity attraction toward the center
        nodeDistance: 100, // Minimum distance between nodes before repulsion starts
        springConstant: 0.02, // Strength of springs between nodes
        springLength: 200, // Ideal length of springs between nodes
        damping: 0.1, // Damping factor for stabilization
      },
      // hierarchical: {
      //   enabled: true, // Enable hierarchical layout
      //   levelSeparation: 200, // Vertical distance between levels
      //   nodeSpacing: 400, // Horizontal distance between nodes
      //   //treeSpacing: 300, // Distance between trees
      //   blockShifting: true, // Allow block shifting to reduce overlap
      //   edgeMinimization: true, // Reduce edge crossings within blocks
      //   parentCentralization: true, // Center parents over their children
      // },
      // maxVelocity: 5, // Maximum allowed velocity for node movement
      // minVelocity: 0.1, // Minimum allowed velocity for node movement
      // solver: 'barnesHut', // Use Barnes-Hut solver
      timestep: 1.5, // Simulation time step
    },
    interaction: {
      selectable: true,
      hover: true,
      navigationButtons: true,
    },

    manipulation: {
      enabled: true,
      initiallyActive: true,
      addNode: false,
      // addEdge: true,
      /*  Adding new node to the graph */
      // addNode: (data) => {
      //   data.id = newId;
      //   data.image = newImage;
      //   data.label = newLabel;
      //   data.size = imgsize;
      //   data.title = newTitle;
      //   data.shape = "image";
      //   // if (typeof callback === "function") {
      //   // callback(data); // }
      //   // callback(data);
      //   setId("");
      //   setLabel("");
      //   setTitle("");
      //   setImage("");
      //   setImgsize("");
      // },
      // addEdge: true,
     // editNode: undefined,
      editEdge: true,
      // deleteNode: true,
      deleteEdge: true,
      // shapeProperties: {
      //   borderDashes: false,
      //   useImageSize: false,
      //   useBorderWithImage: false,
      // },
      controlNodeStyle: {
        shape: "box",
        color: "white",
        shapeProperties: {
          useBorderWithImage: true,
          borderRadius: 102, // Adjust the value to change the border radius
        },
        //radius: 5,
        // size: 5,
        // color: {
        //   background: "white",
        //   border: "white",
        //   highlight: {
        //     background: "white",
        //     border: "white",
        //   },
        //   borderWidth: 22,
        //   borderWidthSelected: 22,
        // },
      },
      //height: "100%",
      //color: "white",
     // hover: "true",
      //   nodes: {
      //     size: 20,
      //   },
    },
  //  shadow: true,
    //smooth: true,
    edges: {
      color: {
        color: "#202938", // Sets the color of the edge (arrow)
        hover: "#F46662", // Sets the color when the edge is hovered
        highlight: "#F46662", // Sets the color when the edge is selected or highlighted
        inherit: "from", // Color inheritance, 'from', 'to', or false
        //opacity: 1.0, // Opacity of the edge (0.0 to 1.0)
      },
      width: 2.5,
    },
    nodes: {
      shape: "ellipse", // Sets the shape of the nodes to a rounded square
     // radius: 5, // Sets the radius of the rounded corners (you can adjust this value)
      size: 30,
     // height: 30,
     // width: 30,
     // distance: 500,
      font: {
        size: 14,
        color: "#FFF", // Change the label color for nodes to red (example)
      },
      // color:"white"
      // Sets the size of the node
    },
  
    // arrows: {
    //   to: {
    //     enabled: true,
    //     scaleFactor: 12.8, // Adjust the arrow size
    //     type: "arrow",
    //   },
    // },
  };

  const [dateRange, setDateRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: "selection",
  });

  // Callback function to handle the date range changes
  const handleDateChange = (range: any) => {
    setDateRange(range);
  };

  const handleAddEdge = () => {
    graphRef.current.Network.addEdgeMode();
    setNodeState(false);
    setEdgeState(false);
  };

  useEffect(() => {
    if (resourceDraged) {
      const updatedCloudAccount = cloudAccount.map((account) => {
        if (account.resource) {
          account.resource = account.resource.map((item) => {
            if (
              resourceDraged &&
              resourceDraged.resource_id === item.resource_id
            ) {
              return {
                ...item,
                ismapped: resourceDraged.ismapped,
              };
            }
            return item;
          });
        }
        return account;
      });

      setCloudAccount(updatedCloudAccount);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resourceDraged]);

  const handleDeleteSelected = () => {
    try {
      graphRef.current.Network.deleteSelected();

      const nodes = graphRef?.current?.Network?.body?.data?.nodes;
      const edges = graphRef?.current?.Network?.body?.edges;
  
  

      let nodesArray: any[] = [];

      nodes?.forEach((node: any) => {
        nodesArray.push(node);
      });

      if (create) {
        setResource({ nodes: nodesArray, edges: [] })
      } else {
        setResource((prevNode: any) => {
          return {
            nodes: [...nodesArray],
            edges: [
              ...prevNode.edges,
              Object?.values(edges)?.map((edge: any) => ({
                id: edge.id,
                from: edge.fromId,
                to: edge.toId,
                resource_from: nodesArray?.find((node) => node?.id === edge?.fromId)
                  ?.resource_id,
                resource_to: nodesArray?.find((node) => node?.id === edge?.toId)
                  ?.resource_id,
              }))
            ]
          }
        });
      }

      setNodeState(false);
      setEdgeState(false);

      if (!create && infoNode.isedit && _.isNil(infoNode.ismapped)) {
        setEditRemovedResource((prevResource) => [
          ...prevResource,
          {
            id: infoNode?.id,
            resource_group_id: infoNode?.resource_group_id,
            resource_id: infoNode?.resource_id,
            ismapped: false,
          },
        ]);
      }

      if (!edgeState && (infoNode.isActive || _.isNil(infoNode.isActive))) {
        const dragedItem = {
          ...infoNode,
          ismapped: false,
        };
        setResourceDraged(dragedItem);
      }
    } catch (error) {
      console.log("error  >>>", error);
    }

  };

  const handlePriceTager = () => {
    setPriceTagger(true);
  };

  const [selectedDateRange, setSelectedDateRange] = useState([
    {
      startDate: subDays(new Date(), 13),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false); // State to track modal visibility
  const today = new Date();
  const minDate = new Date(today);
  minDate.setDate(today.getDate() - 13);

  const handleSelect = (ranges: any) => {
    const { startDate, endDate } = ranges.selection;
    const maxSelectableEndDate = addDays(startDate, 13);
    if (isAfter(endDate, maxSelectableEndDate)) {
      setSelectedDateRange([
        { ...ranges.selection, endDate: maxSelectableEndDate },
      ]);
    } else {
      setSelectedDateRange([ranges.selection]);
    }
  };

  const handleNodeClick = (event: any) => {
    setNodeState(true);
    // if (event?.nodes?.length === 0) {
    //   setEdgeState(true)

    // }
    if (event?.nodes.length === 0 && view) {
      setNodeState(false);
      setEdgeState(false);
    } else if (event?.nodes?.length === 0 && event?.edges?.length === 0) {
      setEdgeState(false);
      setNodeState(false);
    } else if (event?.nodes?.length === 0) {
      setEdgeState(true);
    } else {
      setEdgeState(false);
      setNodeState(false);
    }
  };

  return (
    <>
      <TopBar
        currentBreadCrumbRoute={appListData?.find(
          (app: { _id: string }) => app._id === appId
        )}
        currentBreadCrumbProject={projectData?.projectDtl?.find(
          (val: any) => val?._id === projectId
        )}
        onButtonClick={handleFetch}
        onCancel={handleCancel}
        workload_name={workload}
      ></TopBar>
      <CustomBackdrop
        open={
          loadingPlatform ||
          loadingCategory ||
          loadingResourceGroup ||
          workloadLoading ||
          cloudAccountLoading ||
          loadingResource ||
          createMapLoading ||
          editMapLoading
        }
      />
      {priceTagger && view && storedVal === "yes" && (
        <div className="price-tag-topbar">
          <div className="price-tag-topbar-contents">
            <div className="total-cost">
              <div>Total Cost: </div>
              <span>{viewWorkloadData?.total_price}</span>
            </div>
            <div
              className="datepicker-input"
              onClick={() => {
                if (isModalOpen) {
                  setIsModalOpen(false);
                } else if (!isModalOpen) {
                  setIsModalOpen(true);
                }
              }}
            >
              <span className="calendarIcon">
                <CalendarIcon />
              </span>
              <span className="dateVal">
                {moment(selectedDateRange[0].startDate).format("DD-MMM-YYYY") +
                  " to " +
                  moment(selectedDateRange[0].endDate).format("DD-MMM-YYYY")}
              </span>
            </div>

            <div className="price-tag-cal">
              {isModalOpen && (
                <div style={{ height: 1 }}>
                  <DateRangePicker
                    onChange={handleSelect}
                    moveRangeOnFirstSelection={false}
                    ranges={selectedDateRange}
                    direction="horizontal"
                    months={2}
                    rangeColors={["#383E45"]}
                    showMonthAndYearPickers={true}
                    showDateDisplay={false}
                    maxDate={new Date()}
                    minDate={minDate}
                  />
                  <div className="btn-datepicker">
                    <div
                      className="clear-btn-datepicker"
                      onClick={() => {
                        const newSelectedDateRange = [
                          {
                            startDate: subDays(new Date(), 14),
                            endDate: new Date(),
                            key: "selection",
                          },
                        ];
                        setSelectedDateRange(newSelectedDateRange);
                      }}
                    >
                      <span>Clear</span>
                    </div>
                    {/* {moment(selectedDateRange[0]?.startDate)?.format(
                      "YYYY-MM-DD"
                    ) ===
                    moment(selectedDateRange[0]?.endDate)?.format(
                      "YYYY-MM-DD"
                    ) ? (
                      <div className="ok-btn-datepicker-disabled">
                        <span>Ok</span>
                      </div>
                    ) : ( */}
                      <div
                        className="ok-btn-datepicker"
                        onClick={() => {
                          setIsModalOpen(false);
                          const startDate = moment(
                            selectedDateRange[0].startDate
                          ).format("YYYY-MM-DD");
                          const endDate = moment(
                            selectedDateRange[0].endDate
                          ).format("YYYY-MM-DD");
                          const payload = {
                            workloadId,
                            select: "priceTagger",
                            start_date: startDate,
                            end_date: endDate,
                            project_id: projectId,
                          };
                          dispatch(viewWorkloadRequest(payload));
                        }}
                      >
                        <span>Apply</span>
                      </div>
                    {/* )} */}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {infoNode && !edit && !create && <div onClick={handleWorkloadInfo}></div>}
      <div className="wo-wrapper">
        {isSelected && (edit || create) && (
          <section className="wo-sidebar">
            {
              getCloudPlatformData === null ? (
                <div></div>
              ) :
                getCloudPlatformData && getCloudPlatformData?.length > 0 ? (
              <TabView
                activeIndex={activeIndex}
                onTabChange={onHandleTabChange}
                onBeforeTabChange={(event) => {
                  if (
                    _.keys(graphRef?.current?.Network?.body?.nodes)?.length > 0
                  ) {
                    if (activeIndex === event.index) {
                      setShowConfirmDialog(false);
                    } else {
                      setShowConfirmDialog(true);
                    }
                    return false;
                  } else {
                    return true;
                  }
                }}
              >
                {getCloudPlatformData?.map((item: string, index: number) => (
                  <TabPanel key={index} header={
                    item.toLocaleLowerCase() === 'aws' ? 'AWS' : item
                  }>
                    <div className="wo-sidebar-body" key={index}>
                      <div className="position-releative">
                        <span className="position-search-icon">
                          <SearchIcon />
                        </span>
                        <InputText
                          autoFocus={true}
                          value={searchValue}
                          onKeyDown={(event) => PreventSpaceAtFirst(event)}
                          onChange={(e) => setSearchValue(e.target.value)}
                          placeholder="Search"
                        />
                      </div>
                      {
                        memoizedNodes === undefined ? (
                          <div></div>
                        ) :
                          memoizedNodes && memoizedNodes?.length > 0 ? (
                            memoizedNodes?.map((node) => (
                              <ListCloudInstances
                                key={node._id}
                                node={node}
                                expandedNodes={expandedNodes}
                                handleNodeSelection={handleNodeSelection}
                                handleToggle={handleToggle}
                              />
                            ))
                          ) : (
                            <div className="not-found">
                              <div className="cursor-default title-not-found">
                                Oops! No results found
                              </div>
                              <div className="sub-title-not-found">
                                Try refining your search or explore other categories
                              </div>
                            </div>
                          )
                      }
                    </div>
                  </TabPanel>
                ))}
              </TabView>
            ) : (
              <div className="not-found no-platforms">
                <div className="cursor-default title-not-found">
                  Oops! No results found
                </div>
              </div>
            )}
          </section>
        )}
        {selectedInstancesComponent}
        <div ref={drop} className="wo-wrapper-network-graph">
          <>
            {resource?.nodes?.length > 0 && (
              <>
                {nodeState ? (
                  <div className="addlink-info-remove-styles">
                    {view || edgeState || infoNode?.isActive === false ? (
                      ""
                    ) : (
                      <div className="workload-icon-text">
                        <AddLinkIcon />
                        <div
                          onClick={handleAddEdge}
                          className="addlink-info-remove-text"
                        >
                          Add link
                        </div>
                      </div>
                    )}

                    {edgeState ? (
                      ""
                    ) : (
                      <div className="workload-icon-text">
                        <WorkloadInfoIcon />
                        <div
                          onClick={handleWorkloadInfo}
                          className="addlink-info-remove-text"
                        >
                          Info
                        </div>
                      </div>
                    )}

                    {view ? (
                      ""
                    ) : (
                      <div className="workload-icon-text">
                        <WorkloadCancelIcon />
                        <div
                          onClick={handleDeleteSelected}
                          className="addlink-info-remove-text workload-remove-text"
                        >
                          Remove
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <></>
                )}
              </>
            )}

            {resource?.nodes?.length > 0 ? (
              <Network
                graph={resource}
                ref={graphRef}
                options={options}
                events={{
                  click: handleNodeClick,
                  //selectEdge: handleEdgeClick
                }}
                getNetwork={(network: any) => {
                  network.on("afterDrawing", (ctx: any) => {                   
                    network.on("click", (params: any) => {
                      if (params?.nodes && params?.nodes?.length > 0) {
                        const clickedNodeId = params?.nodes[0];
                        let disRef = graphRef?.current?.Network?.body?.nodes;
                        if (disRef) {
                          nodesArray = Object?.values(disRef)?.map(
                            (node: any) => ({
                              ...node.options,
                            })
                          );
                        }
                        const selectedResource = nodesArray.find(
                          ({ id }: { id: string }) => id === clickedNodeId
                        );
                        if (selectedResource) {
                          setInfoNode(selectedResource);
                          setNodeState(true);
                        }
                      }
                    });
                    resource?.nodes.forEach((node: any) => {
                      const iconImg = new Image();
                      iconImg.src =
                        "https://www.iconarchive.com/download/i22783/kyo-tux/phuzion/Sign-Info.ico";
                      const nodeId = node.id;
                      const nodePosition = network.getPositions([nodeId])[
                        nodeId
                      ];
                      const nodeSize = 20;
                      // var setVal = sessionStorage.getItem("set");
                      if (storedVal === "yes") {
                        ctx.font = "14px";
                        ctx.fillStyle = "#000000";
                        ctx.textAlign = "center";
                        ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
                        ctx.shadowBlur = 5;
                        ctx.fillStyle = "#20262D";
                        ctx.fillRect(
                          nodePosition?.x + nodeSize + 20,
                          nodePosition?.y + nodeSize - 30,
                          node?.cost?.split("").length * 3 + 50,
                          20
                        );
                        // ctx.fillText(
                        //   node.label,
                        //   nodePosition.x,
                        //   nodePosition.y + nodeSize + 20
                        // );
                        ctx.font = "12px Arial";
                        ctx.color = "#FFFFFF";
                        ctx.fillStyle = "#FFFFFF";
                        ctx.textAlign = "left";
                        ctx.fillText(
                          node?.cost,
                          nodePosition?.x + nodeSize + 28,
                          nodePosition?.y + nodeSize - 15
                        );
                      }
                      // else if (storedVal === "no") {
                      //   const iconWidth = 20; // width of the icon image
                      //   const iconHeight = 16;
                      //   iconImg.src =
                      //     "https://www.iconarchive.com/download/i22783/kyo-tux/phuzion/Sign-Info.ico";
                      //   ctx.font = "14px Arial";
                      //   ctx.fillStyle = "#000000";
                      //   ctx.textAlign = "center";
                      //   ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
                      //   ctx.shadowBlur = 5;
                      //   ctx.fillStyle = "#ffcc00";

                      //   ctx.drawImage(
                      //     iconImg,
                      //     nodePosition?.x + nodeSize + 65,
                      //     nodePosition?.y + nodeSize + 65,
                      //     iconWidth,
                      //     iconHeight
                      //   );
                      //   // iconImg.addEventListener("mouseover", myFunction, "false");
                      // }
                    });
                  });
                  var minZoom = 0.5;
                  var maxZoom = 1.5;
                  network.on("zoom", (eventParams: any) => {
                    const { scale } = eventParams;
                    if (scale < minZoom) {
                      network.moveTo({ scale: minZoom });
                    } else if (scale > maxZoom) {
                      network.moveTo({ scale: maxZoom });
                    }
                  });
                  network.on("dragStart", (dragStart: any) => {
                    if (dragStart && edit) {
                      setResourceDragStart(true)
                      localStorage.setItem('is_resource', JSON.stringify(true))
                    }
                  });
                }}
              />
            ) : (
              <>
                {storedVal === "yes" && (
                  <div className="display-empty-canvas">
                    {workloadLoading ? "" : <PriceTaggerNoResponse />}
                  </div>
                )}
                {
                  (storedVal !== "yes" && create) && (
                    <EmptyCanvas />
                  )
                }
              </>
            )}
            {view && (
              <div className="workload-float-input-container">
                <div className="workload-float-input">
                  <div
                    className={`${
                      storedVal === "no" ? "input-1-highlighted" : "input-1"
                    }`}
                    onClick={(e) => {
                      setStoringVal("no");
                      setIsModalOpen(false);
                      graphRef?.current?.updateGraph();
                      const payload = {
                        workloadId,
                        select: "workload",
                      };
                      dispatch(viewWorkloadRequest(payload));
                    }}
                  >
                    <span>
                      <WorkloadIconDark />
                    </span>
                    Workload
                  </div>
                  <div
                    className={`${
                      storedVal === "yes" ? "input-2-highlighted" : "input-2"
                    }`}
                    onClick={(e) => {
                      setStoringVal("yes");
                      graphRef?.current?.updateGraph();
                      handlePriceTager();
                      const startDate = moment()
                        .subtract(14, "days")
                        .format("YYYY-MM-DD");
                      const endDate = moment().format("YYYY-MM-DD");
                      const payload = {
                        workloadId,
                        select: "priceTagger",
                        start_date: startDate,
                        end_date: endDate,
                        project_id: projectId,
                      };
                      dispatch(viewWorkloadRequest(payload));
                    }}
                  >
                    <span>
                      <PriceTagIcon />
                    </span>
                    Price Tagger
                  </div>
                  <div className="input-disabled">
                    <span>
                      <CuraWhiteIcon />
                    </span>
                    CURA
                  </div>
                  <div className="input-disabled">
                    <span>
                      <SecurityIcon />
                    </span>
                    Security
                  </div>
                  <div className="input-disabled">
                    <span>
                      <SreIcon />
                    </span>
                    SRE
                  </div>
                </div>
              </div>
            )}
          </>
        </div>
      </div>
      {isDrawerOpen && (
        <WorkloadInfoPanel
          isDrawerOpen={isDrawerOpen}
          handleToggleDrawer={handleToggleDrawer}
        />
      )}
      <ConfirmDialog
        className="confirm-dialog-cloud-onboarding Wo-model-popup"
        visible={showConfirmDialog}
        onHide={() => setShowConfirmDialog(false)}
        reject={handleQuit}
        acceptLabel={"Ok, Got it"}
        position="bottom"
        message={
          <>
            <span className="confirm-dialog-normal">
              Please note that switching to another cloud service provider
              requires clearing all resources mapped in this resource chart.
            </span>
          </>
        }
        header="Switch to another cloud service provider?"
        icon="pi pi-exclamation-triangle"
      >
        <template>
          <div className="p-d-flex p-jc-between">
            <Button className="p-button-text">Ok, Got it</Button>
          </div>
        </template>
      </ConfirmDialog>
      <ConfirmLeaving
          isResource={isResource}
          leaveWorkloadScreen={leaveWorkloadScreen}
          stayOnWorkloadScreen={stayOnWorkloadScreen}
        />
      <MySnackbar
        className="snack-bar"
        message={message}
        severity={severity}
        open={snackOpen}
        onClose={handleSnackbarClose}
      />
    </>
  );
};






export default WorkloadSideBar;