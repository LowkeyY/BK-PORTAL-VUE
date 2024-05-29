<!--
 * @Author: Lowkey
 * @Date: 2024-05-13 16:56:46
 * @LastEditors: Lowkey
 * @LastEditTime: 2024-05-29 19:17:56
 * @FilePath: \BK-Portal-VUE\src\pageTeacher\moodle\index.vue
 * @Description: 
-->

<template>
    <view>
        <logo-header class="logo" />
        <!-- <Menu :menu-list="teacherGirds" :column="3" @handle-grids-click="handleGridsClick" /> -->
        <view class="grid-container">
            <uni-grid :column="3" :show-border="false" :highlight="true" :square="false">
                <uni-grid-item v-for="(item, index) in teacherGirds" :key="item.id" :index="index" @click="() => handleGridsClick(item)">
                    <view class="grid-item-box">
                        <image class="image" :src="`/static/images/grids/${item.icon}.svg`" mode="aspectFill" />
                        <text class="text">{{ item.text }}</text>
                    </view>
                </uni-grid-item>
            </uni-grid>
        </view>
        <view class="notice-bar">
            <uni-list-item show-arrow clickable @click="handleGoMessageCenter">
                <template #body>
                    <view class="content">
                        <image class="icon" src="/static/images/spirit/bell.png" mode="widthFix" />
                        <uni-badge :is-dot="true" :text="totalCount > 0 ? totalCount : ''" absolute="rightTop" size="small">
                            <view> {{ `您有${totalCount}条未读消息` }}</view>
                        </uni-badge>
                    </view>
                </template>
            </uni-list-item>
        </view>
        <uni-section type="line" title="本周未完成任务" />
    </view>
    <tab-bar />
</template>
<script lang="ts" setup>
import { teacherGirds } from '@/utils/constants';
import useMessage from '@/hooks/useMessage';
import { handleGridsClick, handleJumpToPage } from '@/utils/handle';
import { useUserStore } from '@/store/modules/user';
import { useAuthStore } from '@/store/modules/auth';
import { useAppStore } from '@/store/app';
import { studentTaskListApi } from '@/services/list';
import useRefreshList from '@/hooks/useRefreshList';
import StudentTaskList from './components/StudentTaskList.vue';
import { router } from '@/router';

const useUser = useUserStore();
const useAuth = useAuthStore();
const useApp = useAppStore();
const taskParams: any = reactive({
    searchData: {},
    searchApi: studentTaskListApi,
});
const { queryMessageCounts, totalCount } = useMessage(false);
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
const handleGoMessageCenter = (): void => {
    handleJumpToPage('teacherMessage');
};
const init = async () => {
    taskParams.searchData = { userid: useUser.moodleUserId };
    fetchTaskList(taskParams);
    queryMessageCounts();
};

onShow(() => {
    init();
});
</script>
<style lang="scss" scoped>
.grid-container {
    background-color: #fff;
}
.grid-item-box {
    flex: 1;
    // position: relative;

    /* #ifndef APP-NVUE */
    display: flex;

    /* #endif */
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 16rpx 0;
    .image {
        width: 80rpx;
        height: 80rpx;
    }
    .text {
        margin-top: 20rpx;
        font-size: $uni-font-size-sm;
        color: $uni-text-color;
    }
}
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
</style>
