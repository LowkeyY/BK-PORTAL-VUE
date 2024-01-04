
import http from '@/utils/request';
import { getBaseUrl } from '@/utils/env';
import storage from '@/utils/storage';
import { StorageEnum } from '@/enums/storageEnum';

const {CUNOVS_SERVER} =getBaseUrl();
const moodleToken = storage.get(StorageEnum.MOODLE_TOKEN);

/**
 * @description:在开课程
 * @return {*}
 */
export function courseListOpenApi(data:courseListParams) {
    return http.request({
        url:`${CUNOVS_SERVER}/courselist/open/${moodleToken}`,
        data,
    });
}

/**
 * @description:已开课程
 * @return {*}
 */
export function courseListDueApi(data:courseListParams) {
    return http.request({
        url:`${CUNOVS_SERVER}/courselist/due/${moodleToken}`,
        data,
    });
}



