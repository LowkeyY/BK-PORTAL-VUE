import { getBaseUrl } from '@/utils/env';
import storage from '@/utils/storage';
import { StorageEnum } from '@/enums/storageEnum';
import http from '@/utils/request';

const { CUNOVS_SERVER } = getBaseUrl();
const moodleToken = storage.get(StorageEnum.MOODLE_TOKEN);

/**
 * @description: 查询讨论区资源
 * @param {folderParams} data
 * @return {*}
 */
export function queryForumApi(data: forumParams) {
    return http.request({
        url: `${CUNOVS_SERVER}/forum/${moodleToken}`,
        data,
    });
}

export function queryForumCommentsApi(data: forumDetailParams) {
    return http.request({
        url: `${CUNOVS_SERVER}/forum/comments/${moodleToken}`,
        data,
    });
}
export function addForumApi(data: forumData) {
    return http.request({
        url: `${CUNOVS_SERVER}/forum/add/${moodleToken}`,
        method: 'post',
        data,
    });
}

// 回复
export function postAddApi(data: forumData) {
    return http.request({
        url: `${CUNOVS_SERVER}/forum/postadd/${moodleToken}`,
        method: 'post',
        data,
    });
}
