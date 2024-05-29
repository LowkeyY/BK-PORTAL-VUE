/*
 * @Author: Lowkey
 * @Date: 2024-05-17 15:24:20
 * @LastEditors: Lowkey
 * @LastEditTime: 2024-05-20 11:44:22
 * @FilePath: \BK-Portal-VUE\src\services\suggestion.ts
 * @Description: 
 */

import http from '@/utils/request';
import storage from '@/utils/storage';
import { getBaseUrl } from '@/utils/env';
import { StorageEnum } from '@/enums/storageEnum';

const { CUNOVS_SERVER } = getBaseUrl();
const userid = storage.get(StorageEnum.MOODLE_USER_ID);
const SUGGESTION_ADD = `${CUNOVS_SERVER}/feedback/add`; // 提交意见反馈
const SUGGESTION_LIST = `${CUNOVS_SERVER}/feedback`; // 反馈列表
const SUGGESTION_DETAIL = `${CUNOVS_SERVER}/feedback/get`; // 查看反馈详情

export function suggestionAddApi(data:Record<string,any>) {
    return http.request({
        url: SUGGESTION_ADD,
        method: 'post',
        data,
    });
}

export function querySuggestionListlApi() {
    return http.request({
        url: `${SUGGESTION_LIST}/${userid}`,

    });
}

export function querySuggestionDetailApi(data:{opinionId:string}) {
    return http.request({
        url: SUGGESTION_DETAIL,
        data,
    });
}

