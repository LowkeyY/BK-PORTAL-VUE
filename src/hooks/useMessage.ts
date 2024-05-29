/*
 * @Author: Lowkey
 * @Date: 2024-05-20 18:25:18
 * @LastEditors: Lowkey
 * @LastEditTime: 2024-05-20 18:41:53
 * @FilePath: \BK-Portal-VUE\src\hooks\useMessage.ts
 * @Description: 
 */

import { useUserStore } from '@/store/modules/user';
import {messageCountsApi} from '@/services/app';
export default function useMessage(immediate=true) {
    const useUser = useUserStore();
    const totalCount = ref(0);
    const queryMessageCounts =async ()=>{
        const params = {
            userid:useUser.moodleUserId
        };
        const {success,messageCount=0} = await messageCountsApi(params as MessageCountsParams);
        if(success){
            totalCount.value=messageCount;
        }
    };
    immediate && queryMessageCounts();
    return {
        totalCount,
        queryMessageCounts
    };
}