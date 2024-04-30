/*
 * @Author: Lowkey
 * @Date: 2024-04-30 14:29:47
 * @LastEditors: Lowkey
 * @LastEditTime: 2024-04-30 15:47:42
 * @FilePath: \BK-Portal-VUE\src\services\ouchn\list.ts
 * @Description: 
 */
import http from '@/utils/request';
import { getBaseUrl } from '@/utils/env';

const {PORTAL_SERVER} =getBaseUrl();

const EXAMINATION_LIST = `${PORTAL_SERVER}/workbench/examscore/listKsdm`; // 课程表
const COURSE_LIST = `${PORTAL_SERVER}/mobile/courseInfo/listAll`; // 课程表
interface examListParams {
    examYear:string
 }
/**
 * @description: 课程表
 * @return {*}
 */
export function queryExamListApi(data:examListParams) {
    return http.request({
        url:EXAMINATION_LIST,
        data
    });
}

export function queryCourseListApi() {
    return http.request({
        url:COURSE_LIST,
    });
}