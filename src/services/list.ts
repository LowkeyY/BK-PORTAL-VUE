/*
 * @Author: Lowkey
 * @Date: 2024-1-5 12:09:46
 * @LastEditors: Lowkey
 * @LastEditTime: 2024-01-08 15:01:28
 * @FilePath: \BK-Portal-VUE\src\services\list.ts
 * @Description:
 */


import http from '@/utils/request';
import { getBaseUrl } from '@/utils/env';
import storage from '@/utils/storage';
import { StorageEnum } from '@/enums/storageEnum';

const {CUNOVS_SERVER,PORTAL_SERVER} =getBaseUrl();
const moodleToken = storage.get(StorageEnum.MOODLE_TOKEN);
const userCode = storage.get(StorageEnum.USER_CODE);

const TIMETABLE = `${PORTAL_SERVER}/mobile/bkcourse/list`; // 课程表
const GRADE_LIST = `${CUNOVS_SERVER}/grade/courseList/${moodleToken}`; // 我的成绩
const GRADE_DETAILS = `${CUNOVS_SERVER}/grade/${moodleToken}`; // 成绩详情列表
const GRADE_DETAILS_REFRESH = `${CUNOVS_SERVER}/grade/refresh/${moodleToken}`; // 刷新成绩详情列表（从学习平台直接获取数据，不走同步，刷新请求减少学习平台压力）
/**
 * @description: 课程表
 * @return {*}
 */
export function timetableApi() {
    return http.request({
        url:TIMETABLE,
    });
}

/**
 * @description: 我的成绩
 * @param {object} data
 * @return {*}
 */
export function gradeListApi(data:{userid:string} ) {
    return http.request({
        url:GRADE_LIST,
        data
    });
}

/**
 * @description:
 * @param {GradeDetailsParams} data
 * @return {*}
 */
export function gradeDetailsApi(data:GradeDetailsParams) {
    return http.request({
        url:GRADE_DETAILS,
        data
    });
}

/**
 * @description:
 * @param {GradeDetailsParams} data
 * @return {*}
 */
export function gradeDetailsRefreshApi(data:GradeDetailsParams) {
    return http.request({
        url:GRADE_DETAILS_REFRESH,
        data
    });
}


/**
 * @description: 我的小组成员列表
 * @param {object} data
 * @param params
 * @return {*}
 */
export function groupListApi(data:GradeDetailsParams,params:SetPageParams) {
    const {currentPage=1,pageSize=10}=params;
    return http.request({
        url:`${CUNOVS_SERVER}/group/users/${moodleToken}?nowPage=${currentPage}&rowCount=${pageSize}`,
        data
    });
}

/**
 * @description: 我的老师列表
 * @param {object} data
 * @param params
 * @return {*}
 */
export function myTeacherListApi(data:GradeDetailsParams) {
    return http.request({
        url:`${CUNOVS_SERVER}/mentors/${moodleToken}`,
        data
    });
}

/**
 * @description: 我的直播列表
 * @return {*}
 */
export function liveCourseListApi() {
    return http.request({
        url:`${PORTAL_SERVER}/workbench/courseSchedule/list?userId=${userCode}`,
    });
}


/**
 * @description: 我的考勤列表
 * @return {*}
 */
export function attendanceCourseListApi(data:AttendanceCourseParams) {
    return http.request({
        url:`${CUNOVS_SERVER}/attendance/courseList/${moodleToken}`,
        data
    });
}
