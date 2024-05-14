<!--
 * @Author: Lowkey
 * @Date: 2024-01-17 13:52:11
 * @LastEditors: Lowkey
 * @LastEditTime: 2024-05-13 12:22:00
 * @FilePath: \BK-Portal-VUE\src\pageSub\messageCenter\index.vue
 * @Description: 
-->

<template>
    <view>
        <view class="uni-padding-wrap">
            <uni-segmented-control :current="current" :values="courses" style-type="text" active-color="#2b83d7" @click-item="onClickItem" />
        </view>
        <view class="list-container">
            <Activity v-if="current === 0" />
            <PrivateLetter v-else />
        </view>
    </view>
</template>

<script setup lang="ts">
import Activity from './components/Activity.vue';
import PrivateLetter from './components/PrivateLetter.vue';
const current = ref(0);
const courses = ref(['未读消息', '已读消息']);
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
.list-container {
    padding: 8rpx 20rpx 0;
}
</style>
