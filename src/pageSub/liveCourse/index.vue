
<template>
    <view>
        <nav-bar title="我的直播" />
        <view class="uni-padding-wrap">
            <uni-segmented-control :current="current" :values="tabs.map(item=>item.title)" style-type="button" active-color="#2b83d7" @click-item="onClickItem" />
        </view>

        <pull-refresh-list :loading="loading" :has-more="false" :list-data="curLiveCourseList" :is-refresh="isRefresh" @on-refresh="refresh">
            <view>
                <view v-for="(course,index) in curLiveCourseList" :key="index" class="course">
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
import {informationListApi} from '@/services/notifications';
import {useLiveCourseStore} from '@/store/modules/liveCourse';
import {getLiveCourseFilterList} from '@/hooks/useLiveCourse';
import {toChineseNum} from '@/utils';
import {useOpenUrl} from '@/hooks/useOpenUrl';

const useLiveCourse=useLiveCourseStore();
const current = ref(0);
const curLiveTab = ref({});
const tabs = [
    { title: '直播课程' ,key:'live'},
    { title: '回放列表', key:'playBack'}
];
const searchParams = reactive({
    searchData:{},
    searchApi: informationListApi,
});
const loading=ref(false);
const isRefresh=ref(false);
const curLiveCourseList = computed(()=>{
    curLiveTab.value=tabs[current.value];
    return  getLiveCourseFilterList(useLiveCourse.liveCourseList,curLiveTab.value.key);
});

const onClickItem =async (e) => {
    if (current.value !== e.currentIndex) {
        current.value = e.currentIndex;
    }
    curLiveTab.value=tabs[current.value];
};

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
onLoad(async () => {
    loading.value=true;
    await useLiveCourse.queryLiveCourse();
    loading.value=false;
});
</script>

<style lang="scss" scoped>
.uni-padding-wrap {
  background-color: #fff;
  margin: 20rpx;
}
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
