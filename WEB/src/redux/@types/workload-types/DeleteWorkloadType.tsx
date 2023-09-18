export interface WorkloadRequest{
    deleteId:string;
  }
    export interface WorkloadDeleteResponse {
      status: number;
      data?: {
       message:string
      };
    }