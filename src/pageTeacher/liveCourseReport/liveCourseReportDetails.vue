<!--
 * @Author: Lowkey
 * @Date: 2024-05-22 13:34:50
 * @LastEditors: Lowkey
 * @LastEditTime: 2024-05-28 15:58:44
 * @FilePath: \BK-Portal-VUE\src\pageTeacher\liveCourseReport\liveCourseReportDetails.vue
 * @Description: 
-->
<template>
    <view>
        <nav-bar title="学生直播课堂统计" />
        <pull-refresh-list
            :loading="loading"
            :has-more-loading="hasMoreLoading"
            :is-refresh="isRefresh"
            :list-data="dataState.listData"
            :has-more="hasMore"
            @on-refresh="refresh"
            @load-more="loadMore"
        >
            <view class="live-details-container">
                <view v-for="item in dataState.listData" :key="item.id" class="live-details-list" @click="goDetail(item)">
                    <view class="course-name">课程1</view>
                    <view class="course-info">
                        <view>2024.12.02</view>
                        <uni-tag size="mini" :text="1 ? '合格' : '不合格'" :type="1 ? 'success' : 'error'" />
                    </view>

                    <view class="live-details-status">
                        <view>学习时长比例(%):</view>

                        <ComProgressBar
                            class="progress"
                            type="follow-right"
                            :texture="[1 ? '#1eb259' : '#f34e14', '#e3e3e3']"
                            :disable-value="true"
                            :value="0.8"
                        />
                        <text class="progress-text">80%</text>
                    </view>
                </view>
            </view>
        </pull-refresh-list>
    </view>
</template>
<script lang="ts" setup>
import ComProgressBar from '@/components/ComProgressBar/index.vue';
import { querySuggestionListlApi } from '@/services/suggestion';
import useRefreshList from '@/hooks/useRefreshList';
import { handleJumpToPage } from '@/utils/handle';

const searchParams: any = reactive({
    searchApi: querySuggestionListlApi,
});
const { dataState, refresh, loadMore, hasMore, loading, isRefresh, hasMoreLoading } = useRefreshList(searchParams);

const goDetail = (item: Record<string, string>) => {
    const { id } = item;
};
</script>
<style lang="scss" scoped>
.live-details-container {
    margin-top: $uni-spacing-col-lg;
}
.live-details-list {
    background-color: #fff;
    padding: $uni-list-padding;
    margin-bottom: $uni-spacing-col-lg;
    border-radius: $uni-border-radius-base;
    .course-name {
        @include user-name;

        margin-bottom: $uni-spacing-col-lg;
    }
    .course-info {
        @include flex;
        @include info;

        margin-bottom: $uni-spacing-col-lg;
    }
    .live-details-status {
        display: flex;
        align-items: center;
        font-size: $uni-font-size-m;
        .progress {
            flex: 1;
            margin-left: 20rpx;
        }
        .progress-text {
            margin-left: 20rpx;
        }
    }
}
</style>
