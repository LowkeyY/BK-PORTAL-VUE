
<template>
    <app-provider>
        <nav-bar title="找回密码" />
        <view class="container">
            <image src="@/static/images/bgImages/loginBg.png" class="bg" />
            <view class="content">
                <view class="logo">
                    <uni-icons type="checkbox-filled" color="#52c41a" size="100"></uni-icons>
                    <uni-title type="h5" title="修改成功 密码已更新" align="center"></uni-title>
                </view>
                <button type="primary" class="next" @click="handleLogin">前往登录</button>
            </view>
        </view>
    </app-provider>
</template>

<script setup>

import {router} from '@/router';
import {Toast} from "@/utils/uniapi/prompt";

const handleLogin = () => {
    router.push({ name: 'Login' });
};

onLoad(()=>{
    Toast('修改成功',{icon:'success'})
})

</script>
<style lang="scss" scoped>
::v-deep .uni-easyinput__content {
  height: 100%;
}
::v-deep .container .content {
  text-align: left;
}
.flex {
  display: flex;
}
.container {
  margin: 0 auto;
  background-size: cover;
  height: 100%;
  .bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
  }
  .content {
    position: absolute;
    width: 100%;
    z-index: 2;
    text-align: center;
    padding: 100rpx;
    .logo {
      padding-bottom: 50rpx;
    }
    .input-container {
      height: 80rpx;
    }
    .next {
      height: 80rpx;
      line-height: 80rpx;
      font-size: 28rpx;
      margin: 0;
    }
  }
}
</style>
