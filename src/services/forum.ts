
import { getBaseUrl } from '@/utils/env';
import { useAuthStore } from '@/store/modules/auth';
import http from '@/utils/request';

const { CUNOVS_SERVER } = getBaseUrl();

/**
 * @description: 查询讨论区资源
 * @param {folderParams} data
 * @return {*}
 */
export function queryForumApi(data: forumParams) {
    const moodleToken = useAuthStore().moodleToken;
    return http.request({
        url: `${CUNOVS_SERVER}/forum/${moodleToken}`,
        data,
    });
}

export function queryForumCommentsApi(data: forumDetailParams) {
    const moodleToken = useAuthStore().moodleToken;
    return http.request({
        url: `${CUNOVS_SERVER}/forum/comments/${moodleToken}`,
        data,
    });
}
export function addForumApi(data: forumData) {
    const moodleToken = useAuthStore().moodleToken;
    return http.request({
        url: `${CUNOVS_SERVER}/forum/add/${moodleToken}`,
        method: 'post',
        data,
    });
}

// 回复
export function postAddApi(data: forumData) {
    const moodleToken = useAuthStore().moodleToken;
    return http.request({
        url: `${CUNOVS_SERVER}/forum/postadd/${moodleToken}`,
        method: 'post',
        data,
    });
}
