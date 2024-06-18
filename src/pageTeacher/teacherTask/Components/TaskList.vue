
<template>
    <view>
        <view class="task-type-picker">
            <view class="task-type-picker-left">
                任务类型
            </view>
            <view class="task-type-picker-db">
                <picker :value="typeSelectIndex" range-key="label" :range="taskType" @change="bindPickerChange">
                    <view class="uni-input">{{ taskType[typeSelectIndex].label }}</view>
                </picker>
            </view>
        </view>
        <group-select />
        <uni-section type="line" title="任务列表" />
        <pull-refresh-list
            :loading="loading"
            :has-more-loading="hasMoreLoading"
            :is-refresh="isRefresh"
            :list-data="dataState.listData"
            :has-more="hasMore"
            @on-refresh="refresh"
            @load-more="loadMore"
        >
            <view class="task-list-container">
                <view v-for="item in dataState.listData" :key="item.id" class="task-list-list" @click="goDetail(item)">
                    <view class="title">{{ `${'讨论区名称'}` }}</view>
                    <view class="user">{{ `学生：${'张三'}` }}</view>
                    <view class="group">{{ `小组：${'第一组'}` }}</view>
                    <view class="date">{{ `发帖时间：${'2024.05.10'}` }}</view>
                </view>
            </view>
        </pull-refresh-list>
    </view>
</template>
<script lang="ts" setup name="TaskList">
import { querySuggestionListlApi } from '@/services/suggestion';
import useRefreshList from '@/hooks/useRefreshList';
import { handleJumpToPage } from '@/utils/handle';
const taskType = [
    {
        label:'讨论区',
        value:'1'
    },
    {
        label:'作业',
        value:'2'
    },  {
        label:'测验',
        value:'3'
    }
];
const typeSelectIndex= 0;
const searchParams: any = reactive({
    searchApi: querySuggestionListlApi,
});
const { dataState, refresh, loadMore, hasMore, loading, isRefresh, hasMoreLoading } = useRefreshList(searchParams);

const goDetail = (item) => {};
const bindPickerChange = ()=>{
    
};
</script>
<style lang="scss" scoped>
.task-type-picker {
  display: flex;
  align-items: center;
  font-size: $uni-font-size-lg;
  padding: $uni-list-padding;
  background-color: #fff;
  margin-bottom: $uni-spacing-col-lg;
  .task-type-picker-left {
    margin-right: 30rpx;
  }
  .task-type-picker-db {
    color: $uni-color-subtitle;
  }
}
.task-list-container {
  padding: 10rpx 20rpx;
}
.task-list-list {
  background-color: #fff;
  padding: $uni-list-padding;
  margin-bottom: $uni-spacing-col-lg;
  border-radius: $uni-border-radius-base;
  font-size: $uni-font-size-m;
  .title {
    margin-bottom: $uni-spacing-col-lg;
    @include user-name;
  }
  .user {
    margin-bottom: $uni-spacing-col-lg;
    @include info;
  }
  .group {
    margin-bottom: $uni-spacing-col-lg;
    @include info;
  }
  .date {
    @include info;
  }
}
</style>
