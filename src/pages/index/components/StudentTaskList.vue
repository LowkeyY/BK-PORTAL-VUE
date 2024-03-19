<!--
 * @Author: Lowkey
 * @Date: 2024-02-07 12:51:01
 * @LastEditors: Lowkey
 * @LastEditTime: 2024-03-19 14:52:20
 * @FilePath: \BK-Portal-VUE\src\pages\index\components\StudentTaskList.vue
 * @Description: 
-->
<template>
    <view v-for="item in list" :key="item.id" class="content">
        <view class="content-item" @click="!item.availabilityinfo?handleResourceClick(item,item.courseid):null">
            <view class="top">
                <view class="course-name text-ellipsis-1">{{ item.coursename }}</view>
                <view class="date" :style="{color: isToday(item.timestart) ? '#e20f09' : '#ff9a1b' }">
                    {{ `截止时间：${changeLessonDate(item.timestart)}` }}
                </view>
            </view>
            <view class="bottom">
                <view class="resource-name">
                    <image class="icon" mode="aspectFit" :src="getTaskIcon(item.modulename)"></image>
                    <view>{{ item.name }}</view>
                </view>
                <view v-if="item.availabilityinfo" class="availabilityinfo">
                    <render-html :html="item.availabilityinfo" :courseid="item.courseid" :tag-style="availabilityinfoHtmlStyles" />
                </view>
            </view>
        </view>
    </view>
</template>

<script setup name="StudentTaskList">
import useLessonResource from '@/hooks/useLessonResource';
import { getTaskIcon,isToday,changeLessonDate } from '@/utils';
import {availabilityinfoHtmlStyles} from '@/utils/constants';

const { handleResourceClick } = useLessonResource();
defineProps({
    list: {
        type: Array,
        default: ()=>[]
    },
});

</script>

<style scoped lang="scss">
.content {
  padding: $uni-container-padding $uni-container-padding 0;
}
.content-item {
  border-radius: $uni-border-radius-lg;
  padding: $uni-list-padding;
  background-color: #fff;
  .top {
    padding-bottom: 20rpx;
    margin-bottom: 20rpx;
    border-bottom: 1px solid $uni-border-color;
    .course-name {
      font-size: $uni-font-size-lg;
      margin-bottom: 10rpx;
    }
    .date {
      font-size: $uni-font-size-base;
    }
  }
  .bottom {
    .resource-name {
      display: flex;
      align-items: flex-end;
      font-size: $uni-font-size-base;
      .icon {
        width: 1.25em;
        height: 1.5em;
        margin-right: 10rpx;
      }
    }
  }
}
</style>