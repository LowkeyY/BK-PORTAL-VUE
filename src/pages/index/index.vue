<!--
 * @Author: Lowkey
 * @Date: 2023-12-14 14:43:01
 * @LastEditors: Lowkey
 * @LastEditTime: 2024-06-12 18:19:52
 * @FilePath: \BK-Portal-VUE\src\pages\index\index.vue
 * @Description: 
-->

<template>
    <view class="constainer">
        <logo-header />
        <Menu :menu-list="grids" @handle-grids-click="handleGridsClick" />
        <view class="notice-bar">
            <view class="content">
                <view class="notice-item" @click="()=>handleGoMessageCenter('messageCenter')">
                    <image class="icon" src="/static/images/spirit/bell.png" mode="widthFix" />
                    <uni-badge :is-dot="true" :text="totalCount > 0 ? totalCount : ''" absolute="rightTop" size="small">
                        <view>学习平台消息通知</view>
                    </uni-badge>
                </view>
                <view class="notice-item" @click="()=>handleGoMessageCenter('portalMessage')">
                    <image class="icon" src="/static/images/spirit/bell.png" mode="widthFix" />
                    <uni-badge :is-dot="true" :text="totalCount > 0 ? totalCount : ''" absolute="rightTop" size="small">
                        <view>门户消息</view>
                    </uni-badge>
                </view>
            </view>
        </view>
        <uni-section type="line" title="本周未完成任务" />
        <pull-refresh-list
            :loading="loading"
            :list-data="dataState.listData"
            :has-more="hasMore"
            :has-more-loading="hasMoreLoading"
            :is-refresh="isRefresh"
            @on-refresh="refresh"
            @load-more="loadMore"
        >
            <student-task-list :list="dataState.listData" />
        </pull-refresh-list>
    </view>
    <tab-bar />
</template>
<script setup lang="ts">
import { useUserStore } from '@/store/modules/user';
import { useAuthStore } from '@/store/modules/auth';
import { useAppStore } from '@/store/app';
import { isBjouUser, isOuchnUser, isTeacherUser } from '@/utils';
import { studentTaskListApi } from '@/services/list';
import { handleGridsClick, handleJumpToPage } from '@/utils/handle';
import useRefreshList from '@/hooks/useRefreshList';
import StudentTaskList from './components/StudentTaskList.vue';
import useMessage from '@/hooks/useMessage';
import { router } from '@/router';

const useUser = useUserStore();
const useAuth = useAuthStore();
const useApp = useAppStore();
const taskParams: any = reactive({
    searchData: {},
    searchApi: studentTaskListApi,
});

const {
    dataState,
    refresh,
    fetchList: fetchTaskList,
    loadMore,
    hasMore,
    isRefresh,
    loading,
    hasMoreLoading,
} = useRefreshList(taskParams, { immediate: false });
const { queryMessageCounts, totalCount } = useMessage(false);
const grids = computed(() => useApp.getGrids);

const handleGoMessageCenter = (path:string): void => {
    handleJumpToPage(path);
};
const init = async () => {
    await useUser.queryPortalUserInfoApi();
    if (isBjouUser()) {
        // 北开用户请求学习平台Token
        await useAuth.queryMoodleToken();
    }
    taskParams.searchData = { userid: useUser.moodleUserId };
    fetchTaskList(taskParams);
    useApp.queryMoodleBaseInfo();
    useApp.queryGridsSort();
    queryMessageCounts();
};

onShow(() => {
    if (isOuchnUser()) {
        // 国开用户
        router.replace({
            name: 'OuchnHome',
        });
        return;
    }
    if (isTeacherUser()) {
        // 教师用户
        router.replace({
            name: 'TeacherHome',
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
    margin: $uni-spacing-col-base;
    .content {
      display: flex;
      align-items: center;
      justify-content: space-around;
      .notice-item {
        display: flex;
        flex-basis: 48%;
        align-items: center;
        background-color: #fff;
        padding: $uni-list-padding;
        font-size: $uni-font-size-base;
        .icon {
          width: 40rpx;
          margin-right: $uni-spacing-col-lg;
        }
      }
    }
  }
}
</style>
