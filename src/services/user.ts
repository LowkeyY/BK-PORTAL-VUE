/*
 * @Author: Lowkey
 * @Date: 2023-12-13 18:09:46
 * @LastEditors: Lowkey
 * @LastEditTime: 2023-12-20 12:20:48
 * @FilePath: \BK-Portal-VUE\src\services\user.ts
 * @Description: 
 */


import http from '@/utils/request';
import { getBaseUrl } from '@/utils/env';

const {SSO_SERVER,PORTAL_SERVER} =getBaseUrl();

const USER_ROLE = `${PORTAL_SERVER}/portal/getOrg`; // 获取登录角色列表
const PORTAL_USER_INFO = `${PORTAL_SERVER}/user/getUser`;  // 获取登录门户用户信息
const USER_INFO = `${PORTAL_SERVER}/mobile/bkuser/get`; // 获取北开学生用户信息

export function userRoleApi() {
    return http.request({
        url:USER_ROLE,
        XMLHttpRequest:true
    });
}

export function portalUserInfoApi(data:AccessTokenParams) {
    return http.request({
        url:PORTAL_USER_INFO,
        data,
        XMLHttpRequest:true
    });
}

export function userInfoApi() {
    return http.request({
        url:USER_INFO,
        XMLHttpRequest:true
    });
}



