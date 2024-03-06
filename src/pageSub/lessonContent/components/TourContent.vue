<!--
 * @Author: Lowkey
 * @Date: 2024-01-24 18:25:09
 * @LastEditors: Lowkey
 * @LastEditTime: 2024-02-29 15:49:14
 * @FilePath: \BK-Portal-VUE\src\pageSub\lessonContent\components\TourContent.vue
 * @Description:
-->

<template>
    <pull-refresh-list type="content" show-skeleton :loading="useLesson.loading" :has-more="false" :is-refresh="isRefresh" @on-refresh="refresh">
        <view>
            <view v-if="teachersData.master.length||teachersData.tutor.length">
                <uni-section type="line" title="教师信息" />
                <view class="teachers-content">
                    <view v-for="master in teachersData.master" :key="master.id" class="teachers-item">
                        <view class="avatar">
                            <image class="img" :src="getImages(master.avatar)" mode="widthFix" />
                            <view class="role-container">
                                <text class="role">责</text>
                            </view>
                        </view>
                        <text class="name">{{ master.fullname }}</text>
                    </view>
                    <view v-for="tutor in teachersData.tutor" :key="tutor.id" class="teachers-item">
                        <view class="avatar">
                            <image class="img" :src="getImages(tutor.userData?.avatar)" mode="widthFix" />
                            <view class="role-container">
                                <text class="role">{{ tutor.roleData?.roleName.slice(0,1) }}</text>
                            </view>
                        </view>
                        <text class="name">{{ tutor.userData?.fullname }}</text>
                    </view>
                </view>
            </view>
            <view v-if="lessonData.summary!==''">
                <uni-section type="line" title="课程简介" />
                <render-html :html="lessonData.summary" />
            </view>
            <view v-if="tourSummary!==''">
                <render-html :html="tourSummary" />
            </view>
            <view v-if="lessonData.attendanceRule">
                <uni-section type="line" title="考勤要求" />
                <render-html :html="lessonData.attendanceRule" />
            </view>
            <view>
                <resource-list :list="resources" />
            </view>
        </view>
    </pull-refresh-list>
</template>
<script lang="ts" setup name="LessonTour">
import {useLessonStore} from '@/store/modules/lesson';
import { getImages } from '@/utils';
import ResourceList from './ResourceList.vue';
import {isEmpty} from '@/utils/is';
const useLesson = useLessonStore();
const lessonData:Record<string, any> = computed(()=>useLesson.lessonData);
const teachersData:Record<string, any> = computed(()=>useLesson.getTeachers);
const tourSummary= computed(()=>useLesson.getTourSummary);
const resources = computed(()=>useLesson.getTourContent);

//刷新
const isRefresh=ref(false);
const curCourseid=ref('');
const refresh =async (callback: () => void) => {
    isRefresh.value=true;
    try {
        await useLesson.queryCourseContent({ courseid:curCourseid.value });
    } finally {
        callback();
        isRefresh.value=false;
    }
};
onLoad(async (option)=>{
    const {courseid}=option;
    curCourseid.value=courseid;
});
</script>
<style lang="scss" scoped>
.teachers-content {
  display: flex;
  align-items: center;
  .teachers-item {
    display: flex;
    flex-direction: column;
    margin-right: 40rpx;
    align-items: center;
    .avatar {
      position: relative;
      margin-bottom: 10rpx;
      overflow: hidden;
      border-radius: 50%;
      .img {
        width: 100rpx;
        border-radius: 50%;
      }
      .role-container {
        position: absolute;
        bottom: 0;
        width: 100%;
        background-color: rgba($color: #00000084, $alpha: 60%);
        text-align: center;
        .role {
          color: #fff;
          font-size: $uni-font-size-sm;
        }
      }
    }
    .name {
      font-size: $uni-font-size-base;
      color: $uni-color-subtitle;
    }
  }
}
</style>
