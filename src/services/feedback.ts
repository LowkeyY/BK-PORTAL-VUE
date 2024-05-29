import http from '@/utils/request';
import { getBaseUrl } from '@/utils/env';
import storage from '@/utils/storage';
import { StorageEnum } from '@/enums/storageEnum';
import {queryFeedbackParams, queryFeedbackQuestion} from '@/services/model/resource';

const {CUNOVS_SERVER} =getBaseUrl();
const moodleToken = storage.get(StorageEnum.MOODLE_TOKEN);
const QUERY_FEEDBACK = `${CUNOVS_SERVER}/questionnaire/${moodleToken}`; // 查询测验
const QUERY_QUESTION = `${CUNOVS_SERVER}/questionnaire/getquestion/${moodleToken}`; // 查询测验
const SUBMIT_QUESTION = `${CUNOVS_SERVER}/questionnaire/submit/${moodleToken}`; // 提交
const UNFINISHED_QUESTION = `${CUNOVS_SERVER}/questionnaire/unfinished/${moodleToken}`;
const RESPONSE_QUESTION = `${CUNOVS_SERVER}/questionnaire/response/${moodleToken}`;

/**
 * @description:查询反馈
 * @return {*}
 */
export function queryFeedbackApi(data:queryFeedbackParams) {
    return http.request({
        url:`${QUERY_FEEDBACK}`,
        data
    });
}


/**
 * @description:反馈问题
 * @return {*}
 */
export function queryFeedbackQuestionApi(data: queryFeedbackQuestion) {
    return http.request({
        url:`${QUERY_QUESTION}`,
        data
    });
}

/**
 * @description:提交反馈问题
 * @return {*}
 */
export function submitFeedbackQuestionApi(data: any) {
    return http.request({
        url:`${SUBMIT_QUESTION}`,
        method: 'post',
        data
    });
}

export function completeFeedbackQuestionApi(data: any) {
    return http.request({
        url:`${UNFINISHED_QUESTION}`,
        method: 'post',
        data
    });
}

/**
 * @description:提交反馈回复
 * @return {*}
 */
export function responseFeedbackQuestionApi(data: any) {
    return http.request({
        url:`${RESPONSE_QUESTION}`,
        data
    });
}
