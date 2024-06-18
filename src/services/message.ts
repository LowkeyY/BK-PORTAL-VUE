
/*
 * @Author: Lowkey
 * @Date: 2024-01-17 15:30:05
 * @LastEditors: Lowkey
 * @LastEditTime: 2024-06-12 16:58:18
 * @FilePath: \BK-Portal-VUE\src\services\message.ts
 * @Description: 
 */

import http from '@/utils/request';
import { getBaseUrl } from '@/utils/env';
import { useAuthStore } from '@/store/modules/auth';

const {CUNOVS_SERVER} =getBaseUrl();

const ACTIVITY_MESSAGE = `${CUNOVS_SERVER}/msg/notices`; // 课程活动消息
const PRIVATE_MESSAGE = `${CUNOVS_SERVER}/msg/messageList`; // 课程活动消息
const MESSAGE_CONVERSATION = `${CUNOVS_SERVER}/msg/messages`; // 消息对话
const MESSAGE_SEND = `${CUNOVS_SERVER}/msg/sendmessages`; // 发送消息
/**
 * @description:课程活动消息
 * @return {*}
 */
export function activityMessageApi(data:ActivityMessageParams) {
    const moodleToken = useAuthStore().moodleToken;
    return http.request({
        url:`${ACTIVITY_MESSAGE}/${moodleToken}`,
        data,
    });
}

/**
 * @description:平台私信
 * @return {*}
 */
export function privateMessageApi(data:PrivateMessageParams) {
    const moodleToken = useAuthStore().moodleToken;
    return http.request({
        url:`${PRIVATE_MESSAGE}/${moodleToken}`,
        data,
    });
}

/**
 * @description:消息对话
 * @return {*}
 */
export function getConversationApi(data:MessageConversationParams) {
    const moodleToken = useAuthStore().moodleToken;
    return http.request({
        url:`${MESSAGE_CONVERSATION}/${moodleToken}`,
        data,
    });
}

/**
 * @description:发送消息
 * @return {*}
 */
export function sendConversationApi(data:any) {
    const moodleToken = useAuthStore().moodleToken;
    return http.request({
        url:`${MESSAGE_SEND}/${moodleToken}`,
        method:'post',
        data,
    });
}
