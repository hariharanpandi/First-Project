export interface Project {
    roledtl: Record<string, unknown>;
    role_name: string | undefined;
    id: number;
    name: string;
    projectAdmin: boolean;
    infraAdmin: boolean;
    viewOnly: boolean;
    project_name: string;
    _id: string;
    isActive: boolean | undefined;
    role_id: string | undefined;
    isupdatechecked: true | undefined;
}

export interface Application {
    id: number;
    name: string;
    workloads: Workload[];
    app_name: string;
    _id: string;
    project_id: string;
    isActive: Boolean;
}

export interface Workload {
    workload_name: string;
    _id: string;
    id: number;
    name: string;
    app_id: string;
    project_id: string;
    isActive: boolean | undefined;
    role_id: string | undefined;
    role_name: string | undefined;
    isupdatechecked: boolean | undefined;
}

export enum RoleName {
    WORKLOAD_ADMIN = 'Workload_Admin',
    INFRA_ADMIN = 'Infra_Admin',
    PROJECT_ADMIN = 'Project_Admin',
    VIEW_ONLY = 'View_Only',
  }
  