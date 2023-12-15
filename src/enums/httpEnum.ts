/*
 * @Author: Lowkey
 * @Date: 2023-12-13 18:09:46
 * @LastEditors: Lowkey
 * @LastEditTime: 2023-12-15 01:10:49
 * @FilePath: \BK-Portal-VUE\src\enums\httpEnum.ts
 * @Description: 
 */

/**
 * @description: 请求结果设置
 */
export enum ResultEnum {
    SUCCESS = 10000,
    FAIL = 10001,
    ERROR = 1,
    TIMEOUT = 401,
    TYPE = 'success',
}

/**
 * @description: contentType
 */
export enum ContentTypeEnum {
    // json
    JSON = 'application/json;charset=UTF-8',
    // form-data qs
    FORM_URLENCODED = 'application/x-www-form-urlencoded',
    // form-data  upload
    FORM_DATA = 'multipart/form-data;charset=UTF-8',
}

