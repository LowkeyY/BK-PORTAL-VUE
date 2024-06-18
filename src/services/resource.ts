/*
 * @Author: Lowkey
 * @Date: 2024-03-18 13:25:41
 * @LastEditors: Lowkey
 * @LastEditTime: 2024-06-04 11:28:44
 * @FilePath: \BK-Portal-VUE\src\services\resource.ts
 * @Description: 
 */


import http from '@/utils/request';
import { getBaseUrl } from '@/utils/env';
import { useAuthStore } from '@/store/modules/auth';

const {CUNOVS_SERVER} =getBaseUrl();

const QUERY_PAGE = `${CUNOVS_SERVER}/page`; // 查询网页资源
const QUERY_SVP = `${CUNOVS_SERVER}/svp`; // 查询SVP（super class）资源
const QUERY_FOLDER = `${CUNOVS_SERVER}/folder/list`; // 查询文件资源
/**
 * @description:查询网页资源
 * @return {*}
 */
export function queryPageApi(data:pageParams) {
    const moodleToken = useAuthStore().moodleToken;
    return http.request({
        url:`${QUERY_PAGE}/${moodleToken}`,
        data
    });
}

/**
 * @description:查询SVP（super class）资源
 * @return {*}
 */
export function querySvpApi(data:svpParams) {
    const moodleToken = useAuthStore().moodleToken;
    return http.request({
        url:`${QUERY_SVP}/${moodleToken}`,
        data
    });
}

/**
 * @description: 查询文件资源
 * @param {folderParams} data
 * @return {*}
 */
export function queryFolderApi(data:folderParams) {
    const moodleToken = useAuthStore().moodleToken;
    return http.request({
        url:`${QUERY_FOLDER}/${moodleToken}`,
        data
    });
}