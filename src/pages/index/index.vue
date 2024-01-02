<!--
 * @Author: Lowkey
 * @Date: 2023-12-14 14:43:01
 * @LastEditors: Lowkey
 * @LastEditTime: 2024-01-02 17:49:32
 * @FilePath: \BK-Portal-VUE\src\pages\index\index.vue
 * @Description: 
-->

<template>
    <view class="constainer">
        <logo-header />  
        <Menu :menu-list="useApp.getGrids" @handle-grids-click="handleGridsClick" />
        <view class="notice-bar">
            <uni-list-item :show-extra-icon="true" show-arrow thumb="/static/images/spirit/bell.png" :title="`您有${noticeCont}条未读消息`" />
        </view>
    </view>
</template>
<script setup lang="ts">

import { useUserStore } from '@/store/modules/user';
import { useAuthStore } from '@/store/modules/auth';
import { useAppStore } from '@/store/app';
import {isBjouUser} from '@/utils';
import {messageCountsApi} from '@/services/app';
import {handleGridsClick} from '@/utils/handle';
const useUser = useUserStore();
const useAuth = useAuthStore();
const useApp = useAppStore();

const noticeCont = ref(0);

const queryMessageCounts =async ()=>{
    const params = {
        userId:useUser.moodleUserId
    };
    const {success,messageCount=0} = messageCountsApi(params as MessageCountsParams);
    if(success){
        noticeCont.value=messageCount;
    }
};
const init =async ()=>{
    await useUser.queryPortalUserInfoApi();
    if(isBjouUser()&&!useAuth.moodleToken){
        // 北开用户请求学习平台Token
        await useAuth.queryMoodleToken();
    }
    useApp.queryMoodleBaseInfo();
    useApp.queryGridsSort();
    queryMessageCounts();
};

onShow(()=>{
    init();
});
</script>
<style lang="scss" scoped>
.constainer {
  .notice-bar {
    margin-top: $uni-spacing-col-sm;
  }
}

</style>
