/*
 * @Author: Lowkey
 * @Date: 2023-12-13 18:09:46
 * @LastEditors: Lowkey
 * @LastEditTime: 2023-12-20 14:14:44
 * @FilePath: \BK-Portal-VUE\src\services\app.ts
 * @Description: 
 */


import http from '@/utils/request';
import { getBaseUrl } from '@/utils/env';

const {CUNOVS_SERVER} =getBaseUrl();

const MODDLE_BASE_INFO = `${CUNOVS_SERVER}/config`;

/**
 * @description:学习平台集成信息
 * @return {*}
 */
export function moodleBaseInfoApi(data:MoodleBaseInfoParams) {
    const {token,userId} = data;
    return http.request({
        url:`${MODDLE_BASE_INFO}/${token}/${userId}`,
        data
    });
}

/**
 * sso单点登录
 * @param params
 */
// export function singleSignOnApi(data:SsoParams) {
//     return http.request({
//         url:SSO,
//         method:'post',
//         data,
//     });
// }





