/*
 * @Author: Lowkey
 * @Date: 2023-12-13 18:09:46
 * @LastEditors: Lowkey
 * @LastEditTime: 2024-02-27 17:08:20
 * @FilePath: \BK-Portal-VUE\src\services\app.ts
 * @Description: 
 */


import http from '@/utils/request';
import { getBaseUrl } from '@/utils/env';
import storage from '@/utils/storage';
import { StorageEnum } from '@/enums/storageEnum';

const {PORTAL_SERVER,CUNOVS_SERVER} =getBaseUrl();
const moodleToken = storage.get(StorageEnum.MOODLE_TOKEN);
const userLoginId = storage.get(StorageEnum.USER_LOGIN_ID);

const MODDLE_BASE_INFO = `${CUNOVS_SERVER}/config`; // 学习平台配置数据
const MESSAGE_COUNTS = `${CUNOVS_SERVER}/msg/counts/${moodleToken}`; // 未读消息数
const GRIDS_SORT= `${CUNOVS_SERVER}/config/module/${userLoginId}`; // 菜单模块排序
const SET_GRIDS= `${CUNOVS_SERVER}/config/saveModuleConfig`; // 保存菜单顺序
const PROTAL_FILE_DOEWNLOAD= `${PORTAL_SERVER}/mobile/information/stream/zip`; // 门户附件下载
const PROTAL_ENCLOSURE_DOEWNLOAD= `${PORTAL_SERVER}/file/downloadFile`; // 门户zip文档下载Enclosure
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

/**
 * @description: 未读消息数
 * @param {MessageCountsParams} data
 * @return {*}
 */
export function messageCountsApi(data:MessageCountsParams) {
    return http.request({
        url:MESSAGE_COUNTS,
        data
    });
}

/**
 * @description: 菜单排序
 * @return {*}
 */
export function gridsSortApi() {
    return http.request({
        url:GRIDS_SORT,
    });
}

export function setGridsApi(data:SetGridsParams) {
    return http.request({
        url:SET_GRIDS,
        method:'post',
        data
    });
}

export const portalFileDownload = PROTAL_FILE_DOEWNLOAD;

export const portalEnclosureDownload = PROTAL_ENCLOSURE_DOEWNLOAD;