<!--
 * @Author: Lowkey
 * @Date: 2024-01-22 14:23:14
 * @LastEditors: Lowkey
 * @LastEditTime: 2024-03-20 18:48:19
 * @FilePath: \BK-Portal-VUE\src\pageSub\lessonContent\index.vue
 * @Description:
-->

<template>
    <app-provider>
        <view class="header">
            <view class="btn">
                <uni-icons class="back" type="left" size="24" color="#fff" @click="router.back"></uni-icons>
                <uni-tag text="课程反馈" type="warning" />
            </view>
            <image class="course-img" :src="getImages(lessonData.courseImage)" mode="aspectFill" />
            <view class="course-info">
                <view class="course-name">{{ lessonData.fullname }}</view>
                <view class="course-tips">
                    <view class="tips-item">
                        <view class="item-title">成绩</view>
                        <view>{{ lessonData.graderaw }}</view>
                    </view>
                    <view v-if="showAttendance" class="tips-item">
                        <view class="item-title">{{ lessonData.openState === '1'?"考勤":"本周考勤" }}</view>
                        <AttendanceState :state="attendanceState" />
                    </view>
                    <view class="tips-item">
                        <view class="item-title">结课日期</view>
                        <view>{{ changeLessonDate(lessonData.enddate) }}</view>
                    </view>
                </view>
            </view>
        </view>
        <uni-notice-bar
            v-if="lessonData._useScriptFlag || lessonData._useScriptFunc"
            scrollable
            :text="useApp._useJavaScriptMessage?.info"
        />
        <uni-notice-bar
            v-if="lessonData._enableNoticeBar"
            scrollable
            :text="lessonData._enableNoticeBarMessage"
        />
        <view class="uni-padding-wrap">
            <uni-segmented-control :current="current" :values="tabsValue" style-type="text" active-color="#2b83d7" @click-item="onClickItem" />
            <Tour-content v-if="currentTab.key === 'tour'" class="lesson-content" />
            <Lesson-content v-if="currentTab.key === 'content'" class="lesson-content" />
            <attendance-details v-if="currentTab.key === 'attendance'" class="lesson-content" />
            <Live-content v-if="currentTab.key === 'liveCourse'" class="lesson-content" />
            <Live-course-list v-if="currentTab.key === 'liveCourseList'" class="live" :live-list="curLiveCourses" />
        </view>
    </app-provider>
</template>
<script lang="ts" setup>
import { useLessonStore } from '@/store/modules/lesson';
import { useAppStore } from '@/store/app';
import { useSetLog } from '@/hooks/useSetLog';
import { getImages, changeLessonDate } from '@/utils';
import TourContent from './components/TourContent.vue';
import LessonContent from './components/LessonContent.vue';
import AttendanceContent from './components/AttendanceContent.vue';
import LiveContent from './components/LiveContent.vue';
import LiveCourseList from './components/LiveCourseList.vue';
import {getLiveCourseFilterList} from '@/hooks/useLiveCourse';
import {useLiveCourseStore} from '@/store/modules/liveCourse';
import AttendanceDetails from '@/components/AttendanceDetails/AttendanceDetails.vue';

const { setLog, setCourseRecordLog } = useSetLog();
const useLesson = useLessonStore();
const useLiveCourse = useLiveCourseStore();
const useApp = useAppStore();
const router = useRouter();
const loading = ref(false);
const lessonData: Record<string, any> = computed(() => useLesson.lessonData);
const day_pass = computed(() => {
    const { attendance = {} } = lessonData.value;
    const { config = {} } = attendance;
    const { day_pass = '0' } = config;
    return day_pass;
});
const attendanceState = computed(() => {
    const { attendance = {},openState } = lessonData.value;
    const { stat ,weekStat} = attendance;
    return openState==='1'?stat:weekStat;
});
const current = ref(1); // 默认展示学习
const curLiveCourses=ref([]);
const showAttendance = computed(() => (lessonData.value.isAttendance && day_pass.value !== '0') || lessonData.value.attendanceType === '2');
const ALL_TABS = [
    {
        name: '课程导学',
        key: 'tour',
    },
    {
        name: '课程学习',
        key: 'content',
    },
    {
        name: '考勤',
        key: 'attendance',
    },
    {
        name: '直播列表',
        key: 'liveCourseList',
    },
    // {
    //     name: '课程管理',
    //     key: 'liveCourse',
    // },
];

const tabs = computed(() => {
    return ALL_TABS.filter((item) => {
        if(item.key === 'liveCourseList' ){
            return curLiveCourses.value.length>0;
        }else if (item.key === 'attendance') {
            return showAttendance.value;
        }else if (item.key === 'liveCourse') {
            return true;
        } else {
            return true;
        }
    });
});
const currentTab: Record<string, any> = ref(ALL_TABS[current.value]);
const tabsValue = computed(() => tabs.value.map((item) => item.name));
const onClickItem = (e: Record<string, any>) => {
    currentTab.value = tabs.value[e.currentIndex];
};
onLoad(async (options) => {
    if (options) {
        const { courseid } = options;
        loading.value = true;
        await useLesson.queryCourseContent({ courseid });
        await useLiveCourse.queryLiveCourse();
        if(lessonData.value.idnumber){
            curLiveCourses.value=getLiveCourseFilterList(useLiveCourse.liveCourseList,lessonData.value.idnumber);
        }
        loading.value=false;
        setLog({
            courseid,
            type: 'course',
        });
        setCourseRecordLog({ courseid });
    }
});
</script>
<style lang="scss" scoped>
.header {
  position: relative;
  border-bottom: 1px solid $uni-border-color;
  .btn {
    width: 100%;
    position: absolute;
    top: 20rpx;
    z-index: 2;
    padding: 0 20rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .back {
      background-color: rgb(0 0 0 / 50%);
      border-radius: 50%;
    }
  }
  .course-info {
    position: absolute;
    bottom: 0;
    z-index: 2;
    width: 100%;
    background-color: #fff;
    padding: 20rpx;
    border-radius: 30px 30px 0 0;
    .course-name {
      font-size: $uni-font-size-lg;
    }
    .course-tips {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: $uni-font-size-base;
      padding: 0 20rpx;
      margin-top: 16rpx;
      .tips-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        .item-title {
          margin-bottom: 8rpx;
          color: #065d87;
        }
      }
    }
  }
  .course-img {
    width: 100%;
    height: 300rpx;
  }
}
.uni-padding-wrap {
  background-color: #fff;
}
.lesson-content {
  margin-top: 16rpx;
  padding: 0 20rpx;
  height: 100%;
}
.live {
  height: 100%;
  background-color: $uni-bg-color-grey;
}
</style>
