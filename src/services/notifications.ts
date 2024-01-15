import http from '@/utils/request';
import {getBaseUrl} from '@/utils/env';

const {  PORTAL_SERVER } = getBaseUrl();

/**
 * @description: 通知分类
 * @return {*}
 */
export function informationListCategoryApi(data:any) {
    return http.request({
        url:`${PORTAL_SERVER}/mobile/information/listCategory`,
        data,
    });
}

/**
 * @description: 消息通知列表
 * @return {*}
 */
export function informationListApi(data:any,params:SetPageParams) {
    const {currentPage=1,pageSize=10}=params;
    return http.request({
        url:`${PORTAL_SERVER}/mobile/information/list?currentPage=${currentPage}&pageSize=${pageSize}`,
        method:'post',
        contentType:'application/json;charset=UTF-8',
        data
    });
}

/**
 * @description: 获取消息详情
 * @return {*}
 */
export function getInformationApi(data:any) {
    return http.request({
        url:`${PORTAL_SERVER}/mobile/information/get`,
        data,
    });
}

/**
 * @description: 点击收藏
 * @return {*}
 */
export function informationCollectionApi(data:InformationCollectionData) {
    return http.request({
        url:`${PORTAL_SERVER}/mobile/informationCollection/update`,
        method:'post',
        contentType:'application/json;charset=UTF-8',
        data
    });
}

/**
 * @description: 收藏列表
 * @return {*}
 */
export function informationCollectionListApi(data:any,params:SetPageParams) {
    const {currentPage=1,pageSize=10}=params;
    return http.request({
        url:`${PORTAL_SERVER}/mobile/informationCollection/list?currentPage=${currentPage}&pageSize=${pageSize}`,
        data,
    });
}
