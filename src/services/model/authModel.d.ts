declare interface CaptchaImgParams {
    capatcaKey: string;
}
declare interface SsoParams {
    username: string;
    password: string;
}

declare interface LoginParams {
    username: string;
    password: string;
}
declare interface AccessTokenParams {
   access_token:string
}
declare interface MoodleTokenParams {
    username:string,
    usersn:string
 }
declare interface LoginModel {
    token: string;
}

declare interface PcLoginCodeParams {
    credential: string;
    _t?:string|number
}

declare interface PcLoginParams {
    username: string;
    password:string|number;
    loginMode:string;
}

declare interface PaymentLoginParams {
    head: string;
    data:string;
}

declare interface GetResetTypesParams {
    userId: string|number;
}
