/*
 * @Author: Lowkey
 * @Date: 2023-12-13 18:09:46
 * @LastEditors: Lowkey
 * @LastEditTime: 2023-12-21 14:21:50
 * @FilePath: \BK-Portal-VUE\src\store\modules\user.ts
 * @Description: 
 */
import { defineStore } from 'pinia';
import { useAuthStore } from '@/store/modules/auth';
import { userRoleApi,userInfoApi,portalUserInfoApi } from '@/services/user';
import {setStorage} from '@/utils';
import { StorageEnum } from '@/enums/storageEnum';
import { Toast } from '@/utils/uniapi/prompt';
import storage from '@/utils/storage';

interface UserState {
    moodleUserId?: string | number;
    portalUserId?: string | number;
    userCode?:string
}


export const useUserStore = defineStore({
    id: 'user',
    state: (): UserState => ({
        moodleUserId:storage.get(StorageEnum.MOODLE_USER_ID)||'',
        portalUserId:storage.get(StorageEnum.PORTAL_USER_ID)||'',
        userCode:storage.get(StorageEnum.USER_CODE)||''
    }),
    getters: {},
    actions: {
        /**
         * @description: 
         * @return {*}
         */        
        async queryUserRoleApi(): Promise<any> {
            const useStore = useAuthStore();
            try {
                const { data=[], message= '请稍后再试', code } = await userRoleApi();
                if(code===0){
                    if(data.length>1){
                        // 多重身份
                        
                    }
                    if(data.length===1){
                        const {orgCode} = data[0];
                        // 保存登录角色
                        setStorage({[StorageEnum.ORG_CODE]:orgCode});
                        useStore.checkFirstLogin();
                    }   
                               
                }else {
                    Toast(message);
                }
            } catch (err: any) {
                return Promise.reject(err);
            }
        },
       
        async queryPortalUserInfoApi(): Promise<any> {
            const useStore = useAuthStore();
            const params = {
                // eslint-disable-next-line camelcase
                access_token:useStore.portalToken
            };
            try {
                const { data=[], message= '请稍后再试', code } = await portalUserInfoApi(params as AccessTokenParams);
                if(code===0){
                    const { userId = '',userCode='',eduUserId='' } = data;
                    const infos = {
                        [StorageEnum.PORTAL_USER_ID]:userId,
                        [StorageEnum.USER_CODE]:userCode,
                        [StorageEnum.MOODLE_USER_ID]:eduUserId,
                    };
                    this.updateState(infos);
                    setStorage(infos);              
                }else {
                    Toast(message);
                }
            } catch (err: any) {
                return Promise.reject(err);
            }
        },
        updateState(payload:Record<string,any>):void{
            this.$state={
                ...this.$state,
                ...payload
            };
        }
    },
});
