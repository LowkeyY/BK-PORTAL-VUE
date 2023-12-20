<!--
 * @Author: Lowkey
 * @Date: 2023-12-14 14:43:01
 * @LastEditors: Lowkey
 * @LastEditTime: 2023-12-20 12:35:12
 * @FilePath: \BK-Portal-VUE\src\pages\index\index.vue
 * @Description: 
-->

<template>
    <view class="constainer">
        <view class="header">
            <image class="logo" src="/static/images/logos/logo.png" mode="heightFix" />
        </view>
        <view class="grid-container">
        </view>
    </view>
</template>
<script setup lang="ts">

import { useUserStore } from '@/store/modules/user';
import { useAuthStore } from '@/store/modules/auth';
import { useAppStore } from '@/store/app';

import {isBjouUser} from '@/utils';

const useUser = useUserStore();
const useAuth = useAuthStore();
const useApp = useAppStore();
const router = useRouter();

const init =async ()=>{
    await useUser.queryPortalUserInfoApi();
    if(isBjouUser()&&!useAuth.moodleToken){
        // 北开用户请求学习平台Token
        await useAuth.queryMoodleToken();
    }
    await useApp.queryMoodleBaseInfo();
};

onMounted(()=>{
    init();
});
</script>
<style lang="scss">
.constainer {
  .header {
    padding: 10rpx 40rpx 40rpx;
    background-color: #2b83d7;
    .logo {
      height: 100rpx;
    }
  }
  .grid-container {
    height: 600rpx;
    background: #fff;
    border-radius: 20px 20px 0 0;
    margin-top: -30rpx;
  }
}

</style>
