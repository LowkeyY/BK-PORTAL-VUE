/*
 * @Author: Lowkey
 * @Date: 2024-03-26 14:52:53
 * @LastEditors: Lowkey
 * @LastEditTime: 2024-06-04 11:27:27
 * @FilePath: \BK-Portal-VUE\src\services\quiz.ts
 * @Description: 
 */
import http from '@/utils/request';
import { getBaseUrl } from '@/utils/env';
import { useAuthStore } from '@/store/modules/auth';

const {CUNOVS_SERVER} =getBaseUrl();
const QUERY_QUIZ = `${CUNOVS_SERVER}/quiz`; // 查询测验
const QUERY_QUIZ_PAGE = `${CUNOVS_SERVER}/quiz/page`; // 查询上次浏览测验问题 
const QUERY_QUIZ_PAGE_FIRST = `${CUNOVS_SERVER}/quiz/start`; // 初次答题查询问题
const QUERY_QUIZ_REVIEW = `${CUNOVS_SERVER}/quiz/review`; // 回顾测验
const QUERY_QUIZ_NAVIGATE = `${CUNOVS_SERVER}/quiz/summary`; // 查询问题列表
const SAVE_QUIZ = `${CUNOVS_SERVER}/quiz/process`; // 保存测验  finishattempt:1 为最终提交

/**
 * @description:查询测验
 * @return {*}
 */
export function queryQuizApi(data:queryQuizParams) {
    const moodleToken = useAuthStore().moodleToken;
    return http.request({
        url:`${QUERY_QUIZ}/${moodleToken}`,
        data
    });
}

/**
 * @description:查询上次浏览测验问题
 * @return {*}
 */
export function queryQuizPageApi(data:queryQuizPageParams) {
    const moodleToken = useAuthStore().moodleToken;
    return http.request({
        url:`${QUERY_QUIZ_PAGE}/${moodleToken}`,
        data
    });
}

/**
 * @description: 查询问题列表
 * @return {*}
 */
export function queryQuizNavigateApi(data:queryQuizNavigateParams) {
    const moodleToken = useAuthStore().moodleToken;
    return http.request({
        url:`${QUERY_QUIZ_NAVIGATE}/${moodleToken}`,
        data
    });
}

/**
 * @description: 
 * @return {*}
 */
export function queryQuizPageFirstTimeApi(data:queryQuizPageParams) {
    const moodleToken = useAuthStore().moodleToken;
    return http.request({
        url:`${QUERY_QUIZ_PAGE_FIRST}/${moodleToken}`,
        data
    });
}

/**
 * @description:查询测验回顾
 * @return {*}
 */
export function queryQuizReviewApi(data:queryQuizReviewParams) {
    const moodleToken = useAuthStore().moodleToken;
    return http.request({
        url:`${QUERY_QUIZ_REVIEW}/${moodleToken}`,
        data
    });
}

/**
 * @description:保存测验
 * @return {*}
 */
export function saveQuizApi(data:saveQuizParams) {
    const moodleToken = useAuthStore().moodleToken;
    return http.request({
        url:`${SAVE_QUIZ}/${moodleToken}`,
        method:'post',
        data
    });
}
