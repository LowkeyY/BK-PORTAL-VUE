<!--
 * @Author: Lowkey
 * @Date: 2023-10-30 13:42:48
 * @LastEditors: Lowkey
 * @LastEditTime: 2023-12-21 12:23:05
 * @FilePath: \BK-Portal-VUE\src\components\LogoHeader\LogoHeader.vue
 * @Description: 
-->
<template>
    <view class="constainer">
        <view class="img-box">
            <image class="logo" src="/static/images/logos/logo.png" mode="heightFix" />
        </view>
        <view class="bottom" />
    </view>
</template>


<style scoped lang="scss">
.constainer {
  position: relative;
  background-color: #2b83d7;
  box-sizing: border-box;
  .img-box {
    padding: 10rpx 40rpx 40rpx;
    .logo {
      height: 100rpx;
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
