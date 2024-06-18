<!--
 * @Author: Lowkey
 * @Date: 2023-10-30 13:42:48
 * @LastEditors: Lowkey
 * @LastEditTime: 2024-06-03 17:07:17
 * @FilePath: \BK-Portal-VUE\src\components\LogoHeader\LogoHeader.vue
 * @Description: 
-->
<template>
    <view class="constainer">
        <image class="header-logo" :style="{ height: `${160 + statusBarHeight}rpx` }" src="/static/images/logos/header.png" mode="scaleToFill" />
        <view class="img-box" :style="{top:`${20+statusBarHeight}rpx`}">
            <image class="logo" src="/static/images/logos/logo.png" mode="heightFix" />
        </view>
        <view class="bottom" />
    </view>
</template>
<script lang="ts" setup>
import { useSystem } from '@/hooks/app/useSystem';
import { px2rpx } from '@/utils/uniapi';
const statusBarHeight = px2rpx(useSystem().statusBarHeight || 0);

</script>
<style scoped lang="scss">
.constainer {
  position: relative;
  box-sizing: border-box;
  .header-logo {
    width: 100%;
    display: block;
    margin: 0;
    padding: 0;
    border: none;
  }
  .img-box {
    position: absolute;
    left: 20rpx;
    .logo {
      height: 80rpx;
    }
  }
  .bottom {
    position: absolute;
    bottom: 0;
    width: 100vw;
    height: 30rpx;
    background-color: #fff;
    border-radius: 20px 20px 0 0;
  }
}
</style>
