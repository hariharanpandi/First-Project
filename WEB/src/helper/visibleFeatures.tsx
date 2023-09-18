import { useSelector } from "react-redux";
import useAuthorization from "../pages/auth/authorization/authorization";
import { AccessLevelKey, PermissionsAccessLevel } from "../redux/@types/project-types/GetProjectTypes";

const GenerateAccessLevel = (
    projectData: { projectDtl: any[]; },
    projectid: string,
    action: PermissionsAccessLevel,
    accessType: AccessLevelKey,
) => {
    const { hasAccess } = useAuthorization();

    return hasAccess(
        projectData?.projectDtl?.find(val => val?._id === projectid)?.roledtl?.role_name,
        [action],
        accessType,
        undefined
    );
};


const VisibleFeatures = (projectid: string) => {
    const { projectData } = useSelector((state: any) => state.getProject);

    const createProjectLevelRbac = GenerateAccessLevel(projectData, projectid, "create", "project_access_lvl");
    const editProjectLevelRbac = GenerateAccessLevel(projectData, projectid, "edit", "project_access_lvl");
    const viewProjectLevelRbac = GenerateAccessLevel(projectData, projectid, "view", "project_access_lvl");
    const deleteProjectLevelRbac = GenerateAccessLevel(projectData, projectid, "delete", "project_access_lvl");

    const createApplicationLevelRbac = GenerateAccessLevel(projectData, projectid, "create", "project_access_lvl");
    const editApplicationLevelRbac = GenerateAccessLevel(projectData, projectid, "edit", "project_access_lvl");
    const viewApplicationLevelRbac = GenerateAccessLevel(projectData, projectid, "view", "project_access_lvl");
    const deleteApplicationLevelRbac = GenerateAccessLevel(projectData, projectid, "delete", "project_access_lvl");

    const createDiscoveryLevelRbac = GenerateAccessLevel(projectData, projectid, "create", "project_access_lvl");
    const editDiscoveryLevelRbac = GenerateAccessLevel(projectData, projectid, "edit", "project_access_lvl");
    const viewDiscoveryLevelRbac = GenerateAccessLevel(projectData, projectid, "view", "project_access_lvl");
    const deleteDiscoveryLevelRbac = GenerateAccessLevel(projectData, projectid, "delete", "project_access_lvl");

    const createWorkLoadLevelRbac = GenerateAccessLevel(projectData, projectid, "create", "project_access_lvl");
    const editWorkLoadLevelRbac = GenerateAccessLevel(projectData, projectid, "edit", "project_access_lvl");
    const viewWorkLoadLevelRbac = GenerateAccessLevel(projectData, projectid, "view", "project_access_lvl");
    const deleteWorkLoadLevelRbac = GenerateAccessLevel(projectData, projectid, "delete", "project_access_lvl");

    return {
        createProjectLevelRbac,
        editProjectLevelRbac,
        viewProjectLevelRbac,
        deleteProjectLevelRbac,
        createApplicationLevelRbac,
        editApplicationLevelRbac,
        viewApplicationLevelRbac,
        deleteApplicationLevelRbac,
        createDiscoveryLevelRbac,
        editDiscoveryLevelRbac,
        viewDiscoveryLevelRbac,
        deleteDiscoveryLevelRbac,
        createWorkLoadLevelRbac,
        editWorkLoadLevelRbac,
        viewWorkLoadLevelRbac,
        deleteWorkLoadLevelRbac
    };
};

export default VisibleFeatures;
