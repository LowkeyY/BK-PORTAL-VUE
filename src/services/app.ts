/*
 * @Author: Lowkey
 * @Date: 2023-12-13 18:09:46
 * @LastEditors: Lowkey
 * @LastEditTime: 2024-01-02 15:11:29
 * @FilePath: \BK-Portal-VUE\src\services\app.ts
 * @Description: 
 */


import http from '@/utils/request';
import { getBaseUrl } from '@/utils/env';
import storage from '@/utils/storage';
import { StorageEnum } from '@/enums/storageEnum';

const {CUNOVS_SERVER} =getBaseUrl();
const moodleToken = storage.get(StorageEnum.MOODLE_TOKEN);
const userLoginId = storage.get(StorageEnum.USER_LOGIN_ID);

const MODDLE_BASE_INFO = `${CUNOVS_SERVER}/config`; // 学习平台配置数据
const MESSAGE_COUNTS = `${CUNOVS_SERVER}/msg/counts/${moodleToken}`; // 未读消息数
const  GRIDS_SORT= `${CUNOVS_SERVER}/config/module/${userLoginId}`; // 菜单模块排序
const  SET_GRIDS= `${CUNOVS_SERVER}/config/saveModuleConfig`; 
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

