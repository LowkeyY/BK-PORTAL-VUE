<template>
    <view v-if="loading" class="loading">
        <img style="height: 100rpx" src="@/static/svg/loading2.svg" alt="" />
        <text>{{ text }}</text>
    </view>
</template>

<script setup>
defineProps({
    loading: {
        type: Boolean,
        default: true,
    },
    text: {
        type: String,
        default: '加载中...',
    },
});
</script>

<style scoped>
.loading {
    z-index: 9;
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: #515454;
    background-color: #fff;
}
</style>
