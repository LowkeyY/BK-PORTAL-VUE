/*
 * @Author: Lowkey
 * @Date: 2024-03-19 16:22:20
 * @LastEditors: Lowkey
 * @LastEditTime: 2024-03-20 16:35:49
 * @FilePath: \BK-Portal-VUE\src\services\courseware.ts
 * @Description: 
 */


import http from '@/utils/request';
import { getBaseUrl } from '@/utils/env';

const {RESOURE_SERVER,CUNOVS_SERVER} =getBaseUrl();

const QUERY_INFO = `${RESOURE_SERVER}/content/foreign/playInfo`; // 查询资源
const ADD_INFO = `${RESOURE_SERVER}/content/foreign/addLearnInfo`; //记录播放日志
const UPDATE_FLOW = `${RESOURE_SERVER}/content/foreign/updateUserLearningFlow`; // 更新学习日志
const QUERTY_STATE= `${CUNOVS_SERVER}/course/cmState`;               

/**
 * @description:查询资源
 * @return {*}
 */
export function queryInfoApi(data:coursewareParams) {
    return http.request({
        url:`${QUERY_INFO}`,
        data
    });
}

/**
 * @description:
 * @return {*}
 */
export function addInfoApi(data:addPlayInfoParams) {
    return http.request({
        url:`${ADD_INFO}`,
        method: 'post',
        data
    });
}

export function updateFlowApi(data:upDateFlowParams) {
    return http.request({
        url:`${UPDATE_FLOW}`,
        method: 'put',
        data
    });
}

export function queryStateApi(data:mdlresStateParams) {
    return http.request({
        url:`${QUERTY_STATE}`,
        method: 'post',
        data
    });
}