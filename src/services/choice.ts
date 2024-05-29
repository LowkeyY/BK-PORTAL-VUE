import http from '@/utils/request';
import { getBaseUrl } from '@/utils/env';
import storage from '@/utils/storage';
import { StorageEnum } from '@/enums/storageEnum';
import {queryChoiceParams, submitChoiceParams} from "@/services/model/resource";

const {CUNOVS_SERVER} =getBaseUrl();
const moodleToken = storage.get(StorageEnum.MOODLE_TOKEN);
const QUERY_CHOICE = `${CUNOVS_SERVER}/vote/${moodleToken}`; // 查询投票
const SUBMIT_CHOICE = `${CUNOVS_SERVER}/vote/submit/${moodleToken}`; // 投票

/**
 * @description:查询投票
 * @return {*}
 */
export function queryChoiceApi(data:queryChoiceParams) {
    return http.request({
        url:`${QUERY_CHOICE}`,
        data
    });
}

/**
 * @description:投票
 * @return {*}
 */
export function submitChoiceApi(data:submitChoiceParams) {
    return http.request({
        url:`${SUBMIT_CHOICE}`,
        method: 'post',
        data
    });
}
