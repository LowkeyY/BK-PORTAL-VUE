<!--
 * @Author: Lowkey
 * @Date: 2024-01-05 13:06:02
 * @LastEditors: Lowkey
 * @LastEditTime: 2024-01-05 17:19:35
 * @FilePath: \BK-Portal-VUE\src\pageSub\timeTable\index.vue
 * @Description: 
-->


<template>
    <view>
        <nav-bar title="课程表" />
        <pull-refresh-list :loading="loading" :has-more-loading="hasMoreLoading" :list-data="dataState.listData" :is-refresh="isRefresh" :has-more="hasMore" @on-refresh="refresh" @load-more="loadMore">
            <view>
                <view v-for="(item) in dataState.listData" :key="item.course.userCourseId" class="list">
                    <view class="list-title">
                        {{ item.course.courseName }}
                        <text :style="{color:rednerCourseState(item.course.courseState).color}">
                            {{ rednerCourseState(item.course.courseState).text }}
                        </text>
                    </view> 
                    <text class="list-info">
                        {{ `责任教师：${renderInfo(item.course.courseTeacher)}` }}
                    </text>
                    <text class="list-info">
                        {{ `辅导教师：${renderInfo(changeLessonDate(item.course.startDate / 1000))}至${renderInfo(changeLessonDate(item.course.endDate / 1000))}` }}
                    </text> 
                    <text class="list-info">
                        {{ `开课时间：${renderInfo(item.course.courseTeacher)}` }}
                    </text> 
                    <view class="list-link">
                        <text>{{ `形考成绩：${renderInfo(item.course.examScore)}` }}</text>
                        <view>
                            <button class="mini-btn" style="margin-right: 8px ;" type="primary" plain="true" size="mini">进入学习</button>
                            <button class="mini-btn" type="primary" plain="true" size="mini">参与直播</button>
                        </view>
                    </view> 
                </view>
            </view>
        </pull-refresh-list>
    </view>
</template>

<script lang="ts" setup>
import {timetableApi} from '@/services/list';
import useRefreshList from '@/hooks/useRefreshList';
import {changeLessonDate} from '@/utils';

const searchParams:any = reactive({
    searchApi: timetableApi,
});
const { dataState,refresh,loadMore, hasMore,isRefresh, loading ,hasMoreLoading} = useRefreshList(searchParams, true);

const renderInfo = (text:string):string=>{
    return text||'-';
};
const rednerCourseState = (courseState:Number) => {
    let res = {
        text:'',
        color:''
    };
    switch (courseState) {
        case 1:
            res = {
                text:'[在开]',
                color:'#189c00'
            };
            break;
        case 2:
            res = {
                text:'[将开]',
                color:'#ff6900'
            };
            break;
        case 3:
            res = {
                text:'[已开]',
                color:'#999'
            };
            break;
    }
    return res;
};
</script>

<style lang="scss" scoped>
.list {
  background-color: #fff;
  margin-bottom: $uni-spacing-row-base;
  padding: $uni-list-padding;
  display: flex;
  flex-direction: column;
  .list-title {
    font-size: $uni-font-size-lg;
    padding-left: 8px;
    font-weight: bold;
    color: $uni-color-title;
    border-left: 10rpx solid transparent;
    border-image: linear-gradient(#f76711, #facb58) 1 10;
    margin-bottom: 8px;
  }
  .list-info {
    font-size: $uni-font-size-base;
    color: $uni-color-subtitle;
    margin-bottom: 8px;
  }
  .list-link {
    font-size: $uni-font-size-base;
    color: $uni-color-subtitle;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
</style>
