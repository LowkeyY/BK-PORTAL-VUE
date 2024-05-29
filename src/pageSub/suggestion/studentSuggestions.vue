<!--
 * @Author: Lowkey
 * @Date: 2024-05-28 17:16:01
 * @LastEditors: Lowkey
 * @LastEditTime: 2024-05-28 18:51:54
 * @FilePath: \BK-Portal-VUE\src\pageSub\suggestion\studentSuggestions.vue
 * @Description: 
-->
<template>
    <view>
        <nav-bar title="学生反馈" />
        <pull-refresh-list
            :loading="loading"
            :has-more-loading="hasMoreLoading"
            :is-refresh="isRefresh"
            :list-data="dataState.listData"
            :has-more="hasMore"
            @on-refresh="refresh"
            @load-more="loadMore"
        >
            <view>
                <view v-for="item in dataState.listData" :key="item.opinionId" class="suggestions" @click="goDetail(item)">
                    <view class="top">
                        <view class="user-name">辛弃疾</view>
                        <uni-tag
                            :text="item.currentStatus === '0' ? '未回复' : '已回复'"
                            :type="item.currentStatus === '0' ? 'error' : 'success'"
                            size="mini"
                        ></uni-tag>
                    </view>
                    <view class="content text-ellipsis-1"> 老师，老师，毕业了能找到工作不？ </view>
                    <view class="info">
                        <uni-tag :text="item.submitType" type="primary" size="mini"></uni-tag>
                        <view class="date">
                            {{ getCommonDate(item.submitDate / 1000) }}
                        </view>
                    </view>
                </view>
            </view>
        </pull-refresh-list>
    </view>
</template>

<script setup lang="ts">
import { querySuggestionListlApi } from '@/services/suggestion';
import useRefreshList from '@/hooks/useRefreshList';
import { getCommonDate } from '@/utils';
import { handleJumpToPage } from '@/utils/handle';

const searchParams: any = reactive({
    searchApi: querySuggestionListlApi,
});
const { dataState, refresh, fetchList, loadMore, hasMore, loading, isRefresh, hasMoreLoading } = useRefreshList(searchParams);

const goDetail = (item: { opinionId: string }) => {
    const { opinionId } = item;
    handleJumpToPage('SuggestionContent', { opinionId });
};

onLoad(async () => {
    await fetchList(searchParams);
});
</script>

<style lang="scss" scoped>
.suggestions {
    padding: $uni-list-padding;
    background-color: #fff;
    margin-bottom: $uni-spacing-row-lg;
    .top {
        @include flex;
        .user-name {
            font-size: $uni-font-size-lg;
            margin-bottom: $uni-spacing-row-lg;
        }
    }
    .content {
        color: $uni-color-subtitle;
        font-size: $uni-font-size-m;
        margin-bottom: $uni-spacing-row-lg;
    }
    .info {
        @include flex;
        .date {
            color: $uni-color-subtitle;
            font-size: $uni-font-size-m;
        }
    }
}
</style>
