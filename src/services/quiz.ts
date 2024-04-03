/*
 * @Author: Lowkey
 * @Date: 2024-03-26 14:52:53
 * @LastEditors: Lowkey
 * @LastEditTime: 2024-04-03 10:57:45
 * @FilePath: \BK-Portal-VUE\src\services\quiz.ts
 * @Description: 
 */
import http from '@/utils/request';
import { getBaseUrl } from '@/utils/env';
import storage from '@/utils/storage';
import { StorageEnum } from '@/enums/storageEnum';

const {CUNOVS_SERVER} =getBaseUrl();
const moodleToken = storage.get(StorageEnum.MOODLE_TOKEN);

const QUERY_QUIZ = `${CUNOVS_SERVER}/quiz/${moodleToken}`; // 查询测验
const QUERY_QUIZ_PAGE = `${CUNOVS_SERVER}/quiz/page/${moodleToken}`; // 查询上次浏览测验问题 
const QUERY_QUIZ_PAGE_FIRST = `${CUNOVS_SERVER}/quiz/start/${moodleToken}`; // 初次答题查询问题
const QUERY_QUIZ_REVIEW = `${CUNOVS_SERVER}/quiz/review/${moodleToken}`; // 回顾测验
const QUERY_QUIZ_NAVIGATE = `${CUNOVS_SERVER}/quiz/summary/${moodleToken}`; // 查询问题列表
const SAVE_QUIZ = `${CUNOVS_SERVER}/quiz/process/${moodleToken}`; // 保存测验  finishattempt:1 为最终提交

/**
 * @description:查询测验
 * @return {*}
 */
export function queryQuizApi(data:queryQuizParams) {
    return http.request({
        url:`${QUERY_QUIZ}`,
        data
    });
}

/**
 * @description:查询上次浏览测验问题
 * @return {*}
 */
export function queryQuizPageApi(data:queryQuizPageParams) {
    return http.request({
        url:`${QUERY_QUIZ_PAGE}`,
        data
    });
}

/**
 * @description: 查询问题列表
 * @return {*}
 */
export function queryQuizNavigateApi(data:queryQuizNavigateParams) {
    return http.request({
        url:`${QUERY_QUIZ_NAVIGATE}`,
        data
    });
}

/**
 * @description: 
 * @return {*}
 */
export function queryQuizPageFirstTimeApi(data:queryQuizPageParams) {
    return http.request({
        url:`${QUERY_QUIZ_PAGE_FIRST}`,
        data
    });
}

/**
 * @description:查询测验回顾
 * @return {*}
 */
export function queryQuizReviewApi(data:queryQuizReviewParams) {
    return http.request({
        url:`${QUERY_QUIZ_REVIEW}`,
        data
    });
}

/**
 * @description:保存测验
 * @return {*}
 */
export function saveQuizApi(data:saveQuizParams) {
    return http.request({
        url:`${SAVE_QUIZ}`,
        method:'post',
        data
    });
}
