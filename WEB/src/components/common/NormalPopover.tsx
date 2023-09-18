/**
 * A component that renders a popover with a list of menu items.
 * This component does not include any role-based access control (RBAC) implementation.
 * If developers need a role-based access control (RBAC) implementation,
 * they should use the RbacPopover component in RbacPopover.tsx.
 * For a basic popover without RBAC, this NormalPopover component is suitable.
*/

import { Box } from "@mui/material";
import { MouseEventHandler } from "react";

type NormalMenuItem = {
    icon: React.ReactNode;
    label: string;
    itemClassName?: string;
    onClick: MouseEventHandler<HTMLDivElement>;
};

type NormalPopoverProps = {
    menuItems: NormalMenuItem[];
    menuClassName?: string;
};

const NormalPopover = (props: NormalPopoverProps) => {
    const { menuItems, menuClassName } = props;

    return (
        <Box>
            <div className={`project-popover-content ${menuClassName ?? ''}`}>
                {menuItems
                    .map((item, index) => (
                        <div className={
                            `project-popover-text ${item?.itemClassName ?? ''}`
                        } onClick={item?.onClick} key={index}>
                            <span className="edit-project-icon">{item?.icon}</span>
                            <span className="project-popover-name">{item?.label}</span>
                        </div>
                    ))
                }
            </div>
        </Box>
    );
};

export default NormalPopover;
