<!--
 * @Author: Lowkey
 * @Date: 2024-05-22 11:02:01
 * @LastEditors: Lowkey
 * @LastEditTime: 2024-05-22 11:58:11
 * @FilePath: \BK-Portal-VUE\src\components\RoundTabs\RoundTabs.vue
 * @Description: 
-->
<template>
    <view class="container">
        <scroll-view scroll-x="true" class="tow-scroll" :show-scrollbar="false" :scroll-with-animation="true" :scroll-left="scrollLeft">
            <view
                v-for="(item, index) in tabList"
                :key="index"
                class="scroll-tags"
                :style="{ color: currentIndex == index ? '#ffffff' : '#333', background: currentIndex == index ? bgColor : '#EEEEEE' }"
                @click="setTags(index)"
            >
                {{ item.name }}
                <uni-badge :text="item.badge" />
            </view>
        </scroll-view>
    </view>
</template>

<script setup name="RoundTabs">
defineProps({
    currentIndex: {
        type: Number,
        default: 0,
    },
    bgColor: {
        type: String,
        default: '#2b83d7',
    },
    tabList: {
        type: Array,
        default: () => [],
    },
});
const emits = defineEmits(['tab-click']);
const scrollLeft = ref(0);
const setTags = (index) => {
    emits('tab-click', index);
};
</script>

<style scoped lang="scss">
.container {
    background-color: #fff;
}
.tow-scroll {
    height: 80rpx;
    line-height: 80rpx;
    padding: 0 10rpx;
    white-space: nowrap;
    .scroll-tags {
        display: inline-block;
        background-color: #fff8f5;
        color: #202020;
        height: 50rpx;
        line-height: 50rpx;
        padding: 0 25rpx;
        text-align: center;
        font-size: 24rpx;
        border-radius: 30rpx;
        margin: 0 10rpx;
    }
}
</style>
