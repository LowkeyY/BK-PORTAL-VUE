<script lang="ts" setup>
import AppProvider from '@/components/AppProvider/index.vue';
import { userInfoApi } from '@/services/user';
import { Toast } from '@/utils/uniapi/prompt';
import { bkMineGirds, bkMineInfo } from '@/utils/mineConstants';
import LoadingIcon from '@/components/LoadingIcon/index.vue';
import { getPortalAvatar } from '@/utils';
import { getBaseUrl } from '@/utils/env';

const loading = ref(false);
const router = useRouter();
const curUserInfo:Record<string,any> = ref({});
const { PORTAL_SERVER } = getBaseUrl();
const curFileUrl = `${PORTAL_SERVER}/file/downloadFile`;
const handleJump = (url: string) => {
    router.push(url);
};

// 登出
// const handleLoginOut = () => {
//     authStore.loginOut().then(() => {
//         isLogin.value = false;
//     });
// };

const goSettings = () => {
    router.push({ name: 'settings' });
};

onMounted(async () => {
    loading.value = true;
    const { success, message, data } = await userInfoApi();
    if (success) {
        curUserInfo.value = data;
    } else {
        Toast(message);
    }
    loading.value = false;
});
</script>

<template>
    <AppProvider>
        <LoadingIcon :loading="loading"></LoadingIcon>
        <view class="mypage-container">
            <view class="mypage-top-box">
                <image src="@/static/images/bgImages/mineBg.png" class="bg" mode="scaleToFill" />
                <view class="mypage-top-content">
                    <view class="mypage-header">
                        <image class="avatar" :src="getPortalAvatar(curFileUrl, curUserInfo?.headImg || curUserInfo?.gkHeadImg)" mode=""></image>
                        <view class="userinfo">
                            <view class="top-text">
                                <view class="name">
                                    {{ curUserInfo?.userName }}
                                </view>
                                <uni-icons type="gear-filled" color="#fff" size="30" @click="goSettings"></uni-icons>
                            </view>
                            <view class="bottom-text">
                                <view class="accountName"> 学号: {{ curUserInfo?.studentNumber }} </view>
                                <text class="text">{{ `层次：${curUserInfo?.arrangement}` }}</text>
                            </view>
                        </view>
                    </view>
                    <view class="administrative">
                        {{ curUserInfo?.administrative }}
                    </view>
                    <view class="year">
                        <span>
                            {{ `招生年度：${curUserInfo?.enrollmentdate}` }}
                        </span>
                        <span>
                            {{ `学制：${curUserInfo?.educational}` }}
                        </span>
                    </view>
                </view>
            </view>
            <view class="userinfo-operate">
                <uni-grid :column="4" :show-border="false" :square="false" @change="change">
                    <uni-grid-item v-for="(item, index) in bkMineGirds" :key="item.id" :index="index">
                        <view class="grid-item-box">
                            <img class="icon" :src="`../static/images/grids/${item.icon}.svg`" />
                            <text class="text">{{ item.text }}</text>
                        </view>
                    </uni-grid-item>
                </uni-grid>
            </view>
            <view class="userinfo-box">
                <uni-section class="mb-10" type="line" title="个人信息">
                    <template #right>
                        <uni-icons type="compose" size="22" color="#2979ff"></uni-icons>
                    </template>
                </uni-section>
            </view>
            <uni-list v-for="(item, index) in bkMineInfo" :key="item.id" :index="index">
                <uni-list-item :show-extra-icon="true" :right-text="curUserInfo[item.key]" :extra-icon="item.extraIcon" :title="item.text" />
            </uni-list>
        </view>
    </AppProvider>
</template>

<style lang="scss" scoped>
.mypage-container {
  font-size: $uni-font-size-base-base;
  color: $uni-font-color-white;
  box-sizing: border-box;
  background-color: $uni-bg-color;
}
.mypage-top-box {
  margin: 0 auto;
  padding: $uni-spacing-row-lg;
  background-size: cover;
  position: relative;
  overflow: hidden;
  .bg {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 1;
  }
  .mypage-top-content {
    position: relative;
    width: 100%;
    z-index: 2;
  }
}
.mypage-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  .avatar {
    width: 145rpx;
    height: 145rpx;
    border-radius: 90rpx;
    margin-right: 20rpx;
  }
  .userinfo {
    flex: 1;
    .top-text {
      font-size: 40rpx;
      width: 100%;
      display: flex;
      justify-content: space-between;
      .name {
        margin-bottom: 20rpx;
        font-weight: bold;
      }
    }
    .bottom-text {
      display: flex;
      width: 100%;
      margin-top: 20rpx;
      justify-content: space-between;
    }
  }
}
.administrative {
  padding: $uni-list-padding;
}
.year {
  display: flex;
  width: 90%;
  padding-left: 16px;
  justify-content: space-between;
}
.userinfo-operate {
  position: relative;
  z-index: 2;
  background-color: $uni-bg-color;
  border-radius: 40rpx 40rpx 0 0;
  padding-top: 20rpx;
  .grid-item-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex: 1;
    .icon {
      width: 50%;
      height: 50%;
    }
    .text {
      margin-top: 20rpx;
      font-size: 26rpx;
      color: $uni-font-color-block;
    }
  }
}
</style>
