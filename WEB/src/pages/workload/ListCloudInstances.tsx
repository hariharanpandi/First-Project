import React, { useState } from "react";
import ArrowRightIcon from "../../assets/icons/ArrowRightIcon";
import ResourceGroup from "../../assets/images/resource-group-icon.svg";
import { Skeleton } from 'primereact/skeleton';
import CustomTooltip from "../../components/CustomTooltip";

interface nodeData {
    cloud_category: string;
    cloud_platform_type: string;
    _id: string;
    cloudresourcegroup: {
        _id: string;
        image: string;
        name: string;
    }[];
}

interface ListCloudInstancesProps {
    node: nodeData;
    expandedNodes: { [key: string]: boolean };
    handleNodeSelection: (node: {
        _id: string;
        image: string;
        name: string;
    }) => void;
    handleToggle: (node: {
        _id: { toString: () => string };
        cloud_platform_type: string;
    }) => void;
}

const ListCloudInstances: React.FC<ListCloudInstancesProps> = ({
    node,
    expandedNodes,
    handleNodeSelection,
    handleToggle,
}) => {
    const isNodeExpanded = expandedNodes[node?._id?.toString()];
    const [imageError, setImageError] = useState(false);

    const handleImageError = () => {
        setImageError(true);
    };

    const toggleNode = () => {
        handleToggle(node);
    };

    const selectChildNode = (childNode: {
        _id: string;
        image: string;
        name: string;
    }) => {
        handleNodeSelection(childNode);
    };

    return (
        <>
            <div className={(isNodeExpanded ? 'wo-category wo-category-selected' : 'wo-category')} onClick={toggleNode}>
                <span className={(isNodeExpanded ? 'arrow-down-icon' : 'arrow-right-icon')}>
                    {<ArrowRightIcon />}
                </span>
                <CustomTooltip title={node.cloud_category} placement='top'>
                    <span className="wo-category-name">
                        {node.cloud_category}
                    </span>
                </CustomTooltip>
            </div>
            {isNodeExpanded && (
                <div className="wo-resource-group">
                    {node?.cloudresourcegroup?.length > 0 ? node?.cloudresourcegroup?.map((childNode) => (
                        <section key={childNode._id} onClick={() => selectChildNode(childNode)}>
                            <CustomTooltip title={childNode.name} placement='top'>
                                <div className="wrapper">
                                    {/* <span className={
                                        index % 2 === 0 ? "active" : ''
                                    }></span> */}
                                    <div className="tooltip">
                                        <Skeleton className="placeholder-loader" height="44px" width="44px" />
                                        {imageError ? (
                                            <img src={ResourceGroup} className="group-img" alt="ResourceGroup" loading="lazy" />
                                        ) : (
                                            <img src={childNode.image} alt="icon" className="group-img"
                                                onError={handleImageError} loading="lazy" />
                                        )}
                                    </div>
                                    <span className="display-name">{childNode.name}</span>
                                </div>
                            </CustomTooltip>
                        </section>
                    )) : node?.cloudresourcegroup?.length === 0 ? (
                        <div className="not-found">
                            <div className="cursor-default title-not-found">Oops! No results found</div>
                            <div className="sub-title-not-found">Try refining your search or explore other categories</div>
                        </div>
                    ) : ''}
                </div>
            )}
        </>
    );
};

export default ListCloudInstances;
