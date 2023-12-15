


<script lang="ts" setup>
import BasicButton from '@/components/BasicButton/BasicButton.vue';
import AppProvider from '@/components/AppProvider/index.vue';


onLoad(() => {
    console.log('about load');
});

const isLogin = ref(false);
const router = useRouter();
onShow(() => {
  
});
const handleJump = (url: string) => {
    router.push(url);
};

// 登出
const handleLoginOut = () => {
    authStore.loginOut().then(() => {
        isLogin.value = false;
    });
};
</script>

<template>
    <AppProvider>
        <view class="container">
            <view class="head-wrap">
                <view class="avatar">
                    <image class="img" src="/static/images/avatar.png" />
                </view>
                <view class="desc">未登录</view>
            </view>
            <view class="cell">
                <BasicButton @click="handleJump('/pages/login/index')"> 登录 </BasicButton>
            </view>
        </view>
    </AppProvider>
</template>

<style lang="scss" scoped>
.container {
  padding: 96rpx 24rpx;
  .head-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    .avatar {
      height: 120rpx;
      width: 120rpx;
      border: 2rpx solid #d1d5db;
      border-radius: 120rpx;
      overflow: hidden;
      padding: 6rpx;
      .img {
        height: 100%;
        width: 100%;
      }
    }
    .desc {
      font-size: 28rpx;
      line-height: 120rpx;
    }
  }
  .cell {
    margin-top: 60rpx;
    text-align: center;
  }
}
</style>
