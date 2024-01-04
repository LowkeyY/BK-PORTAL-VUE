<!--
 * @Author: Lowkey
 * @Date: 2023-12-27 15:57:23
 * @LastEditors: Lowkey
 * @LastEditTime: 2024-01-02 17:26:32
 * @FilePath: \BK-Portal-VUE\src\pages\lessons\index.vue
 * @Description:
-->
<template>
    <view>
        <logo-header />
        <view class="uni-padding-wrap">
            <uni-segmented-control :current="current" :values="courses" style-type="button" active-color="#2b83d7" @click-item="onClickItem" />
        </view>
        <ComSkeleton type="list" :loading="loading">
            <view>
                <pull-refresh-list :list-data="dataState.listData" :has-more="hasMore" :has-more-loading="hasMoreLoading" @on-refresh="refresh" @load-more="loadMore">
                    <view v-if="current===0">
                        <view v-for="(curLesson) in dataState.listData" :key="curLesson.id" class="lesson">
                            <h4>{{ curLesson.fullname }}</h4>
                            <view class="lesson-content">
                                <view class="lesson-img">
                                    <image :src="getImages(curLesson.courseImage)" style="width: 100%;height: 100%;" mode="scaleToFill" />
                                </view>
                                <view class="lesson-msg-box">
                                    <view class="lesson-msg">{{ `责任教师：${curLesson.master.map(item=>item.fullname).join(',')}` }}</view>
                                    <view class="lesson-msg">{{ `结课日期：${changeLessonDate(curLesson.enddate) || '-'}` }}</view>
                                    <view>
                                        <uni-tag
                                            :text="curLesson.hasFinalExam?'终考课':'终考课'" :type="curLesson.hasFinalExam?'warning':'success'"
                                            size="normal"
                                        />
                                    </view>
                                </view>
                            </view>
                            <view class="progress-box">
                                <ComProgressBar
                                    class="bar"
                                    type="follow-right"
                                    :texture="[curLesson.graderaw >= 60 ? '#1eb259' : '#f34e14','#e3e3e3']"
                                    :disable-value="true"
                                    width="85%"
                                    :value="curLesson.graderaw/100"
                                />
                                <text
                                    :style="{
                                        paddingLeft:'10rpx',
                                        color:curLesson.graderaw >= 60 ? '#1eb259' : '#f34e14'
                                    }"
                                >
                                    {{ curLesson.graderaw }}
                                </text>
                            </view>
                        </view>
                    </view>
                    <view v-else>
                        <view v-for="(curLesson) in dataState.listData" :key="curLesson.id" class="lesson">
                            <h4>{{ curLesson.fullname }}</h4>
                            <view class="lesson-content">
                                <view class="lesson-img">
                                    <image :src="getImages(curLesson.courseImage)" style="width: 100%;height: 100%;" mode="scaleToFill" />
                                </view>
                                <view class="lesson-msg-box">
                                    <view class="lesson-msg">{{ `责任教师：${curLesson.master.map(item=>item.fullname).join(',')}` }}</view>
                                    <view
                                        v-if="curLesson.attendance"
                                        class="lesson-msg"
                                        :style="{
                                            color:curLesson.attendance.stat==1 ? '#1eb259' : '#f34e14'
                                        }"
                                    >
                                        {{ `考勤：${curLesson.attendance.stat==0?'未达标':'达标'}` }}
                                    </view>
                                    <view
                                        class="lesson-msg"
                                        :style="{
                                            color:curLesson.graderaw >= 60 ? '#1eb259' : '#f34e14'
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
        </ComSkeleton>
    </view>
</template>

<script setup lang="ts">
import ComSkeleton from '@/components/ComSkeleton/index.vue';
import ComProgressBar from '@/components/ComProgressBar/index.vue';
import {useAppStore} from '@/store/app';
import {courseListDueApi, courseListOpenApi} from '@/services/lesson';
import {useUserStore} from '@/store/modules/user';
import useRefreshList from '@/hooks/useRefreshList';
import {changeLessonDate, getImages} from '@/utils';

const appStore = useAppStore();
const useUser = useUserStore();
const current = ref(0);
const courses =ref(['在开课程', '已开课程']) ;
const params = reactive({
    searchData:{
        userid:useUser.moodleUserId,
        value:appStore.courseid,
    },
    searchApi: courseListOpenApi,
});

const { dataState,refresh, fetchList, loadMore, hasMore, loading ,hasMoreLoading} = useRefreshList(params, true);
const onClickItem = (e) => {
    if (current.value !== e.currentIndex) {
        current.value = e.currentIndex;
    }
    params.searchApi=current.value===0?courseListOpenApi:courseListDueApi;
    fetchList(params);
};

onShow( () => {
    setTimeout(()=>{
        current.value=0;
        params.searchApi=current.value===0?courseListOpenApi:courseListDueApi;
        fetchList(params);
    },0);
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
  padding: 20rpx;
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
      margin-left: 20rpx;
      .lesson-msg {
        color: #717171;
        font-size: 26rpx;
      }
    }
  }
  .progress-box {
    display: flex;
    height: 80rpx;
    align-items: center;
  }
}
</style>
