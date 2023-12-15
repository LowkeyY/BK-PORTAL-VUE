<script setup lang="ts">

import AppProvider from '@/components/AppProvider/index.vue';
import { CURRENT_PLATFORM, PLATFORMS } from '@/enums/platformEnum';
import { judgePlatform } from '@/utils/platform';
import Iconify from '@/components/Iconify/index.vue';
import { getEnvValue } from '@/utils/env';

const appTitle = getEnvValue<string>('VITE_APP_TITLE');

const title = ref(appTitle);

const platform = CURRENT_PLATFORM;

const isVue3 = judgePlatform(PLATFORMS.VUE3);

const router = useRouter();
const handleGetStarted = () => {
    router.pushTab({ path: '/pages/demo/index' });
};
</script>
<template>
    <AppProvider>
        <view class="content">
            <image class="logo" src="/static/svg/LOGO.svg" />
            <view class="text-area">
                <text class="">{{ title }}</text>
            </view>
            <view class="text-area">
                <text class="">Vue3: {{ isVue3 }}</text>
            </view>
            <view class="text-area">
                <text class="_u_text-red">当前平台: {{ platform }}</text>
            </view>
            <BasicButton @click="handleGetStarted">按钮</BasicButton>
            <view class="_u_text-red">uno css</view>
            <Iconify icon="i-ph-anchor-simple-thin" size="65" />
        </view>
    </AppProvider>
</template>
<style lang="scss">
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.logo {
  height: 200rpx;
  width: 200rpx;
  margin: 280rpx auto 50rpx;
}
.text-area {
  display: flex;
  justify-content: center;
  margin-bottom: 60rpx;
}
.title {
  font-size: 36rpx;
  color: #8f8f94;
}
</style>
