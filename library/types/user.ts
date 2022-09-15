export type RoleType = '' | '*' | 'admin' | 'user';
export interface UserState {
  accountId?:string;
  avatar?:string;
  certification?:number;
  email?:string;
  introduction?:string;
  job?:string;
  jobName?:string;
  location?:string;
  locationName?:string;
  name?:string;
  organization?:string;
  organizationName?:string;
  personalWebsite?:string;
  phone?:string;
  registrationDate?:string;
  role: RoleType;
}

export interface RegistryParamsI {
  invitation_code: string,
  email: string,
  nickname: string,
  password: string,
  code: string,
  captchaId: string,
  captcha: string
}
