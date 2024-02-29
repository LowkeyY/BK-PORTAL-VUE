
<template>
    <view class="container">
        <pull-refresh-list :loading="loading" :has-more="false" :list-data="liveList" :is-refresh="isRefresh" @on-refresh="refresh">
            <view>
                <view v-for="(course,index) in liveList" :key="index" class="course">
                    <uni-title type="h4" :title="toChineseNum(index+1)+course.courseName" color="#171717"></uni-title>
                    <view class="courseTime">{{ `直播时间: ${course.courseDate} ${course.courseTime}` }}</view>
                    <view class="btn-box">
                        <button type="default" plain="true" size="mini" style="color: #2b83d7;border: 2rpx solid #2b83d7;width: 80%;text-align: center;" @click="goUrl(course)">
                            {{ course.playbackUrl?"直播回放":"进入直播" }}
                        </button>
                    </view>
                </view>
            </view>
        </pull-refresh-list>
    </view>
</template>

<script lang="ts" setup>
import {useLiveCourseStore} from '@/store/modules/liveCourse';
import {toChineseNum} from '@/utils';
import {useOpenUrl} from '@/hooks/useOpenUrl';
import {isEmpty} from '@/utils/is';

const props=defineProps({
    liveList: {
        type: Array,
        default:()=> []
    }
});


const useLiveCourse=useLiveCourseStore;
const loading=ref(false);
const isRefresh=ref(false);
const refresh =async (callback: () => void) => {
    isRefresh.value=true;
    try {
        await useLiveCourse.queryLiveCourse();
    } finally {
        callback();
        isRefresh.value=false;
    }
};

const goUrl = (course) => {
    if(course.playbackUrl){
        useOpenUrl(course.playbackUrl);
    }else{
        useOpenUrl(course.joinUrl);
    }
};

onLoad(async ()=>{
    if(isEmpty(props.liveList)){
        await useLiveCourse.queryLiveCourse();
    }
});
</script>

<style lang="scss" scoped>
.course {
  background-color: #fff;
  padding: $uni-list-padding;
  margin-bottom: 20rpx;
}
.courseTime {
  color: $uni-text-color-placeholder;
  font-size: $uni-font-size-base;
}
.btn-box {
  display: flex;
  justify-content: center;
  padding-top: $uni-container-padding;
}
</style>
