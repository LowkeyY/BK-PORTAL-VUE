import {defineStore} from 'pinia';
import storage from '@/utils/storage';
import {StorageEnum} from '@/enums/storageEnum';
import {checkFirstLoginApi, getResetTypes} from '@/services/login';
import {Toast} from '@/utils/uniapi/prompt';


interface ResetState {
    userId?: string;
    resetTypes?:any[];
}
export const useResetStore = defineStore({
    id: 'reset',
    state: (): ResetState => ({
        userId:'',
        resetTypes:[],
    }),
    actions: {
        async queryPhoneAndEmail(): Promise<any> {
            const portalToken= storage.get(StorageEnum.PORTAL_TOKEN);
            const params = {
                'access_token': portalToken
            };
            try {
                const { data, message = '请稍后再试', code } = await checkFirstLoginApi(params);
                if (code === 0) {
                    const { userId } = data;
                    this.userId=userId;
                    const {code:resetCode,data:resetData}=await getResetTypes({userId});
                    if(resetCode===0){
                        this.resetTypes=resetData;
                    }
                } else {
                    Toast(message);
                }
            } catch (err) {
                return Promise.reject(err);
            }
        }
    },
});
