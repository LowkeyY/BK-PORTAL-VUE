<!--
 * @Author: Lowkey
 * @Date: 2023-10-30 13:42:48
 * @LastEditors: Lowkey
 * @LastEditTime: 2023-10-30 16:14:13
 * @FilePath: \ALS-Education-Charity-Trust-Weapp\src\components\Empty\index.vue
 * @Description: 
-->
<template>
    <view class="empty">
        <view v-if="!loading">
            <img class="img" src="@/static/images/empty.png" alt="">
            <view class="empty-text">{{ text }}</view>
        </view>
        <img v-else class="loading-img" src="@/static/svg/loading2.svg" alt="">
    </view>
</template>

<script setup name="Empty">
defineProps({
    loading: {
        type: Boolean,
        default: false
    },
    text: {
        type: String,
        default: '没有数据'
    }
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
  }
}
</style>
