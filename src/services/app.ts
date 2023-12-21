/*
 * @Author: Lowkey
 * @Date: 2023-12-13 18:09:46
 * @LastEditors: Lowkey
 * @LastEditTime: 2023-12-21 14:05:13
 * @FilePath: \BK-Portal-VUE\src\services\app.ts
 * @Description: 
 */


import http from '@/utils/request';
import { getBaseUrl } from '@/utils/env';
import storage from '@/utils/storage';
import { StorageEnum } from '@/enums/storageEnum';

const {CUNOVS_SERVER} =getBaseUrl();
const moodleToken = storage.get(StorageEnum.MOODLE_TOKEN);

const MODDLE_BASE_INFO = `${CUNOVS_SERVER}/config`;
const MESSAGE_COUNTS = `${CUNOVS_SERVER}/msg/counts/${moodleToken}`;

/**
 * @description:学习平台基础信息
 * @return {*}
 */
export function moodleBaseInfoApi(data:MoodleBaseInfoParams) {
    const {token,userId} = data;
    return http.request({
        url:`${MODDLE_BASE_INFO}/${token}/${userId}`,
        data
    });
}

export function messageCountsApi(data:MessageCountsParams) {
   
    return http.request({
        url:MESSAGE_COUNTS,
        data
    });
}





