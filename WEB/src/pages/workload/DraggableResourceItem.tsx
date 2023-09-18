import { useDrag } from "react-dnd";
import CloudResourceIcon from "../../assets/images/cloud-resource-icon.svg";
import CustomTooltip from "../../components/CustomTooltip";

import { getWorkloadInfoRequest } from "../../redux/action/workload-action/getWorkloadInfoAction";
import { useDispatch } from "react-redux";
import WorkloadInfoPanel from "./WorkloadInfoPanel";
import { useState } from "react";
import { getQueryParam } from "../../helper/SearchParams";

const DraggableResourceItem = ({
    resource
}: {
    resource: any;
}) => {

    const dispatch = useDispatch();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const workloadId = getQueryParam("workloadId");

    const [{ isDragging }, drag] = useDrag(
        () => ({
            type: 'woResourceToNetworkGraph',
            canDrag: !resource.ismapped,
            item: { resource },
            collect: (monitor: any) => ({
                isDragging: monitor.isDragging(),
                handlerId: monitor.getHandlerId(),
            }),
        }),
        [resource]
    );

    const handleToggleDrawer = (open: boolean) => (): void => {
        setIsDrawerOpen(open);
    };

    const handelOpenResourceInfo = () => {
        const workloadInfoReqPayload = {
            resource_id: resource.resource_id,
            resource_group_id: resource.resource_group_id,
            workload_id: workloadId,
            cloud_id:resource.cid,
        };
        setIsDrawerOpen(true);
        dispatch(getWorkloadInfoRequest(workloadInfoReqPayload));
    }

    return (
        <>
            <CustomTooltip
                title={resource?.name}
                placement="top"
                key={resource?.resource_id}
            >
                <div
                    className={
                        (isDragging || resource.ismapped) ? "wo-resources-section-details action-disabled" : "wo-resources-section-details"
                    }
                    key={resource.resource_id}
                    ref={drag}
                    data-testid={resource.resource_id}
                    onClick={handelOpenResourceInfo}
                >
                    <span
                        className={
                            resource.isshared
                                ? "wo-resources-section-details-active"
                                : "wo-resources-section-details-inactive"
                        }
                    ></span>
                    <img
                        src={CloudResourceIcon}
                        alt="Resource Icon"
                        className="wo-resources-section-details-icon"
                    />
                    <span className="wo-resources-section-details-name prevent-text-overflow">
                        {resource?.name}
                    </span>
                    <span className="wo-resources-section-details-text">
                        {resource?.region}
                    </span>
                </div>
            </CustomTooltip>
            {
                isDrawerOpen && (
                    <WorkloadInfoPanel
                        isDrawerOpen={isDrawerOpen}
                        handleToggleDrawer={handleToggleDrawer}
                    />
                )
            }
        </>
    );
};

export default DraggableResourceItem;