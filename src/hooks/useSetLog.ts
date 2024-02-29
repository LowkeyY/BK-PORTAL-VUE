/*
 * @Author: Lowkey
 * @Date: 2024-01-22 16:55:16
 * @LastEditors: Lowkey
 * @LastEditTime: 2024-02-27 19:19:15
 * @FilePath: \BK-Portal-VUE\src\hooks\useSetLog.ts
 * @Description: 记录浏览日志
 */

import http from '@/utils/request';
import { getBaseUrl } from '@/utils/env';
import { useUserStore } from '@/store/modules/user';

interface LogParams {
    assesstime?:string|number,
    courseid:string,
    cmid?:string,
    type:string,
    modname?:string,
    userid?:string
}
interface CourseLogParams {
    courseid:string,
}

const CODE = 'b74728220064ba6cdb0403b1bf8e5524';
const {CUNOVS_SERVER} =getBaseUrl();
const SET_LOG = `${CUNOVS_SERVER}/log`;
const SET_COURSE_RECORD_LOG = `${CUNOVS_SERVER}/courseUserLogs/record/logs`;

export const useSetLog = () => {
  
    const useUser = useUserStore();
    const defaults = {
        cmid:'',
        modname:'',
        assesstime:new Date().getTime(),
        userid:useUser.moodleUserId
    };
    const setLog = (params:LogParams) =>{
        http.post(SET_LOG,{...defaults,...params});
    };
    const setCourseRecordLog = (params:CourseLogParams) =>{
        http.post(`${SET_COURSE_RECORD_LOG}/${CODE}`,{...params,userid:useUser.moodleUserId});
    };
    return {
        setLog,
        setCourseRecordLog
    };
};
