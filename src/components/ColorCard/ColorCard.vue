<!--
 * @Author: Lowkey
 * @Date: 2024-06-11 11:33:29
 * @LastEditors: Lowkey
 * @LastEditTime: 2024-06-11 12:05:08
 * @FilePath: \BK-Portal-VUE\src\components\ColorCard\ColorCard.vue
 * @Description: 
-->
<template>
    <view class="container">
        <view class="header">
            <view class="info">
                <slot name="header"></slot>
            </view>
            <image src="@/static/images/bgImages/cardBg.png" class="bg" mode="center" />
        </view>
        <view class="content">
            <slot name="content"></slot>
        </view>
    </view>
</template>

<script setup name="ColorCard" lang="ts">
defineProps({
    text: {
        type: String,
        default: '-'
    }
});
</script>

<style lang="scss" scoped>
.container {
  padding: $uni-container-padding;
  .header {
    position: relative;
    overflow: hidden;
    border-radius: 20rpx 20rpx 0 0;
    color: #fff;
    .bg {
      position: absolute;
      inset: 0;
      width: 100%;
      z-index: 1;
    }
    .info {
      position: relative;
      width: 100%;
      padding: $uni-container-padding;
      font-size: $uni-font-size-m;
      z-index: 2;
    }
  }
  .content {
    background-color: #fff;
    padding: $uni-container-padding;
  }
}

</style>