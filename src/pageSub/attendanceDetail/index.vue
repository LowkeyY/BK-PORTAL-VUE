<template>
    <view>
        <nav-bar title="考勤详情" />
        <view class="container">
            <attendance-details />
        </view>
    </view>
</template>

<script setup lang="ts">
import AttendanceDetails from '@/components/AttendanceDetails/AttendanceDetails.vue';
</script>

<style lang="scss" scoped>
.container {
  padding: 20rpx;
}
</style>
