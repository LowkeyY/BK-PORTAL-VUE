/*
 * @Author: Lowkey
 * @Date: 2023-12-13 18:09:46
 * @LastEditors: Lowkey
 * @LastEditTime: 2023-12-20 11:54:05
 * @FilePath: \BK-Portal-VUE\src\services\login.ts
 * @Description:
 */

import http from '@/utils/request';
import { getBaseUrl } from '@/utils/env';
import storage from '@/utils/storage';
import { StorageEnum } from '@/enums/storageEnum';

const { SSO_SERVER, PORTAL_SERVER, CUNOVS_SERVER } = getBaseUrl();
const moodleToken = storage.get(StorageEnum.MOODLE_TOKEN);
const SSO = `${PORTAL_SERVER}/sso`; // !!!!!!!!!!!!!!!!!!!!!!!!单点登录sso接口 PORTAL_SERVER !!!!!!!!!!!!!!!
const LOGIN = `${PORTAL_SERVER}/login`;
const PORTAL_TOKEN = `${PORTAL_SERVER}/oauth/userToken`;
const CHECK_FIRST_LOGIN = `${SSO_SERVER}/current`;
const MOODLE_TOKEN = `${CUNOVS_SERVER}/config/getBkUser`;
const LOGIN_OUT = `/logout/${moodleToken}`;

/**
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
    return http.request({
        url: LOGIN_OUT,
    });
}
