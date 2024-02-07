<!--
 * @Author: Lowkey
 * @Date: 2023-12-14 14:43:01
 * @LastEditors: Lowkey
 * @LastEditTime: 2024-01-30 13:19:26
 * @FilePath: \BK-Portal-VUE\src\pages\index\index.vue
 * @Description: 
-->

<template>
    <view class="constainer">
        <logo-header />  
        <Menu :menu-list="grids" @handle-grids-click="handleGridsClick" />
        <view class="notice-bar">
            <uni-list-item show-arrow clickable @click="handleGoMessageCenter">
                <template #body>
                    <view class="content">
                        <image class="icon" src="/static/images/spirit/bell.png" mode="widthFix" />
                        <uni-badge :is-dot="true" :text="noticeCont>0?noticeCont:''" absolute="rightTop" size="small">
                            <view> {{ `您有${noticeCont}条未读消息` }}</view>
                        </uni-badge>
                    </view>
                </template>
            </uni-list-item>
        </view>
        <!-- <uni-section class="mb-10" type="line" title="本周未完成任务" /> -->
        <view class="uni-padding-wrap">
            <uni-segmented-control :current="0" :values="['任务', '待办']" style-type="text" active-color="#2b83d7" />
        </view>
        <pull-refresh-list :loading="loading" :list-data="[]" :has-more="hasMore" :has-more-loading="hasMoreLoading" :is-refresh="isRefresh" @on-refresh="refresh" @load-more="loadMore">
        </pull-refresh-list>
    </view>
</template>
<script setup lang="ts">

import { useUserStore } from '@/store/modules/user';
import { useAuthStore } from '@/store/modules/auth';
import { useAppStore } from '@/store/app';
import {isBjouUser} from '@/utils';
import {messageCountsApi} from '@/services/app';
import {handleGridsClick,handleJumpToPage} from '@/utils/handle';
import useRefreshList from '@/hooks/useRefreshList';
const useUser = useUserStore();
const useAuth = useAuthStore();
const useApp = useAppStore();
const params = reactive({
    searchData:{
    },
    searchApi: messageCountsApi,
});

const { dataState,refresh, loadMore, hasMore, isRefresh,loading ,hasMoreLoading} = useRefreshList(params);
const noticeCont = ref(0);
const grids = computed(()=>useApp.getGrids);

const queryMessageCounts =async ()=>{
    const params = {
        userid:useUser.moodleUserId
    };
    const {success,messageCount=0} = await messageCountsApi(params as MessageCountsParams);
    if(success){
        noticeCont.value=messageCount;
    }
};

const handleGoMessageCenter = ():void=>{
    handleJumpToPage('messageCenter');
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
.uni-padding-wrap {
  background-color: #fff;
}
.constainer {
  .notice-bar {
    margin: $uni-spacing-col-sm 0;
    .content {
      display: flex;
      align-items: center;
      .icon {
        width: 40rpx;
        margin-right: $uni-spacing-col-lg;
      }
    }
  }
}

</style>
