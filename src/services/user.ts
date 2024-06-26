/*
 * @Author: Lowkey
 * @Date: 2023-12-13 18:09:46
 * @LastEditors: Lowkey
 * @LastEditTime: 2024-06-04 11:29:45
 * @FilePath: \BK-Portal-VUE\src\services\user.ts
 * @Description:
 */


import http from '@/utils/request';
import { getBaseUrl } from '@/utils/env';
import { useAuthStore } from '@/store/modules/auth';
const {PORTAL_SERVER,CUNOVS_SERVER} =getBaseUrl();
const USER_ROLE = `${PORTAL_SERVER}/portal/getOrg`; // 获取登录角色列表
const PORTAL_USER_INFO = `${PORTAL_SERVER}/user/getUser`;  // 获取登录门户用户信息
const USER_INFO = `${PORTAL_SERVER}/mobile/bkuser/get`; // 获取北开学生用户信息
const OUCHN_USER_INFO = `${PORTAL_SERVER}/mobile/studentInfo/findStudentInfo`; // 国开学籍信息
/**
 * @description: 用户角色列表
 * @return {*}
 */
export function userRoleApi() {
    return http.request({
        url:USER_ROLE,
        XMLHttpRequest:true
    });
}

/**
 * @description: // 获取登录门户用户信息
 * @param {AccessTokenParams} data
 * @return {*}
 */
export function portalUserInfoApi(data:AccessTokenParams) {
    return http.request({
        url:PORTAL_USER_INFO,
        data,
        XMLHttpRequest:true
    });
}

/**
 * @description: 获取北开学生用户信息
 * @return {*}
 */
export function userInfoApi() {
    return http.request({
        url:USER_INFO,
        XMLHttpRequest:true
    });
}


/**
 * @description: 获取成员信息
 * @return {*}
 */
export function personInfoApi(data:MessageCountsParams) {
    const moodleToken = useAuthStore().moodleToken;
    return http.request({
        url:`${CUNOVS_SERVER}/personal/${moodleToken}`,
        data
    });
}

/**
 * @description: 添加联系人
 * @return {*}
 */
export function addContactsApi(data:any) {
    const moodleToken = useAuthStore().moodleToken;
    return http.request({
        url:`${CUNOVS_SERVER}/personal/addcontacts/${moodleToken}`,
        method:'post',
        data
    });
}

export function ouchnUserInfoApi() {
    return http.request({
        url:OUCHN_USER_INFO,
    });
}
