<!--
 * @Author: Lowkey
 * @Date: 2024-05-13 16:59:25
 * @LastEditors: Lowkey
 * @LastEditTime: 2024-05-14 14:19:26
 * @FilePath: \BK-Portal-VUE\src\pages\bjouSchedule\index.vue
 * @Description: 
-->

<template>
    <logo-header />
    <uni-calendar class="uni-calendar" :insert="true" :show-month="false" :selected="selected" @change="change" />
    <uni-section type="line" title="日程" />
    <empty />

    <uni-section type="line" title="课程" />
    <empty />

    <tab-bar />
</template>
<script lang="ts" setup>
const getDate = (date, AddDayCount = 0) => {
    if (!date) {
        date = new Date();
    }
    if (typeof date !== 'object') {
        date = date.replace(/-/g, '/');
    }
    const dd = new Date(date);

    dd.setDate(dd.getDate() + AddDayCount); // 获取AddDayCount天后的日期

    const y = dd.getFullYear();
    const m = dd.getMonth() + 1 < 10 ? '0' + (dd.getMonth() + 1) : dd.getMonth() + 1; // 获取当前月份的日期，不足10补0
    const d = dd.getDate() < 10 ? '0' + dd.getDate() : dd.getDate(); // 获取当前几号，不足10补0
    return {
        fullDate: y + '-' + m + '-' + d,
        year: y,
        month: m,
        date: d,
        day: dd.getDay(),
    };
};
const selected = ref([
    {
        date: getDate(new Date()).fullDate,
    },
]);
const change = (date) => {
    console.log(date);
};
</script>
<style lang="scss" scoped>
.uni-calendar {
    margin-bottom: 10rpx;
}
::v-deep .uni-calendar__header {
    height: 60rpx;
}
::v-deep .uni-calendar__backtoday {
    top: 0;
    height: 60rpx;
    line-height: 60rpx;
}
::v-deep .uni-calendar__header-btn-box {
    height: 60rpx;
}
::v-deep .uni-calendar__weeks-day {
    height: 60rpx;
}
::v-deep .uni-calendar-item__weeks-box-item {
    height: 60rpx;
}
</style>
