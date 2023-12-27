<!--
 * @Author: Lowkey
 * @Date: 2023-12-14 14:43:01
 * @LastEditors: Lowkey
 * @LastEditTime: 2023-12-27 14:56:04
 * @FilePath: \BK-Portal-VUE\src\pages\index\index.vue
 * @Description: 
-->

<template>
    <view class="constainer">
        <logo-header />  
        <view class="grid-container">
            <uni-grid :column="4" :highlight="true" class="grid-box" :show-border="false">
                <uni-grid-item v-for="(item, index) in useApp.getGrids" :key="item.id" :index="index">
                    <view class="grid-item-box" style="background-color: #fff;">
                        <img class="icon" :src="`../../static/images/grids/${item.icon}.svg`" alt="">
                        <text class="text">{{ item.text }}</text>
                    </view>
                </uni-grid-item>
            </uni-grid>
        </view>
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

onMounted(()=>{
    const a  = useApp.getGrids;
    console.log(a);
    init();
});
</script>
<style lang="scss">
.constainer {
  .grid-container {
    background: #fff;
    .grid-item-box {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      flex: 1;
      .icon {
        width: 32px;
      }
      .text {
        margin-top: 20rpx;
        font-size: 26rpx;
        color: $uni-text-color-grey;
      }
    }
  }
  .notice-bar {
    margin-top: $uni-spacing-col-sm;
  }
}

</style>
