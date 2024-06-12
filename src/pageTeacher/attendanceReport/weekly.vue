
<template>
    <app-provider>
        <nav-bar title="考勤周报" />
        <view class="container">
            <lesson-info @select-change="handeGroup" />
            <dropdown v-model:menuList="dropList" class="section" title="周次(3)" :duration="300" inactive-color="#409eff" :is-ceiling="false" @on-confirm="onConfirm" />
            <pull-refresh-list
                :loading="loading"
                :has-more-loading="hasMoreLoading"
                :is-refresh="isRefresh"
                :list-data="dataState.listData"
                :has-more="hasMore"
                @on-refresh="refresh"
                @load-more="loadMore"
            >
                <view class="group-container">
                    <view v-for="item in dataState.listData" :key="item.id" class="group-list" @click="goDetail(item)">
                        <view v-if="attendanceType==1">
                            <view class="flex">
                                <view class="item-top-left">
                                    <text class="item-name">于佳慧</text>
                                    <uni-tag :inverted="true" text="缺勤" type="error" size="mini" />
                                </view>
                                <text class="item-top-right">{{ `学号：1914800520` }}</text>
                            </view>
                            <view class="flex">
                                <text class="item-attendance">{{ `周出勤天数：6` }}</text>
                                <text class="item-attendance">{{ `周参加活动：6` }}</text>
                            </view>
                            <view>
                                <view class="flex">
                                    <view v-for="(week,index) in grid" :key="index" class="week-day">{{ ['一', '二', '三', '四', '五', '六', '日'][index] }}</view>
                                </view>
                                <view class="flex">
                                    <view v-for="(week,index) in grid" :key="index" :class="(week[`day${index + 1}`])=='0'?'absence':'normal'">{{ week[`day${index + 1}`] }}</view>
                                </view>
                            </view>
                        </view>
                        <view v-if="attendanceType==2">
                            <view class="flex">
                                <view class="item-top-left">
                                    <text class="item-name">张天天</text>
                                </view>
                                <text class="item-top-right">{{ `学号：1914800520` }}</text>
                            </view>
                            <view>
                                <text class="item-attendance">{{ `累计在线时长（分钟）：1764` }}</text>
                            </view>
                            <view class="flex" style="padding-top: 10rpx">
                                <text class="item-attendance">{{ `本周在线时长（分钟）：172` }}</text>
                                <text class="item-attendance">{{ `与总时长相差（分钟）：233` }}</text>
                            </view>
                        </view>
                    </view>
                </view>
            </pull-refresh-list>
        </view>
    </app-provider>
</template>
<script lang="ts" setup>
import LessonInfo from '@/pageTeacher/attendanceReport/component/lessonInfo.vue';
import { getCurPageParam } from '@/utils';
import useRefreshList from '@/hooks/useRefreshList';
import { querySuggestionListlApi } from '@/services/suggestion';

const pageParams = getCurPageParam();
const { courseid ,attendanceType} = pageParams;
const dropList = ref([
    {
        title: '仅显示缺勤',
        type: 'cell',
        value: '0',
        options: [
            {
                label: '显示全部',
                value: '0',
            },
            {
                label: '仅显示缺勤',
                value: '1',
            },
        ],
    },
]);
const grid = [
    { day1: 0 },
    { day2: 0 },
    { day3: 1 },
    { day4: 0 },
    { day5: 0 },
    { day6: 0 },
    { day7: 0 }
];
const curGrid=ref([]);
const searchParams: any = reactive({
    // searchData: {
    //     courseid,
    // },
    searchApi: querySuggestionListlApi,
});
const { dataState, refresh, loadMore, hasMore, loading, isRefresh, hasMoreLoading } = useRefreshList(searchParams);
const getGrid = (obj) => {
    const arr = [];
    Object.keys(obj)
        .map((items, i) => {
            let o = {};
            o[items] = obj[items];
            arr.push(o);
        });
    return arr;
};
const handeGroup = (val) => {
    console.log(val);
};

const onConfirm = (e) => {
    console.log(e);
};
const goDetail = (item) => {
    console.log(item);
};
</script>
<style lang="scss" scoped>
.flex{
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.container{
    background-color: #f6f6f6;
}
.section{
    margin: 20rpx 0;
}
.tab-all{
    color: $uni-button-type-primary;
}
.group-container{
    padding:10rpx 20rpx 20rpx 20rpx;
}
.group-list{
    background-color: #fff;
    border-radius: 10rpx;
    padding:20rpx;
    margin-bottom: 20rpx;
    box-shadow: 2rpx 2rpx 2rpx 2rpx #d7d5d5;
    .item-top-left{
        display: flex;
        align-items: center;
        .item-name{
            font-size: $uni-font-size-m;
            font-weight: 600;
            padding-right: 20rpx;
        }

    }
    .item-top-right{
        font-size: $uni-font-size-sm;
        color:$uni-text-color-disable;
    }
    .item-attendance{
        font-size: $uni-font-size-sm;
        color: $uni-color-subtitle;
        padding: 10rpx 0;
    }
    .week-day{
        background-color: #c2eefe;
        color: #6fa9bc;
        width: 60rpx;
        height: 60rpx;
        line-height: 60rpx;
        text-align: center;
        font-size: $uni-font-size-base;
        margin-bottom: 5rpx;
    }
    .absence{
        background-color: #fff0ec;
        color: #f87783;
        width: 60rpx;
        height: 60rpx;
        line-height: 60rpx;
        text-align: center;
        font-size: $uni-font-size-base;
    }
    .normal{
        background-color: transparent;
        color: $uni-color-subtitle;
        width: 60rpx;
        height: 60rpx;
        line-height: 60rpx;
        text-align: center;
        font-size: $uni-font-size-base;
    }
}
</style>
