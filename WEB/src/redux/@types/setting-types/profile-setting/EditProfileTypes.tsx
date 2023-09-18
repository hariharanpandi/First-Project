// export interface EditRequest{
//         file:any
//         data?:{
//                 tenant_id: string|null,
//                 tenant_group_id: string|null,
//                 first_name: string,
//                 last_name: string,
//                 email: string,
//                 status: string,  
      
//         }
    
// }

export interface EditProfile{
    message: string;
    data?: {      
        
            _id: string,
            tenant_id:string,
            tenant_group_id: string,
            first_name: string,
            last_name: string,
            email: string,
            last_active: string,
            status: string,
            created_by: string,
            created_at: string,
            user_img:string,
            last_accessed_by: string,
            last_accessed_at: string,
            __v: string,
        
    };
  }
  