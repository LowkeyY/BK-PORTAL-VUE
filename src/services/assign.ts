/*
 * @Author: Lowkey
 * @Date: 2024-03-01 12:53:15
 * @LastEditors: Lowkey
 * @LastEditTime: 2024-06-04 11:10:26
 * @FilePath: \BK-Portal-VUE\src\services\assign.ts
 * @Description: 
 */

import http from '@/utils/request';
import { getBaseUrl } from '@/utils/env';
import { useAuthStore } from '@/store/modules/auth';

const {CUNOVS_SERVER} =getBaseUrl();


const QUERY_ASSIGN = `${CUNOVS_SERVER}/assignment/getInformation`; // 查询作业
const QUERY_ASSIGN_COMMENTS = `${CUNOVS_SERVER}/assignment/getComments`; // 作业评语
const SAVE_ASSIGN = `${CUNOVS_SERVER}/assignment/add`; // 保存作业   
const SUBMIT_ASSIGN = `${CUNOVS_SERVER}/assignment/commit`; // 提交作业
/**
 * @description:查询作业
 * @return {*}
 */
export function queryAssignApi(data:AssignParams) {
    const moodleToken = useAuthStore().moodleToken;
    return http.request({
        url:`${QUERY_ASSIGN}/${moodleToken}`,
        data
    });
}

/**
 * @description:查询作业评语
 * @return {*}
 */
export function queryAssignCommentsApi(data:AssignCommentsParams) {
    const moodleToken = useAuthStore().moodleToken;
    return http.request({
        url:`${QUERY_ASSIGN_COMMENTS}/${moodleToken}`,
        data
    });
}

/**
 * @description:保存作业
 * @return {*}
 */
export function saveAssignApi(data:saveAssignParams) {
    const moodleToken = useAuthStore().moodleToken;
    return http.request({
        url:`${SAVE_ASSIGN}/${moodleToken}`,
        method:'post',
        data
    });
}

/**
 * @description: 提交作业
 * @param {saveAssignParams} data
 * @return {*}
 */
export function submitAssignApi(data:submitAssignParams) {
    const moodleToken = useAuthStore().moodleToken;
    return http.request({
        url:`${SUBMIT_ASSIGN}/${moodleToken}`,
        method:'post',
        data
    });
}