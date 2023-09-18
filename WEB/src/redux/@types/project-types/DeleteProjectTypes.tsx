export interface ProjectRequest{
  deleteId:string;
}
  export interface ProjectDeleteResponse {
    status: number;
    data?: {
     message:string
    };
  }
  