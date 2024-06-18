/*
 * @Author: Lowkey
 * @Date: 2023-12-13 18:09:46
 * @LastEditors: Lowkey
 * @LastEditTime: 2024-06-11 10:28:10
 * @FilePath: \BK-Portal-VUE\src\services\login.ts
 * @Description:
 */

import http from '@/utils/request';
import { getBaseUrl } from '@/utils/env';
import { useAuthStore } from '@/store/modules/auth';

const { SSO_SERVER, PORTAL_SERVER, CUNOVS_SERVER } = getBaseUrl();

const SSO = `${PORTAL_SERVER}/sso`; // !!!!!!!!!!!!!!!!!!!!!!!!单点登录sso接口 PORTAL_SERVER !!!!!!!!!!!!!!!
const LOGIN = `${PORTAL_SERVER}/login`;
const PORTAL_TOKEN = `${PORTAL_SERVER}/oauth/userToken`;
const CHECK_FIRST_LOGIN = `${SSO_SERVER}/current`;
const MOODLE_TOKEN = `${CUNOVS_SERVER}/config/getBkUser`; // 获取学习平台Token
const LOGIN_OUT = '/logout'; // 退出
const LOGIN_INFO = `${CUNOVS_SERVER}/login/info`; // 登录信息
const GET_PCLOGIN_CODE = `${SSO_SERVER}/security/encodeFix`; // 集成单点登录，获取PC端登录密码
const PC_LOGIN = `${SSO_SERVER}/security_check`; // 模拟PC登录获取pc端cookie 用于集成单点登录
const PAYMENT_LOGIN = `${CUNOVS_SERVER}/other/sso/jwgl`; // 缴费系统单点登录

/*
 * sso单点登录
 * @param params
 */
export function singleSignOnApi(data: SsoParams) {
    return http.request({
        url: SSO,
        method: 'post',
        data,
    });
}

/**
 * 门户登录
 * @param params
 */
export function portalLoginApi(data: LoginParams) {
    return http.request({
        url: LOGIN,
        method: 'post',
        data,
        XMLHttpRequest: true,
    });
}

/**
 * @description: 门户token
 * @return {*}
 */
export function portalTokenApi() {
    return http.request({
        url: PORTAL_TOKEN,
    });
}

/**
 * @description: 学习平台token
 * @return {*}
 */
export function moodleTokenApi(data: MoodleTokenParams) {
   
    return http.request({
        url: MOODLE_TOKEN,
        data,
    });
}

/**
 * @description: 检查是否第一次登录
 * @return {*}
 */
export function checkFirstLoginApi(data: AccessTokenParams) {
    return http.request({
        url: CHECK_FIRST_LOGIN,
        data,
    });
}

/**
 * 登出
 */
export function logout() {
    const moodleToken = useAuthStore().moodleToken;
    return http.request({
        url: `${LOGIN_OUT}/${moodleToken}`,
    });
}

/**
 * @description:
 * @return {*}
 */
export function getPCLoginCodeApi(data:PcLoginCodeParams) {
    return http.request({
        url: GET_PCLOGIN_CODE,
        data
    });
}
/**
 * @description:
 * @return {*}
 */
export function pcLoginApi(data:PcLoginParams) {
    return http.request({
        url: PC_LOGIN,
        method: 'post',
        data,
    });
}

export function getPaymentCodeApi(data:PaymentLoginParams) {
    return http.request({
        url: PAYMENT_LOGIN,
        method: 'post',
        data,
    });
}

/**
 * 登录提示
 */
export function loginInfo() {
    return http.request({
        url: LOGIN_INFO,
    });
}


/**
 * 登录提示
 */
export function getCaptchaImg(capatcaKey:any) {
    return http.request({
        url: `${SSO_SERVER}/captcha/img?capatcaKey=${capatcaKey}`,
        responseType: 'arraybuffer'
    });
}


/**
 * 登录获取手机邮箱号
 */
export function getResetTypes(data:GetResetTypesParams) {
    return http.request({
        url: `${SSO_SERVER}/cipherreset/getResetTypes`,
        data
    });
}

/**
 * 发送验证码
 */
export function sendCode(data:any) {
    return http.request({
        url: `${SSO_SERVER}/wx/portal/sendCode`,
        data
    });
}

/**
 * 修改绑定手机邮箱
 */
export function updatePhoneOrEmail(data:any) {
    return http.request({
        url: `${SSO_SERVER}/wx/portal/updatePhoneOrEmail`,
        data
    });
}

/**
 * 验证密码
 */
export function validRule(data:any) {
    return http.request({
        url: `${SSO_SERVER}/sso/validcharactersstrength`,
        method:'post',
        data
    });
}

/**
 * 第一次登录设置密码
 */
export function updatePassword(data:any) {
    return http.request({
        url: `${SSO_SERVER}/user/updatePassword`,
        data
    });
}
