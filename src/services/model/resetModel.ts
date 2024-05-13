
declare interface UserByAccountNameParams {
    accountName: string|number;
}

declare interface ResetSendCodeParams {
    userId: string|number;
    receiveType: string;
}

declare interface VerifyCodeParams {
    userId: string|number;
    code: string|number;
}
declare interface ResetPasswordParams {
    userId: string|number;
    password: string|number;
    code: string|number;
}
