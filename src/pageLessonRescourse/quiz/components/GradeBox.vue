<!--
 * @Author: Lowkey
 * @Date: 2024-03-28 14:01:08
 * @LastEditors: Lowkey
 * @LastEditTime: 2024-03-29 12:25:00
 * @FilePath: \BK-Portal-VUE\src\pageLessonRescourse\quiz\components\GradeBox.vue
 * @Description: 
-->
<template>
    <view v-if="gradeData.finalgrade >= 0" class="grade-content">
        <view class="grade-item">
            <view class="grade">{{ `${getGrade(gradeData.finalgrade,gradeData.decimalpoints)}分` }}</view>
            <view class="total">{{ `满分：${gradeData.maxgrade}` }}</view>
        </view>
        <view v-if="gradeData.hasfeedback">
            <uni-section title="总体反馈" type="line" />
            <expand-content max-height="400rpx">
                <render-html :html="gradeData.feedbacktext" />
            </expand-content>
        </view>
    </view>
</template>

<script setup name="Link" lang="ts">
defineProps({
    gradeData: {
        type:Object,
        default:()=>{}
    }
});
const getGrade = (grade:number,decimalpoints:number) => {
    const multiplier = Math.pow(10, decimalpoints);
    return Math.round(grade * multiplier) / multiplier;
};
</script>

<style lang="scss" scoped>
.grade-content {
  margin: 30rpx 0;
  .grade-item {
    text-align: center;
    .grade {
      font-size: 48rpx;
      margin-bottom: 12rpx;
      color: #ff9a1b;
    }
    .total {
      font-size: $uni-font-size-base;
      color: $uni-color-subtitle;
    }
  }
}
</style>