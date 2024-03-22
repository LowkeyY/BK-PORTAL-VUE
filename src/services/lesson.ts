

import http from '@/utils/request';
import { getBaseUrl } from '@/utils/env';
import storage from '@/utils/storage';
import { StorageEnum } from '@/enums/storageEnum';

const {CUNOVS_SERVER} =getBaseUrl();
const moodleToken = storage.get(StorageEnum.MOODLE_TOKEN);

/**
 * @description:在开课程
 * @return {*}
 */
export function courseListOpenApi(data:courseListParams) {
    return http.request({
        url:`${CUNOVS_SERVER}/courselist/open/${moodleToken}`,
        data,
    });
}

/**
 * @description:已开课程
 * @return {*}
 */
export function courseListDueApi(data:courseListParams) {
    return http.request({
        url:`${CUNOVS_SERVER}/courselist/due/${moodleToken}`,
        data,
    });
}

/**
 * @description:课程内容
 * @return {*}
 */
export function courseContentApi(data: CourseContentParams) {
    return http.request({
        url:`${CUNOVS_SERVER}/course/${moodleToken}`,
        data,
    });
}

/**
 * @description:刷新课程内容
 * @return {*}
 */
export function courseRefreshApi(data: CourseContentParams) {
    return http.request({
        url:`${CUNOVS_SERVER}/course/refresh/${moodleToken}`,
        data,
    });
}

/**
 * @description:课程考勤
 * @return {*}
 */
export function attendanceCourseApi(data:AttendanceCourseParams) {
    return http.request({
        url:`${CUNOVS_SERVER}/attendance/course/${moodleToken}`,
        data,
    });
}

export function durationCourseApi(data:AttendanceCourseParams) {
    return http.request({
        url:`${CUNOVS_SERVER}/duration/course/${moodleToken}`,
        data,
    });
}

/**
 * @description:课程考勤刷新
 * @return {*}
 */
export function attendanceRefreshApi(data:AttendanceCourseParams) {
    return http.request({
        url:`${CUNOVS_SERVER}/attendance/refresh/${moodleToken}`,
        data,
    });
}

/**
 * @description: 标记资源完成
 * @param {completionParams} data
 * @return {*}
 */
export function completionApi(data:completionParams) {
    return http.request({
        url:`${CUNOVS_SERVER}/cm/completion/${moodleToken}`,
        method:'post',
        data,
    });
}
