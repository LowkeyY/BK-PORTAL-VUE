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
