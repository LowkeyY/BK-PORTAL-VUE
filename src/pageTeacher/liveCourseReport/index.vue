<!--
 * @Author: Lowkey
 * @Date: 2024-05-22 13:34:50
 * @LastEditors: Lowkey
 * @LastEditTime: 2024-05-28 15:26:45
 * @FilePath: \BK-Portal-VUE\src\pageTeacher\liveCourseReport\index.vue
 * @Description: 
-->
<template>
    <nav-bar title="直播课堂统计" />
    <view>
        <group-select />
        <pull-refresh-list
            :loading="loading"
            :has-more-loading="hasMoreLoading"
            :is-refresh="isRefresh"
            :list-data="dataState.listData"
            :has-more="hasMore"
            @on-refresh="refresh"
            @load-more="loadMore"
        >
            <view class="live-course-container">
                <view v-for="item in dataState.listData" :key="item.id" class="live-course-list" @click="goDetail(item)">
                    <view class="title">
                        <view class="userName">李清照</view>
                        <view class="student-number">学号：23423423</view>
                    </view>
                    <view class="live-course-status">
                        <view>
                            {{ `缺勤：${`3`}` }}
                        </view>
                        <view>
                            {{ `出勤：${`6`}` }}
                        </view>
                    </view>
                </view>
            </view>
        </pull-refresh-list>
    </view>
</template>
<script lang="ts" setup>
import { querySuggestionListlApi } from '@/services/suggestion';
import useRefreshList from '@/hooks/useRefreshList';
import { handleJumpToPage } from '@/utils/handle';

const searchParams: any = reactive({
    searchApi: querySuggestionListlApi,
});
const { dataState, refresh, loadMore, hasMore, loading, isRefresh, hasMoreLoading } = useRefreshList(searchParams);

const goDetail = (item: Record<string, string>) => {
    const { id } = item;
    handleJumpToPage('LiveCourseReportDetails', { id });
};
</script>
<style lang="scss" scoped>
.live-course-container {
    padding: 10rpx 20rpx;
}
.live-course-list {
    background-color: #fff;
    padding: $uni-list-padding;
    margin-bottom: $uni-spacing-col-lg;
    border-radius: $uni-border-radius-base;
    .title {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 30rpx;
        .userName {
            @include user-name;
        }
        .student-number {
            @include info;
        }
    }
    .live-course-status {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: $uni-font-size-lg;
        .user-info {
            font-size: $uni-font-size-base;
            color: $uni-color-subtitle;
            .phone {
                margin-bottom: $uni-spacing-col-base;
            }
        }
    }
}
</style>
