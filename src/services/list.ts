/*
 * @Author: Lowkey
 * @Date: 2024-1-5 12:09:46
 * @LastEditors: Lowkey
 * @LastEditTime: 2024-01-05 13:23:31
 * @FilePath: \BK-Portal-VUE\src\services\list.ts
 * @Description: 
 */


import http from '@/utils/request';
import { getBaseUrl } from '@/utils/env';
import storage from '@/utils/storage';
import { StorageEnum } from '@/enums/storageEnum';

const {CUNOVS_SERVER,PORTAL_SERVER} =getBaseUrl();
const moodleToken = storage.get(StorageEnum.MOODLE_TOKEN);
const moodleUserid = storage.get(StorageEnum.USER_LOGIN_ID);

const TIMETABLE = `${PORTAL_SERVER}/mobile/bkcourse/list`; // 课程表


/**
 * @description: 课程表
 * @return {*}
 */
export function timetableApi() {
    return http.request({
        url:TIMETABLE,
    });
}

