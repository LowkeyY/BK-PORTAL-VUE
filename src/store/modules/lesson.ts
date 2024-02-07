/*
 * @Author: Lowkey
 * @Date: 2024-01-22 15:26:38
 * @LastEditors: Lowkey
 * @LastEditTime: 2024-02-07 17:04:51
 * @FilePath: \BK-Portal-VUE\src\store\modules\lesson.ts
 * @Description: 
 */

import { defineStore } from 'pinia';
import { useUserStore } from '@/store/modules/user';
import { useAppStore } from '@/store/app';
import {courseContentApi} from '@/services/lesson';
import {useSystem} from '@/hooks/app/useSystem';
import { StorageEnum } from '@/enums/storageEnum';
import { Toast } from '@/utils/uniapi/prompt';
import storage from '@/utils/storage';
import { isEmpty } from '@/utils/is';

interface UserState {
    lessonData: Record<string,any>;
   
}
const useUser = useUserStore();
const useApp = useAppStore();
const  findNameByCourses = (course:any[], id:string) => {
  
    let name = '';
    if (id && course.length) {
        const selectedCourse:any = course.filter((c:any) => c.id === id);
        name = selectedCourse.length ? (selectedCourse[0] || {}).fullname : '';
    }
    return name || '';
};
export const useLessonStore = defineStore({
    id: 'lesson',
    state: (): UserState => ({
        lessonData:{}
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
        async queryCourseContent(payload:Record<string,string>): Promise<any> {
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
                const {success,message='请稍后再试',...courseData}= await courseContentApi(params);
                if(success){
                    this.lessonData=courseData;
                }else {
                    Toast(message);
                }
            } catch (err: any) {
                return Promise.reject(err);
            }
        },
    },
});
