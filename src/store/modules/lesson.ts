/*
 * @Author: Lowkey
 * @Date: 2024-01-22 15:26:38
 * @LastEditors: Lowkey
 * @LastEditTime: 2024-04-26 18:51:16
 * @FilePath: \BK-Portal-VUE\src\store\modules\lesson.ts
 * @Description:
 */

import { defineStore } from 'pinia';
import { useUserStore } from '@/store/modules/user';
import { useAppStore } from '@/store/app';
import {attendanceCourseApi, attendanceRefreshApi, courseContentApi,courseRefreshApi, durationCourseApi} from '@/services/lesson';
import {useSystem} from '@/hooks/app/useSystem';
import { Toast } from '@/utils/uniapi/prompt';
import { isEmpty } from '@/utils/is';
import {findNameByCourses} from '@/utils';

interface UserState {
    lessonData: Record<string,any>;
    attendanceData:Record<string,any>;
    loading:boolean;
    collapseActiveIndex:string[];
    courseid:string
}

export const useLessonStore = defineStore({
    id: 'lesson',
    state: (): UserState => ({
        lessonData:{},
        attendanceData:{},
        loading:false,
        collapseActiveIndex:['0'],
        courseid:''
    }),
    getters: {
        getTourContent:(state)=>{
            const {lessonData} =state;
            if(!isEmpty(lessonData as {})){
                return lessonData.contents[0]?.modules||[];
            }
            return [];
        },
        getTourSummary:(state)=>{
            const {lessonData} =state;
            if(!isEmpty(lessonData as {})){
                return lessonData.contents[0].summary;
            }
            return '';
        },
        getTeachers:(state)=>{
            const {lessonData} =state;
            if(!isEmpty(lessonData as {})){
                return {
                    master:lessonData.master||[],
                    tutor:lessonData.tutor||[]
                };
            }
            return {
                master:[],
                tutor:[]
            };
        },
        getLessonResource:(state)=>{
            const {lessonData} =state;
            if(!isEmpty(lessonData as {})){
                return lessonData.contents.slice(1);
            }
            return [];
        },
    },
    actions: {
        async queryCourseContent(payload:Record<string,string>,isRefresh?:boolean): Promise<any> {
            const useUser = useUserStore();
            const useApp = useAppStore();
            if(!isRefresh) {
                this.loading=true;
            }
            const courseData = useApp.courseData;
            const {courseid=''} = payload;
            const coursename = findNameByCourses(courseData, courseid);
            const devicetype = useSystem().uniPlatform;
            const params:CourseContentParams = {
                courseid,
                userid:useUser.moodleUserId,
                coursename,
                userfullname:useUser.portalUserName,
                username:useUser.userCode,
                devicetype
            };
            try {
                const {success,message='请稍后再试',...courseData}=isRefresh?await courseRefreshApi(params):  await courseContentApi(params);
                if(success){
                    this.lessonData=courseData;
                    this.collapseActiveIndex=[String(courseData.activityIndex)];
                }else {
                    Toast(message);
                }
            } catch (err: any) {
                return Promise.reject(err);
            }finally{
                this.loading=false;
            }
        },
        async queryAttendanceCourse(payload:Record<string,string>): Promise<any> {
            const useUser = useUserStore();
            const {courseid=''} = payload;
            const params:AttendanceCourseParams = {
                courseid,
                userid:useUser.moodleUserId,
            };
            try {
                const res=await attendanceCourseApi(params);
                if(res.success){
                    this.attendanceData=res;
                }
            } catch (err: any) {
                return Promise.reject(err);
            }
        },
        async queryDurationCourse(payload:Record<string,string>): Promise<any> {
            const useUser = useUserStore();
            const {courseid=''} = payload;
            const params:AttendanceCourseParams = {
                courseid,
                userid:useUser.moodleUserId,
            };
            try {
                const res= await durationCourseApi(params);
                if(res.success){
                    this.attendanceData=res;
                }
            } catch (err: any) {
                return Promise.reject(err);
            }
        },
        async queryAttendanceRefresh(payload:Record<string,string>): Promise<any> {
            const useUser = useUserStore();
            const {courseid=''} = payload;
            const params:AttendanceCourseParams = {
                courseid,
                userid:useUser.moodleUserId,
            };
            try {
                const res= await attendanceRefreshApi(params);
                if(res.success){
                    this.attendanceData=res;
                }
            } catch (err: any) {
                return Promise.reject(err);
            }
        },
            
        async updateStatus(): Promise<any> {
            if(isEmpty(this.lessonData as {})) return; // 如果是初次加载数据不请求；
            const useUser = useUserStore();
            const useApp = useAppStore();
            const courseData = useApp.courseData;
            const coursename = findNameByCourses(courseData, this.courseid);
            const devicetype = useSystem().uniPlatform;
            const params:CourseContentParams = {
                courseid:this.courseid,
                userid:useUser.moodleUserId,
                coursename,
                userfullname:useUser.portalUserName,
                username:useUser.userCode,
                devicetype
            };
            try {
                const {success,message='请稍后再试',...courseData}=await courseRefreshApi(params);
                if(success){
                    this.lessonData={ // 视图仅更新资源
                        ...this.lessonData,
                        contents:courseData.contents
                    };
                }else {
                    Toast(message);
                }
            } catch (err: any) {
                return Promise.reject(err);
            }finally{
                this.loading=false;
            }
        },
    },
});
