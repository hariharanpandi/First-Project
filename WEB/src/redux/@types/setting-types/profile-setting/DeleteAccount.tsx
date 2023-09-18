export interface DeleteRequest {
  last_accessed_by: string|null;
}

export interface DeleteResponse {
  status: number;
  data?: {
    _id: string;
    tenant_group_id: string;
    first_name: string;
    last_name: string;
    email: string;
    last_active: string;
    status: string;
    created_by: string;
  };
}
