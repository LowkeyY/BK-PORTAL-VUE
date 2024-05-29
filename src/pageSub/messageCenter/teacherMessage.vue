<!--
 * @Author: Lowkey
 * @Date: 2024-05-21 16:52:09
 * @LastEditors: Lowkey
 * @LastEditTime: 2024-05-22 12:02:03
 * @FilePath: \BK-Portal-VUE\src\pageSub\messageCenter\teacherMessage.vue
 * @Description: 
-->
<template>
    <view>
        <view class="uni-padding-wrap">
            <uni-segmented-control :current="current" :values="tabs" style-type="text" active-color="#2b83d7" @click-item="onClickItem" />
        </view>
        <SuggestionList v-if="current === 0" />
        <view v-else>
            <round-tabs :current-index="currentIndex" :tab-list="tabList" @tab-click="handleTabClick" />
            <Activity v-if="currentIndex === 0" />
            <PrivateLetter v-if="currentIndex === 1" />
        </view>
    </view>
</template>

<script setup lang="ts">
import SuggestionList from './components/SuggestionList.vue';
import Activity from './components/Activity.vue';
import PrivateLetter from './components/PrivateLetter.vue';
const current = ref(0);
const currentIndex = ref(0);
const tabs = ref(['来自APP', '来自网页']);
const tabList = [
    {
        name: '通知',
        key: 'notice',
    },
    {
        name: '站内信',
        key: 'message',
    },
];
const handleTabClick = (index: number) => {
    currentIndex.value = index;
};
const onClickItem = (e) => {
    if (current.value !== e.currentIndex) {
        current.value = e.currentIndex;
    }
};
</script>

<style lang="scss" scoped>
.uni-padding-wrap {
    background-color: #fff;
}
</style>
