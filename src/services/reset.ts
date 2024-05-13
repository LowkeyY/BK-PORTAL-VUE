import http from '@/utils/request';
import { getBaseUrl } from '@/utils/env';

const { SSO_SERVER, PORTAL_SERVER, CUNOVS_SERVER } = getBaseUrl();

/**
 * 通过账户获取userId
 */
export function getUserByAccountName(data:UserByAccountNameParams) {
    return http.request({
        url: `${SSO_SERVER}/cipherreset/getUserByAccountName`,
        data
    });
}


/**
 * 发送验证码
 */
export function resetSendCode(data:ResetSendCodeParams) {
    return http.request({
        url: `${SSO_SERVER}/cipherreset/sendCode`,
        data
    });
}

/**
 * 输入验证码
 */
export function verifyCode(data:VerifyCodeParams) {
    return http.request({
        url: `${SSO_SERVER}/cipherreset/verifyCode`,
        data
    });
}

/**
 * 重置密码
 */
export function resetPassword(data:ResetPasswordParams) {
    return http.request({
        url: `${SSO_SERVER}/cipherreset/resetPassword`,
        data
    });
}
