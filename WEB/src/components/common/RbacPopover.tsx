/**
 * A component that renders a popover with a list of menu items.
 * This component include role-based access control (RBAC) implementation.
 * Developers who need role-based access control (RBAC) should use this component.
 * If RBAC is not required, consider using the NormalPopover 
 * component in NormalPopover.tsx instead.
*/

import { Box } from "@mui/material";
import { MouseEventHandler } from "react";
import useAuthorization from "../../pages/auth/authorization/authorization";
import {
    AccessLevelKey,
    PermissionsAccessLevel,
    RoleName,
    DirectAccessLevel,
} from "../../redux/@types/project-types/GetProjectTypes";

type RbacMenuItem = {
    icon: React.ReactNode;
    label: string;
    directaccesslevel?: DirectAccessLevel | undefined;
    accessLevel: AccessLevelKey;
    requiredPermissions: PermissionsAccessLevel[];
    itemClassName?: string;
    onClick: MouseEventHandler<HTMLDivElement>;
};


type RbacPopoverProps = {
    menuItems: RbacMenuItem[];
    roleName: RoleName;
    menuClassName?: string;
};

const RbacPopover = (props: RbacPopoverProps) => {
    const { hasAccess } = useAuthorization();
    const { menuItems, roleName, menuClassName } = props;

    return (
        <Box>
            <div className={`project-popover-content ${menuClassName ?? ''}`}>
                {menuItems
                    .filter(item => hasAccess(
                        roleName,
                        item?.requiredPermissions,
                        item?.accessLevel,
                        item?.directaccesslevel,
                    ))
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

export default RbacPopover;
