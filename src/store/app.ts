/*
 * @Author: Lowkey
 * @Date: 2023-12-13 18:09:46
 * @LastEditors: Lowkey
 * @LastEditTime: 2023-12-20 14:31:23
 * @FilePath: \BK-Portal-VUE\src\store\app.ts
 * @Description: 
 */
import { defineStore } from 'pinia';
import { moodleBaseInfoApi } from '@/services/app';
import { StorageEnum } from '@/enums/storageEnum';
import { Toast } from '@/utils/uniapi/prompt';
import {exceScript} from '@/utils/handle';
import storage from '@/utils/storage';
interface AppState {
    courseid: string ;
    courseData:any[];
    courseIdNumbers:any[];
    _useJavaScriptMessage:Record<string,string>;
    groups:any[],
    contacts:any[],
}
const getCourseId = (arr: any[]) => {
    const res:any[] = [];
    arr && arr.map(item => (
        res.push(item.id)
    ));
    return res.join(',');
};
const getGroups = (arr = [], course: any[]) => {
    let obj = {};
    arr.map((item, i) => {
        obj = course.find(data => {
            return data.id === item.courseid;
        });
        item.course = obj.fullname;
    });
    return arr;
};

const  getContats = (obj = {}) => [...obj.online, ...obj.offline];
export const useAppStore = defineStore({
    id: 'app-store',
    state: (): AppState => ({
        courseid:'',
        courseData:[],
        courseIdNumbers:[],
        _useJavaScriptMessage:{},
        groups:[],
        contacts:[]
    }),
    getters: {},
    actions: {
        async queryMoodleBaseInfo(): Promise<any> {
            const params = {
                token:storage.get(StorageEnum.MOODLE_TOKEN),
                userId:storage.get(StorageEnum.MOODLE_USER_ID),
            };
            try {
                const {_configFunction,_useJavaScriptMessage,contacts,courseIdNumbers,courses,groups,message,success} = await moodleBaseInfoApi(params);
                if(success){
                    if(_configFunction){
                        // 执行脚本 似乎不需要
                        // exceScript(_configFunction||'');
                    }
                    this.courseid = getCourseId(courses);
                    this.courseData = courses;
                    this.courseIdNumbers = courseIdNumbers;
                    this.groups=getGroups(groups, courses);
                    this.contacts= getContats(contacts);
                    this._useJavaScriptMessage=_useJavaScriptMessage || {
                        info: '该门课程部分内容不支持app访问，如遇提示请换用电脑登录elearning.bjou.edu.cn。',
                        warn: ':该内容暂不支持移动端显示，请在电脑端完成学习。'
                    };
                  
                }else {
                   
                    Toast(message);
                }
            } catch (err: any) {
               
                return Promise.reject(err);
            }
        }
    },
});
