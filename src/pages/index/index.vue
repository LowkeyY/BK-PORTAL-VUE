<!--
 * @Author: Lowkey
 * @Date: 2023-12-14 14:43:01
 * @LastEditors: Lowkey
 * @LastEditTime: 2024-04-30 16:37:44
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
        <uni-section type="line" title="本周未完成任务" />
        <!-- <view class="uni-padding-wrap">
            <uni-segmented-control :current="0" :values="['本周任务', '我的待办']" style-type="text" active-color="#2b83d7" />
        </view> -->
        <pull-refresh-list :loading="loading" :list-data="dataState.listData" :has-more="hasMore" :has-more-loading="hasMoreLoading" :is-refresh="isRefresh" @on-refresh="refresh" @load-more="loadMore">
            <student-task-list :list="dataState.listData" />
        </pull-refresh-list>
    </view>
    <tab-bar />
</template>
<script setup lang="ts">
import { useUserStore } from '@/store/modules/user';
import { useAuthStore } from '@/store/modules/auth';
import { useAppStore } from '@/store/app';
import {isBjouUser, isOuchnUser} from '@/utils';
import {messageCountsApi} from '@/services/app';
import {studentTaskListApi} from '@/services/list';
import {handleGridsClick,handleJumpToPage} from '@/utils/handle';
import useRefreshList from '@/hooks/useRefreshList';
import StudentTaskList from './components/StudentTaskList.vue';
import { router } from '@/router';

const useUser = useUserStore();
const useAuth = useAuthStore();
const useApp = useAppStore();
const taskParams:any = reactive({
    searchData:{},
    searchApi: studentTaskListApi,
});

const { dataState,refresh,fetchList:fetchTaskList, loadMore, hasMore, isRefresh,loading ,hasMoreLoading} = useRefreshList(taskParams,{immediate:false});
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
    taskParams.searchData={userid:useUser.moodleUserId};
    fetchTaskList(taskParams);
    useApp.queryMoodleBaseInfo();
    useApp.queryGridsSort();
    queryMessageCounts();
};

onShow(()=>{
    if(isOuchnUser()){
        // 国开用户
        router.replace({
            name:'OuchnHome'
        });
        return;
    }
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
