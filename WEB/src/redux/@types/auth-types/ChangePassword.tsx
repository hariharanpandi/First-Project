export interface ChangePwdUser {   
    password: string;
    confirmPassword:string;
  }

  export interface changePwdUserRequest{
    userid:string|null;
    password:string|undefined;
  }
  export interface ChangePwdResponse{
    status: number;
    data: {
      data:any;
    };
  }