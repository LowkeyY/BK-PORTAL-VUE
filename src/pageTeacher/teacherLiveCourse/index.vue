<!--
 * @Author: Lowkey
 * @Date: 2024-05-13 16:56:46
 * @LastEditors: Lowkey
 * @LastEditTime: 2024-05-28 16:48:19
 * @FilePath: \BK-Portal-VUE\src\pageTeacher\teacherLiveCourse\index.vue
 * @Description: 
-->

<template>
    <view>
        <logo-header class="logo" />
        <view class="uni-padding-wrap">
            <uni-segmented-control
                :current="current"
                :values="tabs.map((item) => item.title)"
                style-type="button"
                active-color="#2b83d7"
                @click-item="onClickItem"
            />
        </view>
        <pull-refresh-list :loading="loading" :has-more="false" :list-data="dataState.listData" :is-refresh="isRefresh" @on-refresh="refresh">
            <view>
                <view v-for="(course, index) in dataState.listData" :key="index" class="course">
                    <uni-title type="h4" :title="`课程${toChineseNum(index + 1)}`" color="#171717"></uni-title>
                    <view class="courseTime">{{ `直播时间: 2323232` }}</view>
                    <view class="teacher-info">
                        <view>{{ `主讲教师：` }}</view>
                        <view>{{ `责任教师：` }}</view>
                    </view>
                </view>
            </view>
        </pull-refresh-list>
    </view>
    <tab-bar />
</template>
<script lang="ts" setup>
import useRefreshList from '@/hooks/useRefreshList';
import { informationListApi } from '@/services/notifications';
import { querySuggestionListlApi } from '@/services/suggestion';
import { useLiveCourseStore } from '@/store/modules/liveCourse';
import { getLiveCourseFilterList } from '@/hooks/useLiveCourse';
import { toChineseNum } from '@/utils';
import { useOpenUrl } from '@/hooks/useOpenUrl';

const useLiveCourse = useLiveCourseStore();
const current = ref(0);
const curLiveTab = ref({});
const tabs = [
    { title: '直播列表', key: 'live' },
    { title: '回放列表', key: 'playBack' },
];
const searchParams = reactive({
    searchData: {},
    searchApi: querySuggestionListlApi,
});
const { dataState, refresh, loadMore, hasMore, loading, isRefresh, hasMoreLoading } = useRefreshList(searchParams);
// const loading=ref(false);
// const isRefresh=ref(false);
const curLiveCourseList = computed(() => {
    curLiveTab.value = tabs[current.value];
    return getLiveCourseFilterList(useLiveCourse.liveCourseList, curLiveTab.value.key);
});

const onClickItem = async (e) => {
    if (current.value !== e.currentIndex) {
        current.value = e.currentIndex;
    }
    curLiveTab.value = tabs[current.value];
};

// const refresh =async (callback: () => void) => {
//     isRefresh.value=true;
//     try {
//         await useLiveCourse.queryLiveCourse();
//     } finally {
//         callback();
//         isRefresh.value=false;
//     }
// };

const goUrl = (course) => {
    if (course.playbackUrl) {
        useOpenUrl(course.playbackUrl);
    } else {
        useOpenUrl(course.joinUrl);
    }
};
onLoad(async () => {
    // loading.value=true;
    // await useLiveCourse.queryLiveCourse();
    // loading.value=false;
});
</script>
<style lang="scss" scoped>
.uni-padding-wrap {
  background-color: #fff;
  padding: 10rpx 20rpx;
}
.course {
  background-color: #fff;
  padding: $uni-list-padding;
  margin-bottom: 20rpx;
}
.courseTime {
  color: $uni-text-color-placeholder;
  font-size: $uni-font-size-m;
}
.teacher-info {
  display: flex;
  justify-content: space-between;
  padding-top: $uni-spacing-col-lg;
  font-size: $uni-font-size-m;
}
</style>
