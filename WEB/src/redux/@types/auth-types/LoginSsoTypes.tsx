export interface SSOUser {
  domain:string;
}

export interface SSOResponse{
  status: string;
  data?: {      
    Message?: string;
  };
}
