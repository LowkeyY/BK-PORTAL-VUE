/*
 * @Author: Lowkey
 * @Date: 2024-03-26 14:52:53
 * @LastEditors: Lowkey
 * @LastEditTime: 2024-03-26 14:53:33
 * @FilePath: \BK-Portal-VUE\src\services\quiz.ts
 * @Description: 
 */
import http from '@/utils/request';
import { getBaseUrl } from '@/utils/env';
import storage from '@/utils/storage';
import { StorageEnum } from '@/enums/storageEnum';

const {CUNOVS_SERVER} =getBaseUrl();
const moodleToken = storage.get(StorageEnum.MOODLE_TOKEN);

const QUERY_ASSIGN = `${CUNOVS_SERVER}/assignment/getInformation/${moodleToken}`; // 查询作业
const QUERY_ASSIGN_COMMENTS = `${CUNOVS_SERVER}/assignment/getComments/${moodleToken}`; // 作业评语
const SAVE_ASSIGN = `${CUNOVS_SERVER}/assignment/add/${moodleToken}`; // 保存作业   
const SUBMIT_ASSIGN = `${CUNOVS_SERVER}/assignment/commit/${moodleToken}`; // 提交作业
/**
 * @description:查询作业
 * @return {*}
 */
export function queryAssignApi(data:AssignParams) {
    return http.request({
        url:`${QUERY_ASSIGN}`,
        data
    });
}

/**
 * @description:查询作业评语
 * @return {*}
 */
export function queryAssignCommentsApi(data:AssignCommentsParams) {
    return http.request({
        url:`${QUERY_ASSIGN_COMMENTS}`,
        data
    });
}

/**
 * @description:保存作业
 * @return {*}
 */
export function saveAssignApi(data:saveAssignParams) {
    return http.request({
        url:`${SAVE_ASSIGN}`,
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
    return http.request({
        url:`${SUBMIT_ASSIGN}`,
        method:'post',
        data
    });
}