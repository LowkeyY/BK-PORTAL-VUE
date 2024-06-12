import http from '@/utils/request';
import { getBaseUrl } from '@/utils/env';
import storage from '@/utils/storage';
import { StorageEnum } from '@/enums/storageEnum';

const {CUNOVS_SERVER} =getBaseUrl();
const moodleToken = storage.get(StorageEnum.MOODLE_TOKEN);

const ACTIVITY_MESSAGE = `${CUNOVS_SERVER}/msg/notices/${moodleToken}`; // 课程活动消息
const PRIVATE_MESSAGE = `${CUNOVS_SERVER}/msg/messageList/${moodleToken}`; // 课程活动消息
const MESSAGE_CONVERSATION = `${CUNOVS_SERVER}/msg/messages/${moodleToken}`; // 消息对话
const MESSAGE_SEND = `${CUNOVS_SERVER}/msg/sendmessages/${moodleToken}`; // 发送消息

/**
 * @description:课程活动消息
 * @return {*}
 */
export function activityMessageApi(data:ActivityMessageParams) {
    return http.request({
        url:ACTIVITY_MESSAGE,
        data,
    });
}

/**
 * @description:平台私信
 * @return {*}
 */
export function privateMessageApi(data:PrivateMessageParams) {
    return http.request({
        url:PRIVATE_MESSAGE,
        data,
    });
}

/**
 * @description:消息对话
 * @return {*}
 */
export function getConversationApi(data:MessageConversationParams) {
    return http.request({
        url:MESSAGE_CONVERSATION,
        data,
    });
}

/**
 * @description:发送消息
 * @return {*}
 */
export function sendConversationApi(data:any) {
    return http.request({
        url:MESSAGE_SEND,
        method:'post',
        data,
    });
}
