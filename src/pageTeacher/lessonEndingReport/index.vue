<template>
    <view>
        <nav-bar title="辅导情况" />
        <view class="top-info">
            <view class="top">
                <view class="title">{{ curLessonData.fullname }}</view>
                <view class="info">{{ `开课时间：   ${changeLessonDate(curLessonData.startdate)}` }}</view>
                <view class="info">{{ `结课时间：   ${changeLessonDate(curLessonData.enddate)}` }}</view>
            </view>
        </view>
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
            <view>
                <view v-for="item in dataState.listData" :key="item.id" class="item">
                    <view class="flex">
                        <image class="avatar" :src="getPortalAvatar(curFileUrl, '')" mode=""></image>
                        <view class="item-info">
                            <view style="padding:5rpx 0"><text style="padding-left: 10rpx">潘达</text><text style="color: #2781c1">13503322222</text></view>
                            <text class="item-role">{{ `辅导教师` }}</text>
                            <view class="item-email">{{ `邮箱： 23234@163.com` }}</view>
                        </view>
                    </view>
                    <text class="not-submit">{{ `未提交` }}</text>
                </view>
            </view>
        </pull-refresh-list>
    </view>
</template>
<script lang="ts" setup>
import { useLessonStore } from '@/store/modules/lesson';
import { changeLessonDate, getPortalAvatar } from '@/utils';
import { querySuggestionListlApi } from '@/services/suggestion';
import useRefreshList from '@/hooks/useRefreshList';
import { getBaseUrl } from '@/utils/env';

const useLesson=useLessonStore();
const curLessonData=computed(() => useLesson.lessonData);
const { PORTAL_SERVER } = getBaseUrl();
const curFileUrl = `${PORTAL_SERVER}/file/downloadFile`;
const dataPickerRef=ref();
const dropList = ref([
    {
        title: '显示所有',
        type: 'cell',
        value: '0',
        options: [
            {
                label: '显示所有',
                value: '0',
            },
            {
                label: '已提交',
                value: '1',
            },
            {
                label: '未提交',
                value: '2',
            },
        ],
    },
]);
const searchParams: any = reactive({
    // searchData: {
    //     courseid,
    // },
    searchApi: querySuggestionListlApi,
});
const { dataState, refresh, loadMore, hasMore, loading, isRefresh, hasMoreLoading } = useRefreshList(searchParams);

const onConfirm = (e) => {
    console.log(e);
};

</script>
<style lang="scss" scoped>
.flex{
    display: flex;
    align-items: center;
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
.select-container{
    background-color: #fff;
    height: 80rpx;
    width: 100%;
    margin-top: 20rpx;
    display: flex;
    justify-content: space-between;
    padding: 0 20rpx;
    align-items: center;
}
.select-group{
    display: flex;
    color: #9c9c9c;
    font-size: $uni-font-size-m;
    height: 100%;
    align-items: center;
}
.item{
    background-color: #fff;
    border-radius: 10rpx;
    padding: 20rpx;
    margin: 20rpx;
    .avatar{
        width: 100rpx;
        height: 100rpx;
    }
    .item-info{
        padding-left: 20rpx;
    }
    .item-role{
        background-color: #1eb259;
        color: #fff;
        font-size: $uni-font-size-sm;
        padding: 4rpx 10rpx;
        border-radius: 6rpx;
    }
    .item-email{
        color: #9c9c9c;
        font-size: $uni-font-size-sm;
        padding-top: 4rpx;
    }
}
.submited{
    display: inline-block;
    background-color: #1eb259;
    color: #fff;
    font-size: $uni-font-size-sm;
    padding: 4rpx 10rpx;
    border-radius: 6rpx;
    margin-top: 20rpx;
}
.not-submit{
    display: inline-block;
    background-color: #f35923;
    color: #fff;
    font-size: $uni-font-size-sm;
    padding: 4rpx 10rpx;
    border-radius: 6rpx;
    margin-top: 20rpx;
}
</style>
