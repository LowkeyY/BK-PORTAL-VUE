import http from '@/utils/request';
import { getBaseUrl } from '@/utils/env';
import { useAuthStore } from '@/store/modules/auth';
import {queryFeedbackParams, queryFeedbackQuestion} from '@/services/model/resource';

const {CUNOVS_SERVER} =getBaseUrl();

const QUERY_FEEDBACK = `${CUNOVS_SERVER}/questionnaire`; 
const QUERY_QUESTION = `${CUNOVS_SERVER}/questionnaire/getquestion`; 
const SUBMIT_QUESTION = `${CUNOVS_SERVER}/questionnaire/submit`; // 提交
const UNFINISHED_QUESTION = `${CUNOVS_SERVER}/questionnaire/unfinished`;
const RESPONSE_QUESTION = `${CUNOVS_SERVER}/questionnaire/response`;

/**
 * @description:查询反馈
 * @return {*}
 */
export function queryFeedbackApi(data:queryFeedbackParams) {
    const moodleToken = useAuthStore().moodleToken;
    return http.request({
        url:`${QUERY_FEEDBACK}/${moodleToken}`,
        data
    });
}


/**
 * @description:反馈问题
 * @return {*}
 */
export function queryFeedbackQuestionApi(data: queryFeedbackQuestion) {
    const moodleToken = useAuthStore().moodleToken;
    return http.request({
        url:`${QUERY_QUESTION}/${moodleToken}`,
        data
    });
}

/**
 * @description:提交反馈问题
 * @return {*}
 */
export function submitFeedbackQuestionApi(data: any) {
    const moodleToken = useAuthStore().moodleToken;
    return http.request({
        url:`${SUBMIT_QUESTION}/${moodleToken}`,
        method: 'post',
        data
    });
}

export function completeFeedbackQuestionApi(data: any) {
    const moodleToken = useAuthStore().moodleToken;
    return http.request({
        url:`${UNFINISHED_QUESTION}/${moodleToken}`,
        method: 'post',
        data
    });
}

/**
 * @description:提交反馈回复
 * @return {*}
 */
export function responseFeedbackQuestionApi(data: any) {
    const moodleToken = useAuthStore().moodleToken;
    return http.request({
        url:`${RESPONSE_QUESTION}/${moodleToken}`,
        data
    });
}
