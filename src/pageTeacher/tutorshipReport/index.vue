<template>
    <view>
        <nav-bar title="辅导情况" />
        <view class="top-info">
            <view v-if="curLessonData.attendanceType=='1'" class="top">
                <view class="title">{{ curLessonData.fullname }}</view>
                <view class="tutorship-info">
                    <view>{{ `回帖率： 30%` }}</view>
                    <view>{{ `及时回帖率： 30%` }}</view>
                </view>
                <view class="tutorship-info">
                    <view>{{ `作业评阅率： 30%` }}</view>
                    <view>{{ `作业及时评阅率： 60%` }}</view>
                </view>
            </view>
        </view>
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
                <view v-for="item in dataState.listData" :key="item.id" class="item">
                    <view class="item-title">{{ `李刚` }}</view>
                    <view class="flex">
                        <view class="item-percentage">
                            <view :style="{width: itemWidth}" class="pass-progress"></view>
                            <view class="pass">{{ `回帖率：30%` }}</view>
                        </view>
                        <view class="item-percentage">
                            <view :style="{width: itemWidth}" class="nopass-progress"></view>
                            <view class="nopass">{{ `及时回帖率：30%` }}</view>
                        </view>
                    </view>
                    <view class="flex">
                        <view class="item-percentage">
                            <view :style="{width: itemWidth}" class="pass-progress"></view>
                            <view class="pass">{{ `作业评阅率：30%` }}</view>
                        </view>
                        <view class="item-percentage">
                            <view :style="{width: itemWidth}" class="nopass-progress"></view>
                            <view class="nopass">{{ `作业及时评阅率：60%` }}</view>
                        </view>
                    </view>
                </view>
            </view>
        </pull-refresh-list>
    </view>
</template>
<script lang="ts" setup>
import { useLessonStore } from '@/store/modules/lesson';
import { querySuggestionListlApi } from '@/services/suggestion';
import useRefreshList from '@/hooks/useRefreshList';
import { getBaseUrl } from '@/utils/env';

const useLesson=useLessonStore();
const curLessonData=computed(() => useLesson.lessonData);
const { PORTAL_SERVER } = getBaseUrl();
const curFileUrl = `${PORTAL_SERVER}/file/downloadFile`;
const searchParams: any = reactive({
    // searchData: {
    //     courseid,
    // },
    searchApi: querySuggestionListlApi,
});
const { dataState, refresh, loadMore, hasMore, loading, isRefresh, hasMoreLoading } = useRefreshList(searchParams);
const itemWidth=ref('30%');

</script>
<style lang="scss" scoped>
.flex{
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.top-info{
    padding: 20rpx;
}
.top{
    width: 100%;
    border-radius: 30rpx;
    background: linear-gradient(#3376b2, #2385c7);
    color: $uni-text-color-inverse;;
    padding: 20rpx 20rpx 40rpx 20rpx;
    position: relative;
    .title{
        font-size: $uni-font-size-m;
        padding-bottom: 10rpx;
    }
    .info{
        font-size: $uni-font-size-sm;
        padding-bottom: 4rpx;
    }
}
.top:after {
    content: "";
    position: absolute;
    bottom: -40rpx;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 40rpx 40rpx 0;
    border-color: #2583c4 transparent transparent;
}
.tutorship-info{
    display: flex;
    align-items: center;
    padding: 10rpx 0;
    justify-content: space-between;
    font-size: $uni-font-size-sm;
}
.item{
    background-color: #fff;
    border-radius: 10rpx;
    margin: 20rpx;
    overflow: hidden;
    padding-bottom: 30rpx;
    .item-title{
        background-color: #579be0;
        color: #fff;
        padding: 14rpx 30rpx;
    }
    .item-percentage{
        position: relative;
        background-color: #efefef;
        width: 40%;
        height: 50rpx;
        margin: 30rpx 20rpx 0 20rpx;
    }
    .pass{
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 50rpx;
        text-align: center;
        line-height: 50rpx;
        color: #3178b5;
        font-size: $uni-font-size-sm;
        z-index:2;
    }
    .nopass{
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 50rpx;
        text-align: center;
        line-height: 50rpx;
        color: #f63f4f;
        font-size: $uni-font-size-sm;
    }
    .pass-progress{
        height: 50rpx;
        background-color: rgba(145, 213, 255,0.3);
    }
    .nopass-progress{
        height: 50rpx;
        background-color:rgba(255, 163, 158,0.3);
    }
}
</style>
