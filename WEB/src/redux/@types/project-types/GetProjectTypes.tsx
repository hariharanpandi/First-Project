export type PermissionsAccessLevel = 'create' | 'view' | 'edit' | 'delete';

export enum UserType {
  ADMIN_USER = "A",
  NORMAL_USER = "N",
}

export type RoleName = 'Project_Admin' | 'Infra_Admin' | 'View_Only' | 'Workload_Admin';

export type AccessLevelKey = 'app_access_lvl' | 'discovery_access_lvl' |
  'project_access_lvl' | 'workload_access_lvl';

export interface AccessLevel extends Record<AccessLevelKey, PermissionsAccessLevel[]> { };

export interface Projects {
  data: {
    email: string;
    first_name: string;
    last_name: string;
    projectDtl: {
      project?: Record<string, string>;
      project_id: string;
      project_name?: string;
      description?: string;
      roledtl?: {
        access_level: AccessLevel;
        role_name: RoleName;
      };
      _id: string;
    }[];
    tenant_group_id: string;
    tenant_id: string;
    user_type: UserType.NORMAL_USER | UserType.ADMIN_USER;
    _id: string;
  };
}


export interface DirectAccessLevel {
  app_id: string;
  created_at: string;
  project_id: string;
  role_access: Record<string, PermissionsAccessLevel[]>;
  role_id: string;
  role_name: string;
  status: string;
}

export type RootState = {
  persistedRbac: {
      getProject: {
          error: Error;
          success: Projects['data']
      }
  };
};
