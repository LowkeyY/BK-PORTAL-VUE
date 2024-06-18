/*
 * @Author: Lowkey
 * @Date: 2023-12-13 18:09:46
 * @LastEditors: Lowkey
 * @LastEditTime: 2024-06-11 10:29:11
 * @FilePath: \BK-Portal-VUE\src\store\modules\auth.ts
 * @Description:
 */

import { defineStore } from 'pinia';
import {
    logout,
    singleSignOnApi,
    portalLoginApi,
    portalTokenApi,
    checkFirstLoginApi,
    moodleTokenApi,
    getCaptchaImg
} from '@/services/login';
import { setStorage } from '@/utils/index';
import { useUserStore } from '@/store/modules/user';
import { StorageEnum } from '@/enums/storageEnum';
import { UserRoleEnums } from '@/enums/appEnum';
import storage from '@/utils/storage';
import { Toast } from '@/utils/uniapi/prompt';
import { router } from '@/router';
import CryptoJS from 'crypto-js';

interface AuthState {
    loading?: boolean;
    isShowCode?: boolean;
    portalToken?: string;
    moodleToken: string;
    userLoginId: string;
    captchaImg?:any;
}

// 加密key
enum EncryptKey {
    KEY = 'f3c28dd72e61f16e173a353405af1fbd',
}
const encryptSHA1 = (word: string) => {
    return CryptoJS.SHA1(word).toString();
};

const encryptMD5 = (word: string) => {
    return CryptoJS.MD5(word).toString();
};
export const useAuthStore = defineStore({
    id: 'auth',
    state: (): AuthState => ({
        loading: false,
        isShowCode:false,
        portalToken: storage.get(StorageEnum.PORTAL_TOKEN) || '',
        moodleToken: storage.get(StorageEnum.MOODLE_TOKEN) || '',
        userLoginId:storage.get(StorageEnum.USER_LOGIN_ID)|| '',
        captchaImg:null
    }),
    getters: {
        loadingState: (state) => state.loading,
    },
    actions: {
        /**
         * @description: 获取验证码
         * @return {*}
         */
        async handleCaptchaImg(payload: CaptchaImgParams): Promise<any> {
            getCaptchaImg(payload).then(res=>{
                const {success,data}=res;
                if(success){
                    if(data){
                        const arrayBuffer = new Uint8Array(data);
                        const base64 = 'data:image/png;base64,'+uni.arrayBufferToBase64(arrayBuffer);
                        this.captchaImg=base64;
                    }
                }
            });
        },
        /**
         * @description: 单点登录
         * @return {*}
         */
        async singleSignOn(payload: SsoParams): Promise<any> {
            this.loading = true;
            const { username, password, } = payload;
            const info = uni.getSystemInfoSync();
            const params = {
                ...payload,
                password: encryptSHA1(password),
                systemType:info.system,
                capathkey:username
            };

            try {
                const { data, message = '请稍后再试', code } = await singleSignOnApi(params);
                if (code === 0) {
                    // 认证成功
                    const { loginId = '', secret = '' } = data;
                    // 保存登录账号和明文密码（密码用于单点登录集成
                    setStorage({
                        [StorageEnum.ACCOUNT]: username,
                        [StorageEnum.CREDENTIAL]: password,
                        [StorageEnum.USER_LOGIN_ID]: loginId,
                    });
                    this.userLoginId=loginId;
                    this.isShowCode=false;
                    // 门户登录
                    this.portalLogin({ username: loginId, password: secret });
                } else if (code === -2) {
                    // 需要验证码
                    this.isShowCode=true;
                    this.handleCaptchaImg(username);
                    this.loading = false;
                    Toast(message);
                } else {
                    this.loading = false;
                    this.isShowCode=false;
                    Toast(message);
                }
            } catch (err: any) {
                this.loading = false;
                return Promise.reject(err);
            }
        },
        /**
         * @description: 门户登录
         * @param {LoginParams} payload
         * @return {*}
         */
        async portalLogin(payload: LoginParams): Promise<any> {
            try {
                const { message = '请稍后再试', code } = await portalLoginApi(payload);
                if (code === 0) {
                    // 获取门户Token
                    this.queryPortalToken();
                } else {
                    this.loading = false;
                    Toast(message);
                }
            } catch (err: any) {
                this.loading = false;
                return Promise.reject(err);
            }
        },
        /**
         * @description: 门户token
         * @return {*}
         */
        async queryPortalToken(): Promise<any> {
            const useUser = useUserStore();
            try {
                const { data, message = '请稍后再试', code } = await portalTokenApi();
                if (code === 0) {
                    this.loading = false;
                    useUser.queryUserRoleApi();
                    this.portalToken = data;
                    setStorage({ [StorageEnum.PORTAL_TOKEN]: data });
                } else {
                    Toast(message);
                    this.loading = false;
                }
            } catch (err: any) {
                this.loading = false;
                return Promise.reject(err);
            }
        },
        /**
         * @description: 校验是否第一次登录
         * @param  {any}
         * @return {*}
         */
        async checkFirstLogin(): Promise<any> {
            const useUser = useUserStore();
            const params = {
                // eslint-disable-next-line camelcase
                access_token: this.portalToken,
            };
            try {
                const { data, message = '请稍后再试', code } = await checkFirstLoginApi(params as AccessTokenParams);
                if (code === 0) {
                    const { firstLogin,userId } = data;
                    if (firstLogin) {
                        // 第一次登录
                        router.push({
                            name: 'firstLogin',
                            params: {userId}
                        });
                    } else {
                        if(useUser.orgCode===UserRoleEnums.BJOU_STUDENT){
                            // 跳转北开学生首页
                            router.replaceAll({
                                name: 'Home',
                            });
                        }else if(useUser.orgCode===UserRoleEnums.OUCHN_STUDENT){
                            router.replaceAll({
                                name: 'OuchnHome',
                            });
                        }else if(useUser.orgCode===UserRoleEnums.BJOU_TEACHER){
                            router.replaceAll({
                                name: 'TeacherHome',
                            });
                        }

                    }
                } else {
                    Toast(message);
                }
            } catch (err: any) {
                return Promise.reject(err);
            }
        },

        /**
         * @description: 学习平台token
         * @return {*}
         */
        async queryMoodleToken(): Promise<any> {
            const userCode = storage.get(StorageEnum.USER_CODE);
            const account = storage.get(StorageEnum.ACCOUNT);
            const loginId = this.userLoginId;
            const queryName = userCode || (loginId.length > 11 ? account : loginId); // 由于测试账号没有学号，保证测试账号能登录
            const params = {
                username: queryName,
                usersn: encryptMD5(`${queryName}${EncryptKey.KEY}`),
            };
           
            try {
                const { token = '', message = '学习平台Tokne获取失败', success } = await moodleTokenApi(params as MoodleTokenParams);
                if (success) {
                    setStorage({ [StorageEnum.MOODLE_TOKEN]: token });
                    this.moodleToken=token;
                } else {
                    Toast(message);
                }
            } catch (err: any) {
                return Promise.reject(err);
            }
        },
        /**
         * @description 登出
         */
        async loginOut(): Promise<any> {
            const useUser = useUserStore();
            const keysToDelete = ['credential', 'portalToken', 'orgCode', 'portalUserId', 'userCode', 'moodleUserId', 'moodleToken', 'userLoginId','portalUserName'];
            await Promise.all(
                keysToDelete.map((key) => {
                    return new Promise((resolve, reject) => {
                        uni.removeStorage({
                            key: key,
                            success: resolve,
                            fail: reject,
                        });
                    });
                })
            );
            try {
                const res = await logout();
                useUser.$reset();
                this.$reset();
                return Promise.resolve(res);
            } catch (err: any) {
                return Promise.reject(err);
            }
        }
    },
});
