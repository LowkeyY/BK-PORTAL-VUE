<!--
 * @Author: Lowkey
 * @Date: 2024-05-13 16:56:46
 * @LastEditors: Lowkey
 * @LastEditTime: 2024-06-11 10:29:41
 * @FilePath: \BK-Portal-VUE\src\pageTeacher\index\index.vue
 * @Description: 
-->

<template>
    <view>
        <search-header />
        <uni-section type="line" title="消息中心">
            <view class="message-bar">
                <view class="message-bar-item">
                    <view class="top">
                        <view class="count">
                            3
                            <text class="count-unit">条新消息</text>
                        </view>
                    </view>
                    <view class="message-title">门户消息</view>
                </view>
                <view class="message-bar-item has-border" @click="() => handleJumpToPage('StudentSuggestions')">
                    <view class="top">
                        <view class="count">
                            2
                            <text class="count-unit">条新消息</text>
                        </view>
                    </view>
                    <view class="message-title">学生反馈</view>
                </view>
                <view class="message-bar-item" @click="() => handleJumpToPage('teacherMessage')">
                    <view class="top">
                        <view class="count">
                            0
                            <text class="count-unit">条新消息</text>
                        </view>
                    </view>
                    <view class="message-title">学习平台站内信</view>
                </view>
            </view>
        </uni-section>
        <uni-section class="dealt-content" type="line" title="我的待办">
            <view class="dealt-bar">
                <uni-list-item show-arrow clickable :border="false">
                    <template #body>
                        <view class="dealt-content">
                            <view class="dealt-body">
                                <image class="icon" src="/static/images/spirit/dealt.svg" mode="widthFix" />
                                <uni-badge :is-dot="true" :text="totalCount > 0 ? totalCount : ''" absolute="rightTop" size="small">
                                    <view> {{ `您有${3}条待完成事项` }}</view>
                                </uni-badge>
                            </view>
                            <view class="extra"> 查看全部 </view>
                        </view>
                    </template>
                </uni-list-item>
            </view>
        </uni-section>
        <view class="application-content">
            <uni-section class="portal" type="line" title="门户应用">
                <view class="grid-container">
                    <uni-grid :column="4" :show-border="false" :square="false">
                        <uni-grid-item v-for="(item, index) in grids" :key="item.id" :index="index" @click="() => handleGridsClick(item)">
                            <view class="grid-item-box">
                                <image class="image" :src="item.icon || defaultIcon" mode="aspectFill" />
                                <text class="text">{{ item.text }}</text>
                            </view>
                        </uni-grid-item>
                    </uni-grid>
                </view>
            </uni-section>
            <uni-section type="line" title="业务直通车">
                <view class="grid-container">
                    <uni-grid :column="4" :show-border="false" :square="false">
                        <uni-grid-item v-for="(item, index) in grids" :key="item.id" :index="index" @click="() => handleGridsClick(item)">
                            <view class="grid-item-box">
                                <image class="image" :src="item.icon || defaultIcon" mode="aspectFill" />
                                <text class="text">{{ item.text }}</text>
                            </view>
                        </uni-grid-item>
                    </uni-grid>
                </view>
            </uni-section>
        </view>
    </view>
    <tab-bar />
</template>
<script lang="ts" setup>
import { useUserStore } from '@/store/modules/user';
import { useAuthStore } from '@/store/modules/auth';
import { useAppStore } from '@/store/app';
import { isTeacherUser } from '@/utils';
import { handleGridsClick, handleJumpToPage } from '@/utils/handle';
import useMessage from '@/hooks/useMessage';

const useUser = useUserStore();
const useAuth = useAuthStore();
const useApp = useAppStore();

const grids = computed(() => useApp.teacherGrids);
const defaultIcon = '/static/images/default/defaultGrids.svg';
const { queryMessageCounts, totalCount } = useMessage(false);

const init = async () => {
    await useUser.queryPortalUserInfoApi();
    if (isTeacherUser() && !useAuth.moodleToken) {
        // 北开用户请求学习平台Token
        await useAuth.queryMoodleToken();
    }
    useApp.queryMoodleBaseInfo();
    queryMessageCounts();
};

onShow(() => {
    init();
});
</script>
<style lang="scss" scoped>
::v-deep .uni-section-header {
  padding-bottom: 0 !important;
}
.message-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 30rpx 20rpx;
  .message-bar-item {
    width: 30%;
    background-color: #fff;
    .top {
      .count {
        font-size: 32rpx;
        padding: 0 20rpx 10rpx;
        font-weight: bold;
        text-align: center;
        color: $uni-color-warning;
        .count-unit {
          font-size: $uni-font-size-sm;
          color: $uni-color-subtitle;
          font-weight: normal;
        }
      }
    }
    .message-title {
      padding: 8rpx;
      font-size: $uni-font-size-base;
      text-align: center;
      color: $uni-color-subtitle;
    }
  }
  .has-border {
    border-left: 1px solid $uni-border-color;
    border-right: 1px solid $uni-border-color;
  }
}
.dealt-content {
  margin: $uni-spacing-col-lg 0;
  .uni-section-header {
    padding-bottom: 0 !important;
  }
  .dealt-bar {
    .dealt-content {
      display: flex;
      align-items: center;
      width: 100%;
      justify-content: space-between;
      font-size: $uni-font-size-base;
      .dealt-body {
        display: flex;
        align-items: center;
        .icon {
          width: 40rpx;
          margin-right: $uni-spacing-col-lg;
        }
      }
      .extra {
        color: $uni-color-primary;
      }
    }
  }
}
.grid-container {
  background-color: #fff;
  .grid-item-box {
    flex: 1;
    // position: relative;

    /* #ifndef APP-NVUE */
    display: flex;

    /* #endif */
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 16rpx 0;
    .image {
      width: 56rpx;
      height: 56rpx;
    }
    .text {
      margin-top: 20rpx;
      font-size: $uni-font-size-sm;
      color: $uni-text-color;
    }
  }
}
.application-content {
  padding: 0 10rpx;
  .portal {
    margin-bottom: $uni-spacing-col-lg;
  }
}
</style>
