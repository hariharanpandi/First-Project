/**
 * Custom hook for handling authorization and access control.
 * @returns {object} An object with the hasAccess function for checking access permissions.
 * @throws {Error} If there is an error with the Redux persist type.
 * @throws {Error} If project details are not available.
 * @throws {Error} If project details for a specific role cannot be found.
 * @description The useAuthorizationhook checks the user's access level and permissions based on project details and role.
*/

import { useSelector } from 'react-redux';
import {
    RootState,
    PermissionsAccessLevel,
    Projects,
    UserType,
    RoleName,
    AccessLevelKey,
    DirectAccessLevel,
} from '../../../redux/@types/project-types/GetProjectTypes';
import _ from 'lodash';

const useAuthorization = (): {
    hasAccess: (
        roleName: RoleName,
        requiredPermissions: PermissionsAccessLevel[],
        accessLevel: AccessLevelKey,
        directaccesslevel: DirectAccessLevel | undefined,
    ) => boolean;
} => {

    const {
        getProject: {
            success,
        }
    }: {
        getProject: {
            error: Error;
            success: Projects['data']
        }
    } = useSelector((state: RootState) => state.persistedRbac);

    const hasPermission = (
        roleName: RoleName,
        requiredPermissions: PermissionsAccessLevel[],
        accessLevel: AccessLevelKey,
        directaccesslevel: DirectAccessLevel | undefined,
    ): boolean => {
        if (success?.projectDtl && success?.projectDtl.length > 0) {
            let ProjectsDetails
            if (!_.isNil(directaccesslevel)) {
                ProjectsDetails = {
                    ...directaccesslevel,
                    roledtl: {
                        access_level: directaccesslevel?.role_access,
                        role_name: directaccesslevel?.role_name,
                    }
                }
            } else {
                ProjectsDetails = success?.projectDtl.find(
                    (item: {
                        roledtl?: {
                            role_name?: RoleName
                        }
                    }) => item?.roledtl?.role_name === roleName
                );
            }

            if (ProjectsDetails && accessLevel) {
                const { roledtl } = ProjectsDetails;
                return requiredPermissions.every(reqpermission =>
                    roledtl?.access_level?.[accessLevel]?.includes(reqpermission)
                )
            } else {
                return false;
            }
        } else {
            return false;
        }
    };

    const hasAccess = (
        roleName: RoleName,
        requiredPermissions: PermissionsAccessLevel[],
        accessLevel: AccessLevelKey,
        directaccesslevel: DirectAccessLevel | undefined,
    ): boolean => {
        if (success?.user_type === UserType.ADMIN_USER) {
            return true;
        } else {
            return hasPermission(
                roleName,
                requiredPermissions,
                accessLevel,
                directaccesslevel,
            );
        }
    };

    return { hasAccess };
};

export default useAuthorization;
