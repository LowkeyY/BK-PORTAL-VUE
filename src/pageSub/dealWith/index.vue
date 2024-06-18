<!--
 * @Author: Lowkey
 * @Date: 2024-05-17 12:22:56
 * @LastEditors: Lowkey
 * @LastEditTime: 2024-05-31 15:43:26
 * @FilePath: \BK-Portal-VUE\src\pageSub\dealWith\index.vue
 * @Description: 
-->
<template>
    <view>
        <nav-bar title="我的办理" />
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
                        <view class="type">{{ '高数补考申请' }}</view>
                        <uni-tag
                            :text="item.currentStatus === '0' ? '待审核' : '已办理'"
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
