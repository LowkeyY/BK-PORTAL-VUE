<!--
 * @Author: Lowkey
 * @Date: 2024-05-31 11:15:29
 * @LastEditors: Lowkey
 * @LastEditTime: 2024-05-31 12:26:18
 * @FilePath: \BK-Portal-VUE\src\pageSub\messageCenter\portalMessage.vue
 * @Description: 
-->


<template>
    <view>
        <view class="uni-padding-wrap">
            <uni-segmented-control :current="current" :values="courses" style-type="text" active-color="#2b83d7" @click-item="onClickItem" />
        </view>
        <view class="filter">
            <uni-search-bar
                v-model="searchValue.text" @confirm="search" 
                @cancel="cancel" 
            >
            </uni-search-bar>
            <uni-datetime-picker v-model="searchValue.range" type="daterange" @change="dateChange" />
        </view>
        <uni-section type="line" title="消息列表">
            <template #right>
                <view v-if="current===0" class="marked">
                    <uni-icons type="checkmarkempty" size="16" color="#2b83d7"></uni-icons>
                    <text>一键已读</text>
                </view>
            </template>
        </uni-section>
        <view class="list-container">
            <pull-refresh-list
                :loading="loading"
                :has-more-loading="hasMoreLoading"
                :list-data="dataState.listData"
                :is-refresh="isRefresh"
                :has-more="hasMore"
                @on-refresh="refresh"
                @load-more="loadMore"
            >
                <view v-for="item in dataState.listData" :key="optionId" class="list-item">
                    <view class="title">sdfsdf</view>
                    <view class="date">2024.03.21</view>
                </view>
            </pull-refresh-list>
        </view>
    </view>
</template>

<script setup lang="ts">
import useRefreshList from '@/hooks/useRefreshList';
import { querySuggestionListlApi } from '@/services/suggestion';

const searchParams: any = reactive({
    searchApi: querySuggestionListlApi,
});
const { dataState, refresh, loadMore, hasMore, isRefresh, loading, hasMoreLoading } = useRefreshList(searchParams);
const current = ref(0);
const courses = ref(['未读消息', '已读消息']);
const searchValue =  reactive({
    text:'',
    range:[]
});
const search = ()=>{

};
const cancel = ()=>{
    
};
const dateChange = (e)=>{
    console.log(e);
};
const onClickItem = (e) => {
    if (current.value !== e.currentIndex) {
        current.value = e.currentIndex;
    }
};
</script>

<style lang="scss" scoped>
.uni-padding-wrap {
  background-color: #fff;
  margin-bottom: 10rpx;
}
.filter {
  background-color: #fff;
  padding-bottom: $uni-spacing-col-lg;
}
.marked {
  color: $uni-color-primary;
}
.list-container {
  padding: 8rpx 20rpx 0;
  .list-item {
    background-color: #fff;
    padding: $uni-list-padding;
    margin-bottom: $uni-spacing-col-base;
    border-radius: $uni-border-radius-base;
    .title {
      font-size: $uni-font-size-base;
      margin-bottom: $uni-spacing-col-base;
    }
    .date {
      @include info;
    }
  }
}
</style>
