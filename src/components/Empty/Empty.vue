<!--
 * @Author: Lowkey
 * @Date: 2023-10-30 13:42:48
 * @LastEditors: Lowkey
 * @LastEditTime: 2024-05-14 14:20:55
 * @FilePath: \BK-Portal-VUE\src\components\Empty\Empty.vue
 * @Description: 
-->
<template>
    <view class="empty">
        <view v-if="!loading">
            <image v-if="showImage" class="img" src="/static/images/empty.png" mode="aspectFix" />
            <view class="empty-text">{{ text }}</view>
        </view>
        <image v-else class="loading-img" src="/static/svg/loading2.svg" mode="aspectFix" />
    </view>
</template>

<script setup name="Empty">
defineProps({
    loading: {
        type: Boolean,
        default: false,
    },
    showImage: {
        type: Boolean,
        default: true,
    },
    text: {
        type: String,
        default: '没有数据!',
    },
});
</script>

<style scoped lang="scss">
.empty {
    text-align: center;
    padding-top: 60rpx;
    .img {
        width: 280rpx;
        height: 250rpx;
    }
    .loading-img {
        width: 180rpx;
        height: 100rpx;
    }
    .empty-text {
        color: $uni-text-color-placeholder;
        margin-bottom: 20rpx;
    }
}
</style>
