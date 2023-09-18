export interface AppRequest{
    deleteId:string;
  }
    export interface AppDeleteResponse {
      status: number;
      data?: {
       message:string
      };
    }
    