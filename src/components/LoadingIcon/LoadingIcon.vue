
<template>
    <view>
        <view v-if="loading&&type==='cover'" class="loading">
            <image style="height: 100rpx;" src="@/static/svg/loading2.svg" />
            <text>{{ text }}</text>
        </view>
        <view v-else>
            <image style="height: 40rpx;" src="@/static/svg/loading2.svg" mode="heightFix" />
        </view>
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
    type:{
        type: String,
        default: 'cover',
    }
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
