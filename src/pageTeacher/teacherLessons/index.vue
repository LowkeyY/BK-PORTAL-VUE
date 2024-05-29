<template>
    <view>
        <nav-bar title="课程" />
        <view class="uni-padding-wrap">
            <uni-segmented-control :current="current" :values="courses" style-type="button" active-color="#2b83d7" @click-item="onClickItem" />
        </view>

        <pull-refresh-list
            :loading="loading"
            :list-data="dataState.listData"
            :has-more="hasMore"
            :has-more-loading="hasMoreLoading"
            :is-refresh="isRefresh"
            @on-refresh="refresh"
            @load-more="loadMore"
        >
            <view v-if="current === 0">
                <view v-for="curLesson in dataState.listData" :key="curLesson.id" class="lesson" @click="() => handleGoContent(curLesson)">
                    <view class="lesson-title-container">
                        <text class="lesson-title">{{ curLesson.fullname }}</text>
                        <uni-tag
                            v-if="isLiveCourse(curLesson)"
                            text="直播课"
                            size="mini"
                            custom-style="background-color: #2b83d7; border-color: #4335d6; color: #fff;border-color:#2b83d7"
                        >
                        </uni-tag>
                    </view>
                    <view class="lesson-content">
                        <view class="lesson-img">
                            <image :src="getImages(curLesson.courseImage)" style="width: 100%; height: 100%" mode="scaleToFill" />
                        </view>
                        <view class="lesson-msg-box">
                            <view class="lesson-msg">{{ `责任教师：${curLesson.master.map((item) => item.fullname).join(',')}` }}</view>
                            <view class="lesson-msg">{{ `结课日期：${changeLessonDate(curLesson.enddate) || '-'}` }}</view>
                            <view>
                                <uni-tag v-if="curLesson.hasFinalExam" type="warning" text="终考课" size="small" />
                                <uni-tag v-if="curLesson.isAttendance" style="margin-left: 10rpx" type="success" text="考勤课" size="small" />
                            </view>
                        </view>
                    </view>
                </view>
            </view>
            <view v-else>
                <view v-for="curLesson in dataState.listData" :key="curLesson.id" class="lesson" @click="() => handleGoContent(curLesson)">
                    <view class="lesson-title-container">
                        <text class="lesson-title">{{ curLesson.fullname }}</text>
                        <uni-tag
                            v-if="isLiveCourse(curLesson)"
                            text="直播课"
                            size="mini"
                            custom-style="background-color: #2b83d7; border-color: #4335d6; color: #fff;border-color:#2b83d7"
                        >
                        </uni-tag>
                    </view>
                    <view class="lesson-content">
                        <view class="lesson-img">
                            <image :src="getImages(curLesson.courseImage)" style="width: 100%; height: 100%" mode="scaleToFill" />
                        </view>
                        <view class="lesson-msg-box">
                            <view class="lesson-msg">{{ `责任教师：${curLesson.master.map((item) => item.fullname).join(',')}` }}</view>
                            <view
                                v-if="curLesson.attendance"
                                class="lesson-msg"
                                :style="{
                                    color: curLesson.attendance.stat == 1 ? '#1eb259' : '#f34e14',
                                }"
                            >
                                {{ `考勤：${curLesson.attendance.stat == 0 ? '未达标' : '达标'}` }}
                            </view>
                            <view
                                class="lesson-msg"
                                :style="{
                                    color: curLesson.graderaw >= 60 ? '#1eb259' : '#f34e14',
                                }"
                            >
                                {{ `成绩：${curLesson.graderaw}` }}
                            </view>
                        </view>
                    </view>
                </view>
            </view>
        </pull-refresh-list>
    </view>
</template>

<script setup lang="ts">
import { useAppStore } from '@/store/app';
import { courseListDueApi, courseListOpenApi } from '@/services/lesson';
import { useUserStore } from '@/store/modules/user';
import useRefreshList from '@/hooks/useRefreshList';
import { handleJumpToPage } from '@/utils/handle';
import { changeLessonDate, getImages } from '@/utils';
import { useLiveCourseStore } from '@/store/modules/liveCourse';
import { getLiveCourseFilterList } from '@/hooks/useLiveCourse';

const useLiveCourse = useLiveCourseStore();
const appStore = useAppStore();
const useUser = useUserStore();
const current = ref(0);
const courses = ref(['在开课程', '已开课程']);
const params = reactive({
    searchData: {
        userid: useUser.moodleUserId,
        value: appStore.courseid,
    },
    searchApi: courseListOpenApi,
});
const isLiveCourse = (course: any) => {
    if (course.idnumber) {
        const filterArr = getLiveCourseFilterList(useLiveCourse.liveCourseList, course.idnumber);
        return filterArr.length > 0;
    }
    return false;
};
const { dataState, refresh, fetchList, loadMore, hasMore, isRefresh, loading, hasMoreLoading } = useRefreshList(params);
const onClickItem = async (e) => {
    if (current.value !== e.currentIndex) {
        current.value = e.currentIndex;
    }
    params.searchApi = current.value === 0 ? courseListOpenApi : courseListDueApi;
    await fetchList(params);
};
const handleGoContent = (data) => {
    const { id, attendanceType } = data;
    handleJumpToPage('lessonContent', { courseid: id, attendanceType });
};
onShow(() => {
    setTimeout(() => {
        params.searchApi = current.value === 0 ? courseListOpenApi : courseListDueApi;
        fetchList(params);
    }, 0);
});

onLoad(async () => {
    await useLiveCourse.queryLiveCourse();
});
</script>

<style lang="scss" scoped>
.uni-padding-wrap {
    background-color: #fff;
    padding: 20rpx 10rpx;
}
.lesson {
    background-color: #fff;
    margin-top: $uni-spacing-col-lg;
    padding: $uni-list-padding;
    .lesson-title {
        font-size: $uni-font-size-lg;
        color: $uni-color-title;
    }
    .lesson-content {
        display: flex;
        .lesson-img {
            width: 40%;
            height: 160rpx;
            border-radius: 20rpx;
            overflow: hidden;
        }
        .lesson-msg-box {
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            font-size: $uni-font-size-base;
            margin-left: $uni-spacing-col-lg;
            color: $uni-color-subtitle;
            .lesson-msg {
                color: #717171;
                font-size: 26rpx;
            }
        }
    }
}
</style>
