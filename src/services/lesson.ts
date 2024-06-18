

import http from '@/utils/request';
import { getBaseUrl } from '@/utils/env';
import { useAuthStore } from '@/store/modules/auth';

const {CUNOVS_SERVER} =getBaseUrl();


/**
 * @description:在开课程
 * @return {*}
 */
export function courseListOpenApi(data:courseListParams) {
    const moodleToken = useAuthStore().moodleToken;
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
    const moodleToken = useAuthStore().moodleToken;
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
    const moodleToken = useAuthStore().moodleToken;
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
    const moodleToken = useAuthStore().moodleToken;
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
    const moodleToken = useAuthStore().moodleToken;
    return http.request({
        url:`${CUNOVS_SERVER}/attendance/course/${moodleToken}`,
        data,
    });
}

export function durationCourseApi(data:AttendanceCourseParams) {
    const moodleToken = useAuthStore().moodleToken;
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
    const moodleToken = useAuthStore().moodleToken;
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
    const moodleToken = useAuthStore().moodleToken;
    return http.request({
        url:`${CUNOVS_SERVER}/cm/completion/${moodleToken}`,
        method:'post',
        data,
    });
}
