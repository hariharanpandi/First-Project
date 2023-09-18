export interface ForgotPwdUser {
    email:string;
  }

  export interface ForgotPwdResponse{
    status: number;
    data?: {      
      Message?: string;
    };
  }
  