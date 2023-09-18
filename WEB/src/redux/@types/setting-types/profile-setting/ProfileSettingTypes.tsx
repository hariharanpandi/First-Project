

  export interface UserProfile{
    data:{
      message: string;
      data?: {          
              _id: string,
              tenant_id:string,
              tenant_group_id: string,
              domain_name:string,
              first_name: string,
              last_name: string,
              email: string,
              last_active: string,
              status: string,
              created_by: string,
              created_at: string,
              last_accessed_by: string,
              last_accessed_at: string,
              __v: string,
          
      }
    }
   
  }
  