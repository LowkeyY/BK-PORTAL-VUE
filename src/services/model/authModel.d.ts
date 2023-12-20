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
