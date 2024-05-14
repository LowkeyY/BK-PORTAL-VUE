<!--
 * @Author: Lowkey
 * @Date: 2023-10-30 13:42:48
 * @LastEditors: Lowkey
 * @LastEditTime: 2024-05-13 15:13:21
 * @FilePath: \BK-Portal-VUE\src\components\LogoHeader\LogoHeader.vue
 * @Description: 
-->
<template>
    <view class="constainer">
        <image class="header-logo" src="/static/images/logos/header.png" mode="widthFix" />
        <view class="img-box">
            <image class="logo" src="/static/images/logos/logo.png" mode="heightFix" />
        </view>
        <view class="bottom" />
    </view>
</template>

<style scoped lang="scss">
.constainer {
    position: relative;
    box-sizing: border-box;
    .header-logo {
        width: 100%;
    }
    .img-box {
        position: absolute;
        top: 20rpx;
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
