<!--
 * @Author: Lowkey
 * @Date: 2024-05-22 13:34:50
 * @LastEditors: Lowkey
 * @LastEditTime: 2024-06-10 19:09:29
 * @FilePath: \BK-Portal-VUE\src\pageTeacher\teacherTask\Components\TaskStatistics.vue
 * @Description: 
-->
<template>
    <view class="content">
        <uni-section class="section" title-font-size="34rpx" type="line" title="讨论区回帖任务">
            <text class="task-info">{{ `未完成任务数：${12}` }}</text>
        </uni-section>
        <uni-section class="section" title-font-size="34rpx" type="line" title="作业批改任务">
            <text class="task-info">{{ `未完成任务数：${12}` }}</text>
        </uni-section>
        <uni-section class="section" title-font-size="34rpx" type="line" title="测验评分任务">
            <text class="task-info">{{ `未完成任务数：${12}` }}</text>
        </uni-section>
        <view class="collection-time">
            <view>{{ `仅显示本周（${`2024.05.10`}）截止的未完成任务` }}</view>
            <view class="date">{{ `采集时间：${`2024.05.10`}` }}</view>
        </view>
    </view>
</template>
<script lang="ts" setup name="TaskStatistics">


</script>
<style lang="scss" scoped>
.content {
  background-color: #fff;
  padding-bottom: 60rpx;
}
.section {
  margin-bottom: 30rpx;
}
.task-info {
  padding: 30rpx;
  font-size: $uni-font-size-m;
}
.collection-time {
  font-size: $uni-font-size-lg;
  color: $uni-button-type-danger;
  margin-top: 60rpx;
  padding: $uni-container-padding;
  .date {
    margin-top: 20rpx;
    @include info;
  }
}
</style>
