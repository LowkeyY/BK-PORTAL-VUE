
import http from '@/utils/request';
import { getBaseUrl } from '@/utils/env';
import { useAuthStore } from '@/store/modules/auth';


const {CUNOVS_SERVER} =getBaseUrl();
const QUERY_CHOICE = `${CUNOVS_SERVER}/vote`; // 查询投票
const SUBMIT_CHOICE = `${CUNOVS_SERVER}/vote/submit`; // 投票

/**
 * @description:查询投票
 * @return {*}
 */
export function queryChoiceApi(data:queryChoiceParams) {
    const moodleToken = useAuthStore().moodleToken;
    return http.request({
        url:`${QUERY_CHOICE}/${moodleToken}`,
        data
    });
}

/**
 * @description:投票
 * @return {*}
 */
export function submitChoiceApi(data:submitChoiceParams) {
    const moodleToken = useAuthStore().moodleToken;
    return http.request({
        url:`${SUBMIT_CHOICE}/${moodleToken}`,
        method: 'post',
        data
    });
}
