export interface User {
  email: string;
  password: string;
}



export interface LoginResponse {
data?:{
  authDetails?: {
    accessToken: string;
  }
  userDetails?: {
    id: string;
    name: string;
    email: string;
    status: string;
    user_type:string;
  };
}
 
}



// export interface LoginResponse {
//   status: number;
//   data?: {
//     Data?: {
//       AccountId: string;
//       SessionId: string;
//       TokenId: string;
//       UserId: string;
//     };
//     Message?: string;
//   };
// }

export interface Error {
  err: string;
}
