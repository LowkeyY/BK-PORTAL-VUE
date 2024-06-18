<!--
 * @Author: Lowkey
 * @Date: 2024-05-22 13:34:50
 * @LastEditors: Lowkey
 * @LastEditTime: 2024-06-11 15:41:45
 * @FilePath: \BK-Portal-VUE\src\pageTeacher\replySituation\index.vue
 * @Description: 
-->
<template>
    <nav-bar title="辅导教师回帖情况" />
    <uni-section type="line" title="筛选条件">
        <template #right>
            <text class="extra" @click="onSearch">查看结果</text>
        </template>
        <view class="search-container">
            <uni-datetime-picker v-model="searchDate.range" type="daterange" @change="dateChange" />
            <MulitplePicker label="小组：" :picker-data="useLesson.getLessonGroups" :result="searchDate.groupid" @select="handleSelect" />
            <view class="search-limit">
                <view class="limit-label">辅导教师回帖时限（小时）</view>
                <uni-easyinput v-model="searchDate.limit" placeholder="请输入内容" @input="limitInput"></uni-easyinput>
            </view>
        </view>
    </uni-section>
    <view>
        <pull-refresh-list
            :loading="loading"
            :has-more-loading="hasMoreLoading"
            :is-refresh="isRefresh"
            :list-data="dataState.listData"
            :has-more="hasMore"
            @on-refresh="refresh"
            @load-more="loadMore"
        >
            <ColorCard v-for="item in dataState.listData" :key="item.id" class="rate-list" @click="goDetail(item)">
                <template #header>
                    <view class="title">{{ `${'1.13计分练习《行政法的基本原则》'}` }}</view>
                    <view class="group">{{ `${'社会心理学小组2'}` }}</view>
                </template>
                <template #content>
                    <view class="content-item">
                        <view>{{ `应回贴数：${'23'}` }}</view>
                        <view>{{ `已回帖数：${'23'}` }}</view>
                    </view>
                    <view class="content-item">
                        <view>{{ `未回帖数：${'23'}` }}</view>
                        <view>{{ `未按时回帖数：${'23'}` }}</view>
                    </view>
                    <view class="content-item">
                        <view>{{ `辅导教师：${'李笑'}` }}</view>
                    </view>
                </template>
            </ColorCard>
        </pull-refresh-list>
    </view>
</template>
<script lang="ts" setup>
import { querySuggestionListlApi } from '@/services/suggestion';
import { useLessonStore } from '@/store/modules/lesson';
import useRefreshList from '@/hooks/useRefreshList';
import { handleJumpToPage } from '@/utils/handle';
const useLesson = useLessonStore();
const searchDate = reactive({
    limit:'48',
    groupid:'',
    range:[]
});
const searchParams: any = reactive({
    searchData:searchDate.value,
    searchApi: querySuggestionListlApi,
});
const { dataState, refresh, loadMore, hasMore, loading, isRefresh, hasMoreLoading } = useRefreshList(searchParams);
const dateChange = ()=>{
    
};
const limitInput = (val)=>{
    searchDate.limit=val;
};

const handleSelect = (val)=>{
    searchDate.groupid=val;
};
const onSearch = ()=>{
    console.log(searchDate);
};
const goDetail = (item) => {};
</script>
<style lang="scss" scoped>
.rate-list {
  .title {
    font-size: $uni-font-size-lg;
    padding-bottom: 20rpx;
    border-bottom: 1px solid #fff;
    margin-bottom: $uni-spacing-col-lg;
  }
  .group {
    margin-bottom: $uni-spacing-col-lg;
  }
  .info {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: $uni-spacing-col-lg;
  }
  .date {
    text-align: right;
    margin-bottom: $uni-spacing-col-lg;
  }
  .content-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: $uni-spacing-col-lg;
    font-size: $uni-font-size-m;
  }
}
.extra {
  color: $uni-color-primary;
}
.search-container {
  padding: $uni-container-padding;
  .search-limit {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .limit-label {
      flex-basis: 75%;
    }
  }
}
</style>
