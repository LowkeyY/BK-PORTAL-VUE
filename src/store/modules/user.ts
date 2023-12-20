/*
 * @Author: Lowkey
 * @Date: 2023-12-13 18:09:46
 * @LastEditors: Lowkey
 * @LastEditTime: 2023-12-20 14:28:22
 * @FilePath: \BK-Portal-VUE\src\store\modules\user.ts
 * @Description: 
 */
import { defineStore } from 'pinia';
import { useAuthStore } from '@/store/modules/auth';
import { userRoleApi,userInfoApi,portalUserInfoApi } from '@/services/user';
import {setStorage} from '@/utils';
import { StorageEnum } from '@/enums/storageEnum';
import { Toast } from '@/utils/uniapi/prompt';

interface UserState {
    id?: string | number;
}

const useStore = useAuthStore();
export const useUserStore = defineStore({
    id: 'user',
    state: (): UserState => ({}),
    getters: {},
    actions: {
        /**
         * @description: 
         * @return {*}
         */        
        async queryUserRoleApi(): Promise<any> {
          
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
                    setStorage(infos);              
                }else {
                    Toast(message);
                }
            } catch (err: any) {
                return Promise.reject(err);
            }
        },
    },
});
