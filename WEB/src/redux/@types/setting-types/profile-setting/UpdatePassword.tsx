export interface PasswordRequest{
    
    tenant_id: string|null;
    tenant_group_id: string|null;
user_name:string;
    password:string;
    email: string;
    status: string;

}

export interface PasswordProfile{
message: string;
data?: {      
    
        _id: string;
        tenant_group_id: string;
        user_name:string
        email: string;
        last_active: string;
        status: string;
        created_by: string;
        created_at: string;
        last_accessed_by: string;
        last_accessed_at: string;
        __v: string;
    
};
}
