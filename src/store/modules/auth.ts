/*
 * @Author: Lowkey
 * @Date: 2023-12-13 18:09:46
 * @LastEditors: Lowkey
 * @LastEditTime: 2023-12-15 14:22:26
 * @FilePath: \BK-Portal-VUE\src\store\modules\auth.ts
 * @Description: 
 */

import { defineStore } from 'pinia';
import { logout,singleSignOn,portalLogin } from '@/services/login';
import { Toast } from '@/utils/uniapi/prompt';
import CryptoJS from 'crypto-js';

interface AuthState {
    token?: string;
}
const encryptSHA1 = (word:string) => {
    return CryptoJS.SHA1(word).toString();
       
};

const encryptMD5 = (word:string) => {
    return CryptoJS.MD5(word).toString();
};
export const useAuthStore = defineStore({
    id: 'auth',
    state: (): AuthState => ({
        token: undefined,
    }),
    getters: {
        getToken: (state) => state.token,
        isLogin: (state): boolean => !!state.token,
        getAuthorization: (state) => {
            return state.token ? { authorization: `Bearer ${state.token}` } : {};
        },
    },
    actions: {
        /**
         * @description: 
         * @return {*}
         */        
        async singleSignOn(payload:SsoParams): Promise<any> {
            const params = {
                ...payload,
                password:encryptSHA1(payload.password),
            };
           
            try {
                const { data, message= '请稍后再试', code } = await singleSignOn(params);
                if(code===0){
                    // 认证成功
                    const { loginId = '', secret= '' } = data;
                    // 门户登录
                    await portalLogin({username:loginId,password:secret});
                }else if(code===-2){
                    // 需要验证码
                    Toast(message);
                }else {
                    Toast(message);
                }
            } catch (err: any) {
                return Promise.reject(err);
            } finally{
               
            }
        },
        /**
         * @description 登出
         */
        async loginOut(): Promise<any> {
            try {
                const res = await logout();
                return Promise.resolve(res);
            } catch (err: any) {
                return Promise.reject(err);
            }
        },
       
    },
});
