/* eslint-disable camelcase */
/*
 * @Author: Lowkey
 * @Date: 2023-12-13 18:09:46
 * @LastEditors: Lowkey
 * @LastEditTime: 2024-03-13 12:07:27
 * @FilePath: \BK-Portal-VUE\src\store\app.ts
 * @Description: 
 */

import { defineStore } from 'pinia';
import { moodleBaseInfoApi,gridsSortApi,setGridsApi } from '@/services/app';
import { pcLoginApi,getPCLoginCodeApi,getPaymentCodeApi } from '@/services/login';
import { StorageEnum } from '@/enums/storageEnum';
import { Toast ,Loading,HideLoading} from '@/utils/uniapi/prompt';
import { useOpenUrl } from '@/hooks/useOpenUrl';
import {urlEncode} from '@/utils';
// import {exceScript} from '@/utils/handle';
import { isArray } from '@/utils/is';
import { bkStudentGirds,moreGird,oauthUrl } from '@/utils/constants';
import storage from '@/utils/storage';
interface AppState {
    courseid: string ;
    courseData:any[];
    courseIdNumbers:any[];
    _useJavaScriptMessage:Record<string,string>;
    groups:any[],
    contacts:any[],
    gridsSort:string,
}

const getCourseId = (arr: any[]) => {
    const res:any[] = [];
    arr && arr.map(item => (
        res.push(item.id)
    ));
    return res.join(',');
};
const getGroups = (arr = [], course: any[]) => {
    let obj:any = {};
    arr.map((item:any) => {
        obj = course.find(data => {
            return data.id === item.courseid;
        });
        item.course = obj.fullname;
    });
    return arr;
};

const  getContats = (obj:any = {}) => [...obj.online, ...obj.offline];
export const useAppStore = defineStore({
    id: 'app-store',
    state: (): AppState => ({
        courseid:'',
        courseData:[],
        courseIdNumbers:[],
        _useJavaScriptMessage:{},
        groups:[],
        contacts:[],
        gridsSort:storage.get(StorageEnum.GRIDS_SORT) || '1,2,3,4,5,6,7',
    }),
    getters: {
        getGrids:(state):any[]=>{
            // 按顺序返回grids
            const arr: any[] = [];
            const sortStr = state.gridsSort;
            isArray(sortStr.split(',')) && sortStr.split(',')
                .map((item:string) => {
                    arr.push(
                        bkStudentGirds.find(ev => ev.id === item)
                    );
                });
            return [...arr,moreGird];
        }
    },
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
                    // appendConfig !!!未更新到state 见react项目源码
                }else {
                   
                    Toast(message);
                }
            } catch (err: any) {
               
                return Promise.reject(err);
            }
        },
        async queryGridsSort():Promise<any>{
            try {
                const {data,success,msg} = await gridsSortApi();
                if(success){
                    const {userConfig} = data;
                    this.gridsSort = userConfig;
                    storage.set(StorageEnum.GRIDS_SORT,userConfig);
                }else{
                    Toast(msg);
                }
            } catch (err: any) {
                return Promise.reject(err);
            }
        },
        async setGrids(params:SetGridsParams,callback:()=>void):Promise<any>{
            try {
                const {userConfig} = params;
                const {success,msg} = await setGridsApi(params);
                if(success){
                    this.gridsSort = userConfig;
                    storage.set(StorageEnum.GRIDS_SORT,userConfig);
                    Toast('保存成功');
                    callback();
                }else{
                    Toast(msg);
                }
            } catch (err: any) {
                return Promise.reject(err);
            }
        },
        /**
         * @description: 模拟pc登录实现单点登录集成
         * @param {string} appType
         * @return {*}
         */        
        async getPCLoginCode(appType:string):Promise<any>{
            const credential=  storage.get(StorageEnum.CREDENTIAL);
            const params:PcLoginCodeParams = {
                credential,
                _t:new Date().getTime()
            };
            try {
                Loading('正在打开...');
                const {data,success,msg} = await getPCLoginCodeApi(params);
                if(success){
                    this.pcLogin({password:data,appType});
                }else{
                    Toast(msg);
                    HideLoading();
                }
            } catch (err: any) {
                return Promise.reject(err);
            }finally{
                HideLoading();
            }
        },
        async pcLogin(data:Record<string,any>):Promise<any>{
            const {password,appType}= data;
            const params:PcLoginParams = {
                username: storage.get(StorageEnum.USER_CODE),
                password,
                loginMode: 'PasswordLogin',
            };
            try {
                const {success} = await pcLoginApi(params);
                if(success){
                    useOpenUrl(oauthUrl[appType]);
                }
            } catch (err: any) {
                return Promise.reject(err);
            }
        },
        /**
         * @description: 缴费系统集成
         * @return {*}
         */        
        async getPaymentCode():Promise<any>{
            const head = {
                version: 'V1.0',
                charset: 'UTF-8',
                channel_id: urlEncode('202106180006'),
                datetime: urlEncode(new Date().getTime()),
                sign_type: 'SHA256WithRSA'
            };
            const userCode = {
                user_code: storage.get(StorageEnum.USER_CODE)
            };
            const params= {
                head: JSON.stringify(head),
                data: JSON.stringify(userCode)
            };
            try {
                const {success,sign} = await getPaymentCodeApi(params);
                if(success){
                    const { head: paramHead, data } = params;
                    const url = encodeURI(`${oauthUrl.payment}?head=${paramHead}&data=${data}&sign=${sign}`);
                    useOpenUrl(url);
                }
            } catch (err: any) {
                return Promise.reject(err);
            }
        }
    },
});
