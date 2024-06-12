
<template>
    <app-provider>
        <nav-bar title="考勤统计" />
        <view class="container">
            <lesson-info @select-change="handeGroup" />
            <dropdown v-model:menuList="dropList" class="section" title="" :duration="300" inactive-color="#409eff" :is-ceiling="false" @on-confirm="onConfirm" />
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
                                <text class="item-attendance">{{ `缺勤周数：2` }}</text>
                                <view :class="isPass?'pass':'notpass'">{{ isPass?'合格':'不合格' }}</view>
                            </view>
                            <uni-grid :column="7" :highlight="true" :show-border="false" :square="false">
                                <uni-grid-item v-for="(week, index) in parseInt(curLessonData.attendance?.config?.weeks)" :index="index" :key="index" >
                                    <view class="week-container">
                                        <view class="week-normal">{{index}}</view>
                                    </view>
                                </uni-grid-item>
                            </uni-grid>
                        </view>
                        <view v-if="attendanceType==2">
                            <view class="flex">
                                <view class="item-top-left">
                                    <text class="item-name">于佳慧</text>
                                    <uni-tag :inverted="true" text="缺勤" type="error" size="mini" />
                                </view>
                                <text class="item-top-right">{{ `学号：1914800520` }}</text>
                            </view>
                            <view class="flex">
                                <text class="item-attendance">{{ `累计在线时长（分钟）：1112` }}</text>
                                <view :class="isPass?'pass':'notpass'">{{ isPass?'合格':'不合格' }}</view>
                            </view>
                            <uni-grid :column="7" :highlight="true" :show-border="false" :square="false">
                                <uni-grid-item v-for="(week, index) in parseInt(curLessonData.attendance?.config?.weeks)" :index="index" :key="index" >
                                    <view class="week-container">
                                        <view class="week-top">{{index}}</view>
                                        <view class="week-time">112</view>
                                    </view>
                                </uni-grid-item>
                            </uni-grid>
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
import { useLessonStore } from "@/store/modules/lesson";

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
const useLesson=useLessonStore();
const curLessonData=computed(() => useLesson.lessonData);
const searchParams: any = reactive({
    // searchData: {
    //     courseid,
    // },
    searchApi: querySuggestionListlApi,
});
const { dataState, refresh, loadMore, hasMore, loading, isRefresh, hasMoreLoading } = useRefreshList(searchParams);
const isPass=ref(false)
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
        color:#a9a9a9;
    }
    .item-attendance{
        font-size: $uni-font-size-sm;
        color: #a9a9a9;
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
    .pass{
        background-color: #b4f68d;
        font-size: 20rpx;
        padding: 2rpx 10rpx;
    }
    .notpass{
        background-color: #ff5c62;
        font-size: 20rpx;
        padding: 2rpx 10rpx;
    }
    .week-container{
        flex: 1;
        /* #ifndef APP-NVUE */
        display: flex;
        /* #endif */
        flex-direction: column;
        align-items: center;
        justify-content: center;
        margin-bottom: 10rpx;
    }
    .week-normal{
        background-color:#f5ffee;
        color: #99bb82;
        text-align: center;
        height: 60rpx;
        width: 60rpx;
        line-height: 60rpx;
    }
    .week-notpass{
        background-color:#f3dda8;
        color: #dba64e;
        text-align: center;
        height: 60rpx;
        width: 60rpx;
        line-height: 60rpx;
    }
    .week-notpass{
        background-color:#efefef;
        color: #333;
        text-align: center;
        height: 60rpx;
        width: 60rpx;
        line-height: 60rpx;
    }
    .week-top{
        width: 100%;
        background-color: #82d2ff;
        border-right: 1rpx solid #fff;
        text-align: center;
        color: #333333;
    }
    .week-time{
       height: 80rpx;
        line-height: 80rpx;
        background-color: #efefef;
        width: 100%;
        border-radius: 12rpx;
        border-right: 1rpx solid #fff;
        text-align: center;
        font-size: $uni-font-size-sm;
        color: $uni-color-subtitle;

    }
}
</style>
