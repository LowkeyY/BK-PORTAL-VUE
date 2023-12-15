/*
 * @Author: Lowkey
 * @Date: 2023-12-13 18:09:46
 * @LastEditors: Lowkey
 * @LastEditTime: 2023-12-15 14:22:19
 * @FilePath: \BK-Portal-VUE\src\services\login.ts
 * @Description: 
 */


import http from '@/utils/request';
import { getBaseUrl } from '@/utils/env';

const {SSO_SERVER,PORTAL_SERVER} =getBaseUrl();

const SSO = `${PORTAL_SERVER}/sso`; // !!!!!!!!!!!!!!!!!!!!!!!!!!!单点登录sso接口 PORTAL_SERVER 
const LOGIN = `${PORTAL_SERVER}/login`;
const LOGIN_OUT = '/logout';



/**
 * sso单点登录
 * @param params
 */
export function singleSignOn(data:SsoParams) {
    return http.request({
        url:SSO,
        method:'post',
        data,
    });
}

/**
 * 门户登录
 * @param params
 */
export function portalLogin(data: LoginParams) {
    return http.request({
        url:LOGIN,
        method:'post',
        data,
        XMLHttpRequest:true
    });
}

/**
 * 登出
 */
export function logout() {
    return http.request({
        url:LOGIN_OUT,
    });
}

