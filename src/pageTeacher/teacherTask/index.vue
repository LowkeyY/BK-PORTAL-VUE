

<template>
    <view>
        <view class="uni-padding-wrap">
            <uni-segmented-control :current="current" :values="courses" style-type="text" active-color="#2b83d7" @click-item="onClickItem" />
        </view>
        <view class="list-container">
            <TaskStatistics v-if="current===0" />
            <TaskList v-else>
            </tasklist>
        </view>
    </view>
</template>

<script setup lang="ts">
import TaskList from './Components/TaskList.vue';
import TaskStatistics from './Components/TaskStatistics.vue';
const current = ref(0);
const courses = ref(['任务汇总', '任务列表']);
const onClickItem = (e) => {
    if (current.value !== e.currentIndex) {
        current.value = e.currentIndex;
    }
};
</script>

<style lang="scss" scoped>
.uni-padding-wrap {
  background-color: #fff;
  margin-bottom: 10rpx;
}

</style>
