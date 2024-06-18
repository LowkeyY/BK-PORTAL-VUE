<!--
 * @Author: Lowkey
 * @Date: 2024-05-22 13:34:50
 * @LastEditors: Lowkey
 * @LastEditTime: 2024-06-11 15:20:31
 * @FilePath: \BK-Portal-VUE\src\pageTeacher\ratingSituation\index.vue
 * @Description: 
-->
<template>
    <nav-bar title="辅导教师评分情况" />
    <uni-section type="line" title="筛选条件">
        <template #right>
            <text class="extra" @click="onSearch">查看结果</text>
        </template>
        <view class="search-container">
            <MulitplePicker label="主题/周次：" :picker-data="useLesson.getLessonSections" :result="searchDate.weeks" @select="handleSelectWeek" />
            <MulitplePicker label="小组：" :picker-data="useLesson.getLessonGroups" :result="searchDate.groupid" @select="handleSelect" />
            <view class="search-limit">
                <view class="limit-label">评分时限（天）</view>
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
                    <view class="info">
                        <view>{{ `学生数：${'23'}` }}</view>
                        <view>{{ `类型：${'讨论区'}` }}</view>
                    </view>
                    <view class="date">{{ `截止时间：${'2024.7.22'}` }}</view>
                </template>
                <template #content>
                    <view class="content-item">
                        <view>{{ `已提交数：${'23'}` }}</view>
                        <view>{{ `已评分数：${'23'}` }}</view>
                    </view>
                    <view class="content-item">
                        <view>{{ `未评分数：${'23'}` }}</view>
                        <view>{{ `未按时评分数：${'23'}` }}</view>
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
import { useLessonStore } from '@/store/modules/lesson';
import { querySuggestionListlApi } from '@/services/suggestion';
import useRefreshList from '@/hooks/useRefreshList';
import { handleJumpToPage } from '@/utils/handle';

const useLesson = useLessonStore();
const searchDate = reactive({
    limit:'7',
    groupid:'',
    weeks:''
});
const searchParams: any = reactive({
    searchData:searchDate.value,
    searchApi: querySuggestionListlApi,
});
const { dataState, refresh, loadMore, hasMore, loading, isRefresh, hasMoreLoading } = useRefreshList(searchParams);
const limitInput = (val)=>{
    searchDate.limit=val;
};
const handleSelectWeek = (val)=>{
  
    searchDate.weeks=val;
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
