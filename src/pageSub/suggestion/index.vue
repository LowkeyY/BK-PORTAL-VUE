<!--
 * @Author: Lowkey
 * @Date: 2024-05-17 12:22:56
 * @LastEditors: Lowkey
 * @LastEditTime: 2024-05-21 17:06:36
 * @FilePath: \BK-Portal-VUE\src\pageSub\suggestion\index.vue
 * @Description: 
-->
<template>
    <view>
        <nav-bar title="我的反馈" />
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
                        <view class="type">{{ item.submitType }}</view>
                        <uni-tag
                            :text="item.currentStatus === '0' ? '未回复' : '已回复'"
                            :type="item.currentStatus === '0' ? 'error' : 'success'"
                            size="mini"
                        ></uni-tag>
                    </view>
                    <view class="date">
                        {{ getCommonDate(item.submitDate / 1000) }}
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
    margin-bottom: 20rpx;
    .top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: $uni-font-size-lg;
        margin-bottom: 20rpx;
    }
    .date {
        color: $uni-color-subtitle;
        font-size: $uni-font-size-m;
    }
}
</style>
