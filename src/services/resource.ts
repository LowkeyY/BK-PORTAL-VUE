/*
 * @Author: Lowkey
 * @Date: 2024-03-18 13:25:41
 * @LastEditors: Lowkey
 * @LastEditTime: 2024-03-19 16:27:16
 * @FilePath: \BK-Portal-VUE\src\services\resource.ts
 * @Description: 
 */


import http from '@/utils/request';
import { getBaseUrl } from '@/utils/env';
import storage from '@/utils/storage';
import { StorageEnum } from '@/enums/storageEnum';

const {CUNOVS_SERVER} =getBaseUrl();
const moodleToken = storage.get(StorageEnum.MOODLE_TOKEN);

const QUERY_PAGE = `${CUNOVS_SERVER}/page/${moodleToken}`; // 查询网页资源
const QUERY_SVP = `${CUNOVS_SERVER}/svp/${moodleToken}`; // 查询SVP（super class）资源

/**
 * @description:查询网页资源
 * @return {*}
 */
export function queryPageApi(data:pageParams) {
    return http.request({
        url:`${QUERY_PAGE}`,
        data
    });
}

/**
 * @description:查询SVP（super class）资源
 * @return {*}
 */
export function querySvpApi(data:svpParams) {
    return http.request({
        url:`${QUERY_SVP}`,
        data
    });
}
