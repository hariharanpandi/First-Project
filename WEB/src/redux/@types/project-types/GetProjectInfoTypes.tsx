export interface ProjectInfoData{
    data:{
      message: string;
      data?: {          
        _id: string,
       tenant_id: string,
        tenant_group_id: string,
        project_name: string,
        description: string,
        status: string,
      }
    }   
  }

