
<template>
    <view>
        <view>
            <pull-refresh-list :loading="loading" :has-more-loading="hasMoreLoading" :is-refresh="isRefresh" :list-data="dataState.listData" :has-more="hasMore" @on-refresh="refresh" @load-more="loadMore">
                <view>
                    <view v-for="(notice) in dataState.listData" :key="notice.informationId" class="notice" @click="goDetail(notice)">
                        <view class="notice-date">
                            <text class="notice-date-day">{{ formatCreateDate(notice.createDate).day }}</text>
                            <text class="notice-date-date">{{ formatCreateDate(notice.createDate).date }}</text>
                        </view>
                        <view class="notice-msg">
                            <uni-tag :inverted="true" text="置顶" size="mini" type="error" />
                            <text class="informationSource">{{`[${notice.informationSource}]`}}</text>
                            <text class="notice-text">
                                {{ notice.title }}
                            </text>
                        </view>
                    </view>
                </view>
            </pull-refresh-list>
        </view>
    </view>
</template>

<script setup lang="ts">
import {informationCollectionListApi} from '@/services/notifications';
import useRefreshList from '@/hooks/useRefreshList';
import {handleJumpToPage} from '@/utils/handle';

const current = ref(0);
const searchParams = reactive({
    searchData:{

    },
    searchApi: informationCollectionListApi,
});
const { dataState,refresh,fetchList, loadMore, hasMore, loading,isRefresh,hasMoreLoading} = useRefreshList(searchParams);

const formatCreateDate = (createDate) => {
    const day = new Date(createDate).getDate() < 10 ? `0${new Date(createDate).getDate()}` : new Date(createDate).getDate();
    const date = (new Date(createDate).getMonth() + 1) < 10 ? `${new Date(createDate).getFullYear()}.0${new Date(createDate).getMonth() + 1}` : `${new Date(createDate).getFullYear()}.${new Date(createDate).getMonth() + 1}`;
    return {day,date};
};

const goDetail = (notice) => {
    const {informationId,categoryName}=notice;
    handleJumpToPage('informationDetail',{informationId,categoryName});

};

onLoad(async ()=>{
    await fetchList(searchParams);
});
</script>

<style lang="scss" scoped>
.uni-padding-wrap {
  background-color: #fff;
  padding: 0 20rpx 10rpx;
}
.notice {
  display: flex;
  background-color: #fff;
  padding: 10rpx 30rpx;
  margin-bottom: 20rpx;
  align-items: center;
  .notice-date {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: #2b83d7;
    padding: 20rpx 10rpx;
    .notice-date-day {
      color: $uni-font-color-white;
      font-size: $uni-font-size-lg;
    }
    .notice-date-date {
      color: $uni-font-color-white;
      font-size: $uni-font-size-base;
    }
  }
  .notice-msg {
    flex-grow: 1;
    padding: 0 20rpx;
    .informationSource {
      color: #2b83d7;
      padding-left: 10rpx;
    }
    .notice-text {
      padding-left: 10rpx;
    }
  }
}
</style>
