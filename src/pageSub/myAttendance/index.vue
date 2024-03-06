<template>
    <view>
        <nav-bar title="我的考勤" />
        <pull-refresh-list :loading="loading" :has-more="false" :list-data="attendanceCourseList" :is-refresh="isRefresh" @on-refresh="refresh">
            <view>
                <view v-for="(curAttendance) in attendanceCourseList" :key="curAttendance.id" class="lesson" @click="()=>handleAttendanceDetail(curAttendance)">
                    <view class="lesson-title-container">
                        <text class="lesson-title">{{ curAttendance.fullname }}</text>
                    </view>
                    <view class="lesson-content">
                        <view class="lesson-img">
                            <image :src="getImages(curAttendance.courseImage)" style="width: 100%;height: 100%;" mode="scaleToFill" />
                        </view>
                        <view class="lesson-msg-box">
                            <view class="lesson-msg">
                                本周考勤 ：
                                <uni-tag
                                    :type="curAttendance.attendance.weekStat?'success':'error'"
                                    :text="curAttendance.attendance.weekStat?'达标':'未达标'"
                                    size="small"
                                />
                            </view>
                            <view class="lesson-msg">{{ `结课日期：${changeLessonDate(curAttendance.enddate) || '-'}` }}</view>
                        </view>
                    </view>
                </view>
            </view>
        </pull-refresh-list>
    </view>
</template>

<script setup lang="ts">

import {useAttendanceCourseStore} from '@/store/modules/attendance';
import {useUserStore} from '@/store/modules/user';
import {changeLessonDate, getImages} from '@/utils';
import {handleJumpToPage} from '@/utils/handle';

const useUser = useUserStore();
const useAttendanceCourse=useAttendanceCourseStore();
const loading=ref(false);
const isRefresh=ref(false);
const attendanceCourseList: Array<any> = computed(() => useAttendanceCourse.attendanceCourseList);

const handleAttendanceDetail = (data) => {
    const {id,attendanceType,enddate,fullname,startdate}=data;
    handleJumpToPage('attendanceDetail',{courseid:id,attendanceType,enddate,fullname,startdate});
};

const refresh =async (callback: () => void) => {
    isRefresh.value=true;
    try {
        await useAttendanceCourse.queryAttendanceCourseList();
    } finally {
        callback();
        isRefresh.value=false;
    }
};
onLoad(async () => {
    loading.value=true;
    await useAttendanceCourse.queryAttendanceCourseList();
    loading.value=false;
});
</script>

<style lang="scss" scoped>
.uni-padding-wrap {
  background-color: #fff;
  padding: 0 20rpx 10rpx;
}
.lesson {
  background-color: #fff;
  margin-top: 20rpx;
  padding: $uni-list-padding;
  .lesson-title {
    font-size: $uni-font-size-lg;
    color: $uni-color-title;
      font-weight: 600;
  }
  .lesson-content {
    padding: 10rpx 0;
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
